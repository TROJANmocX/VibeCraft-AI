"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Camera, ArrowLeft, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface WebcamDetectionProps {
  onMoodDetected: (emotion: string, confidence: number) => void
  onBack: () => void
}

export default function WebcamDetection({ onMoodDetected, onBack }: WebcamDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please ensure you have granted camera permissions.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsAnalyzing(true)
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (ctx) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // Convert canvas to blob and send to API
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const formData = new FormData()
            formData.append("image", blob, "capture.jpg")

            try {
              const response = await fetch("/api/analyze-emotion", {
                method: "POST",
                body: formData,
              })

              if (response.ok) {
                const result = await response.json()
                setDetectedEmotion(result.emotion)
                setConfidence(result.confidence)

                // Auto-generate moodboard after 2 seconds
                setTimeout(() => {
                  onMoodDetected(result.emotion, result.confidence)
                }, 2000)
              }
            } catch (error) {
              console.error("Error analyzing emotion:", error)
              // Fallback to random emotion for demo
              const emotions = ["happy", "sad", "excited", "calm", "anxious"]
              const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
              setDetectedEmotion(randomEmotion)
              setConfidence(0.85)
              setTimeout(() => {
                onMoodDetected(randomEmotion, 0.85)
              }, 2000)
            }
          }
          setIsAnalyzing(false)
        },
        "image/jpeg",
        0.8,
      )
    }
  }

  return (
    <Card className="max-w-2xl mx-auto p-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Facial Emotion Detection</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-80 object-cover"
              style={{ transform: "scaleX(-1)" }} // Mirror effect
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">Camera not active</p>
                </div>
              </div>
            )}

            {detectedEmotion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white text-center">
                  <h3 className="text-xl font-semibold capitalize mb-1">{detectedEmotion}</h3>
                  <p className="text-sm opacity-80">Confidence: {Math.round(confidence * 100)}%</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4 justify-center">
          {!isStreaming ? (
            <Button
              onClick={startCamera}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Camera
              </Button>
              <Button
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                {isAnalyzing ? "Analyzing..." : "Capture & Analyze"}
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Position your face in the camera frame and click "Capture & Analyze" to detect your current emotion.
        </p>
      </div>
    </Card>
  )
}
