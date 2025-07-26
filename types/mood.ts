export interface MoodData {
  emotion: string
  confidence?: number
  quote: {
    text: string
    author: string
  }
  musicUrl: string
  musicDescription: string
  backgroundImage: string
  journalPrompt?: string
}

export interface EmotionAnalysisResult {
  emotion: string
  confidence: number
}
