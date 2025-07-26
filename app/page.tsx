"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Type, Sparkles, Download, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WebcamDetection from "@/components/webcam-detection"
import TextMoodInput from "@/components/text-mood-input"
import MoodBoard from "@/components/mood-board"
import type { MoodData } from "@/types/mood"

export default function Home() {
  const [detectionMode, setDetectionMode] = useState<"webcam" | "text" | null>(null)
  const [moodData, setMoodData] = useState<MoodData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleMoodDetected = async (emotion: string, confidence?: number) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-mood-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, confidence }),
      })

      if (response.ok) {
        const data = await response.json()
        setMoodData(data)
      }
    } catch (error) {
      console.error("Error generating mood content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetMoodBoard = () => {
    setMoodData(null)
    setDetectionMode(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            MoodBoard AI
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover your emotions and get personalized content to match your mood
          </p>
        </motion.div>

        {/* API Status Notice */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Demo Mode Active</p>
              <p className="text-blue-700 dark:text-blue-300">
                This app uses intelligent fallback systems for emotion detection and content generation. For enhanced AI
                features, an OpenAI API key can be configured.
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!moodData && !detectionMode && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDetectionMode("webcam")}
                  className="text-center"
                >
                  <Camera className="w-16 h-16 mx-auto mb-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
                  <h3 className="text-2xl font-semibold mb-2">Facial Detection</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use your webcam to detect emotions through facial expressions
                  </p>
                </motion.div>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDetectionMode("text")}
                  className="text-center"
                >
                  <Type className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <h3 className="text-2xl font-semibold mb-2">Text Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Describe how you're feeling and let AI analyze your mood
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          )}

          {detectionMode === "webcam" && !moodData && (
            <motion.div
              key="webcam"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WebcamDetection onMoodDetected={handleMoodDetected} onBack={() => setDetectionMode(null)} />
            </motion.div>
          )}

          {detectionMode === "text" && !moodData && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TextMoodInput onMoodDetected={handleMoodDetected} onBack={() => setDetectionMode(null)} />
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="inline-block"
              >
                <Sparkles className="w-16 h-16 text-purple-600 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2">Creating Your MoodBoard</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generating personalized content based on your emotion...
              </p>
            </motion.div>
          )}

          {moodData && (
            <motion.div
              key="moodboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <Button
                  onClick={resetMoodBoard}
                  variant="outline"
                  className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New MoodBoard
                </Button>
              </div>
              <MoodBoard moodData={moodData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
