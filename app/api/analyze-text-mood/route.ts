import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const { generateText } = await import("ai")
        const { openai } = await import("@ai-sdk/openai")

        // Use AI to analyze the emotion in the text
        const { text: emotionAnalysis } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: `Analyze the emotion in this text and return only the primary emotion as a single word (happy, sad, excited, calm, anxious, angry, frustrated, hopeful, grateful, lonely, etc.): "${text}"`,
          maxTokens: 10,
        })

        const emotion = emotionAnalysis.trim().toLowerCase()
        return NextResponse.json({ emotion })
      } catch (aiError) {
        console.error("AI analysis failed, using fallback:", aiError)
        // Fall through to fallback logic
      }
    }

    // Fallback emotion detection using keyword analysis
    const text_lower = text.toLowerCase()
    const emotion = "calm"

    // Enhanced keyword-based emotion detection
    const emotionKeywords = {
      happy: [
        "happy",
        "joy",
        "joyful",
        "excited",
        "great",
        "amazing",
        "wonderful",
        "fantastic",
        "cheerful",
        "delighted",
        "thrilled",
        "elated",
        "blissful",
        "content",
        "pleased",
      ],
      sad: [
        "sad",
        "down",
        "depressed",
        "unhappy",
        "miserable",
        "heartbroken",
        "devastated",
        "gloomy",
        "melancholy",
        "sorrowful",
        "grief",
        "mourning",
        "blue",
        "dejected",
      ],
      anxious: [
        "anxious",
        "worried",
        "nervous",
        "stressed",
        "panic",
        "fear",
        "scared",
        "overwhelmed",
        "tense",
        "uneasy",
        "restless",
        "apprehensive",
        "concerned",
      ],
      angry: [
        "angry",
        "mad",
        "furious",
        "rage",
        "irritated",
        "annoyed",
        "pissed",
        "livid",
        "outraged",
        "hostile",
        "bitter",
        "resentful",
      ],
      frustrated: [
        "frustrated",
        "annoyed",
        "irritated",
        "fed up",
        "stuck",
        "blocked",
        "hindered",
        "thwarted",
        "exasperated",
      ],
      excited: [
        "excited",
        "thrilled",
        "pumped",
        "energized",
        "enthusiastic",
        "eager",
        "anticipating",
        "looking forward",
      ],
      lonely: ["lonely", "alone", "isolated", "abandoned", "disconnected", "solitary", "friendless"],
      grateful: ["grateful", "thankful", "blessed", "appreciative", "fortunate", "lucky"],
      hopeful: ["hopeful", "optimistic", "positive", "confident", "encouraged", "inspired", "motivated"],
      calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "zen", "balanced", "centered"],
    }

    // Find the emotion with the most keyword matches
    let maxMatches = 0
    let detectedEmotion = "calm"

    for (const [emotionKey, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter((keyword) => text_lower.includes(keyword)).length
      if (matches > maxMatches) {
        maxMatches = matches
        detectedEmotion = emotionKey
      }
    }

    return NextResponse.json({ emotion: detectedEmotion })
  } catch (error) {
    console.error("Error analyzing text mood:", error)
    return NextResponse.json({ emotion: "calm" })
  }
}
