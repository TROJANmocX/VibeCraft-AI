import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { emotion, confidence } = await request.json()

    if (!emotion) {
      return NextResponse.json({ error: "No emotion provided" }, { status: 400 })
    }

    let quoteText = "Every moment is a fresh beginning."
    let author = "T.S. Eliot"
    let journalPrompt = undefined

    // Try to use OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const { generateText } = await import("ai")
        const { openai } = await import("@ai-sdk/openai")

        // Generate quote based on emotion
        const { text: quoteResponse } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: `Generate an inspiring and relevant quote for someone feeling "${emotion}". Return the response in this exact format: "Quote text" - Author Name`,
          maxTokens: 100,
        })

        // Parse quote and author
        const quoteParts = quoteResponse.split(" - ")
        quoteText = quoteParts[0]?.replace(/"/g, "") || quoteText
        author = quoteParts[1] || author

        // Generate journal prompt for certain emotions
        if (["sad", "anxious", "frustrated", "lonely"].includes(emotion.toLowerCase())) {
          const { text: prompt } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: `Create a thoughtful, therapeutic journal prompt for someone feeling "${emotion}". Make it encouraging and introspective, around 1-2 sentences.`,
            maxTokens: 80,
          })
          journalPrompt = prompt
        }
      } catch (aiError) {
        console.error("AI generation failed, using fallback quotes:", aiError)
        // Fall through to use fallback quotes
      }
    }

    // Fallback quotes if AI is not available
    if (quoteText === "Every moment is a fresh beginning.") {
      const fallbackQuotes = getFallbackQuote(emotion)
      quoteText = fallbackQuotes.text
      author = fallbackQuotes.author
    }

    // Fallback journal prompts
    if (!journalPrompt && ["sad", "anxious", "frustrated", "lonely"].includes(emotion.toLowerCase())) {
      journalPrompt = getFallbackJournalPrompt(emotion)
    }

    // Generate background image based on emotion
    const backgroundImage = `/placeholder.svg?height=400&width=800&query=${emotion} mood aesthetic background with soft colors and calming elements`

    // Get music recommendation
    const musicData = getMusicForEmotion(emotion)

    const moodData = {
      emotion,
      confidence,
      quote: {
        text: quoteText,
        author,
      },
      musicUrl: musicData.url,
      musicDescription: musicData.description,
      backgroundImage,
      journalPrompt,
    }

    return NextResponse.json(moodData)
  } catch (error) {
    console.error("Error generating mood content:", error)

    // Complete fallback data
    const fallbackData = {
      emotion: "calm",
      confidence: 0,
      quote: {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
      musicDescription: "Relaxing music to match your current mood",
      backgroundImage: "/placeholder.svg?height=400&width=800",
      journalPrompt: undefined,
    }

    return NextResponse.json(fallbackData)
  }
}

function getFallbackQuote(emotion: string) {
  const quotes: Record<string, { text: string; author: string }> = {
    happy: {
      text: "Happiness is not something ready made. It comes from your own actions.",
      author: "Dalai Lama",
    },
    sad: {
      text: "The wound is the place where the Light enters you.",
      author: "Rumi",
    },
    excited: {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    calm: {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha",
    },
    anxious: {
      text: "You have been assigned this mountain to show others it can be moved.",
      author: "Mel Robbins",
    },
    angry: {
      text: "Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else.",
      author: "Buddha",
    },
    frustrated: {
      text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.",
      author: "Winston Churchill",
    },
    hopeful: {
      text: "Hope is being able to see that there is light despite all of the darkness.",
      author: "Desmond Tutu",
    },
    grateful: {
      text: "Gratitude turns what we have into enough.",
      author: "Anonymous",
    },
    lonely: {
      text: "The greatest thing in the world is to know how to belong to oneself.",
      author: "Michel de Montaigne",
    },
  }

  return quotes[emotion.toLowerCase()] || quotes.calm
}

function getFallbackJournalPrompt(emotion: string) {
  const prompts: Record<string, string> = {
    sad: "What small act of kindness could you show yourself today? Write about one thing you're grateful for, even in this difficult moment.",
    anxious:
      "What are three things you can control right now? Focus on these and write about how taking small actions might help ease your worries.",
    frustrated:
      "What is this frustration trying to teach you? Write about what you've learned from similar challenges in the past.",
    lonely:
      "Think of a time when you felt truly connected to someone or something. What made that moment special, and how can you create more connections like that?",
  }

  return (
    prompts[emotion.toLowerCase()] ||
    "Take a moment to reflect on your current feelings. What do you need most right now?"
  )
}

function getMusicForEmotion(emotion: string) {
  const musicMap: Record<string, { url: string; description: string }> = {
    happy: {
      url: "https://www.youtube.com/embed/ZbZSe6N_BXs",
      description: "Upbeat and joyful music to celebrate your happiness",
    },
    sad: {
      url: "https://www.youtube.com/embed/4fndeDfaWCg",
      description: "Gentle, comforting melodies to help process your emotions",
    },
    excited: {
      url: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
      description: "Energetic music to match your excitement and enthusiasm",
    },
    calm: {
      url: "https://www.youtube.com/embed/jfKfPfyJRdk",
      description: "Peaceful ambient sounds to maintain your sense of tranquility",
    },
    anxious: {
      url: "https://www.youtube.com/embed/1ZYbU82GVz4",
      description: "Soothing music to help ease anxiety and promote relaxation",
    },
    angry: {
      url: "https://www.youtube.com/embed/hHW1oY26kxQ",
      description: "Music to help channel and release intense emotions constructively",
    },
    frustrated: {
      url: "https://www.youtube.com/embed/1ZYbU82GVz4",
      description: "Calming sounds to help reduce frustration and restore balance",
    },
    hopeful: {
      url: "https://www.youtube.com/embed/ZbZSe6N_BXs",
      description: "Uplifting music to nurture your sense of hope and optimism",
    },
    grateful: {
      url: "https://www.youtube.com/embed/jfKfPfyJRdk",
      description: "Warm, appreciative melodies to celebrate gratitude",
    },
    lonely: {
      url: "https://www.youtube.com/embed/4fndeDfaWCg",
      description: "Comforting music to provide companionship during solitude",
    },
  }

  return musicMap[emotion.toLowerCase()] || musicMap.calm
}
