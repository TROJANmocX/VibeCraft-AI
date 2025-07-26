"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface TextMoodInputProps {
  onMoodDetected: (emotion: string) => void
  onBack: () => void
}

export default function TextMoodInput({ onMoodDetected, onBack }: TextMoodInputProps) {
  const [moodText, setMoodText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)

  const analyzeMood = async () => {
    if (!moodText.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-text-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: moodText }),
      })

      if (response.ok) {
        const result = await response.json()
        setDetectedEmotion(result.emotion)

        // Auto-generate moodboard after showing detected emotion
        setTimeout(() => {
          onMoodDetected(result.emotion)
        }, 2000)
      }
    } catch (error) {
      console.error("Error analyzing mood:", error)
      // Fallback emotion detection for demo
      const emotions = ["happy", "sad", "excited", "calm", "anxious", "frustrated", "hopeful"]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      setDetectedEmotion(randomEmotion)
      setTimeout(() => {
        onMoodDetected(randomEmotion)
      }, 2000)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      analyzeMood()
    }
  }

  const moodSuggestions = [
    "I feel overwhelmed with work today",
    "I'm excited about my upcoming vacation",
    "I feel lonely and need some comfort",
    "I'm anxious about an important meeting",
    "I feel grateful for my friends and family",
    "I'm frustrated with my current situation",
    "I feel peaceful and content right now",
  ]

  return (
    <Card className="max-w-2xl mx-auto p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Describe Your Mood</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="space-y-6">
        {!detectedEmotion ? (
          <>
            <div className="space-y-4">
              <Textarea
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me how you're feeling... (e.g., 'I feel stressed about work' or 'I'm excited about the weekend')"
                className="min-h-32 text-lg resize-none backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500"
                disabled={isAnalyzing}
              />

              <Button
                onClick={analyzeMood}
                disabled={!moodText.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Analyzing your mood...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Analyze My Mood
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Need inspiration? Try one of these:
              </p>
              <div className="grid gap-2">
                {moodSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMoodText(suggestion)}
                    className="text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-sm transition-colors"
                  >
                    "{suggestion}"
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-purple-600" />
            </motion.div>

            <h3 className="text-3xl font-bold mb-4">
              Detected Emotion: <span className="capitalize text-purple-600">{detectedEmotion}</span>
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-6">Creating your personalized MoodBoard...</p>

            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <p className="text-sm italic text-gray-700 dark:text-gray-300">"{moodText}"</p>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}
