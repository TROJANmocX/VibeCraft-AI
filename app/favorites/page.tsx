"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Trash2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { MoodData } from "@/types/mood"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<MoodData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from a database or API
    // For demo purposes, we'll use localStorage
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem("moodboard-favorites")
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
      } catch (error) {
        console.error("Error loading favorites:", error)
        toast.error("Failed to load favorites")
      } finally {
        setIsLoading(false)
      }
    }

    // Simulate network delay for demo purposes
    setTimeout(loadFavorites, 1000)
  }, [])

  const removeFavorite = (index: number) => {
    const newFavorites = [...favorites]
    newFavorites.splice(index, 1)
    setFavorites(newFavorites)
    
    // Save to localStorage
    localStorage.setItem("moodboard-favorites", JSON.stringify(newFavorites))
    toast.success("Removed from favorites")
  }

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: "from-yellow-400 to-orange-500",
      sad: "from-blue-400 to-indigo-600",
      excited: "from-pink-400 to-red-500",
      calm: "from-green-400 to-teal-500",
      anxious: "from-purple-400 to-indigo-500",
      angry: "from-red-500 to-pink-600",
      frustrated: "from-orange-500 to-red-500",
      hopeful: "from-emerald-400 to-blue-500",
      grateful: "from-amber-400 to-yellow-500",
      lonely: "from-slate-400 to-blue-500",
    }
    return colors[emotion as keyof typeof colors] || "from-purple-400 to-blue-500"
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

      <div className="relative z-10 max-w-6xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Your Favorite MoodBoards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Save and revisit the moods that resonated with you
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
            />
          </div>
        ) : favorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favorites.map((favorite, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl h-full flex flex-col">
                  <div className={`bg-gradient-to-r ${getEmotionColor(favorite.emotion)} p-4 text-white relative`}>
                    <h3 className="text-xl font-semibold capitalize">{favorite.emotion}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(index)}
                      className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 flex-grow">
                    <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 leading-relaxed">
                      "{favorite.quote.text}"
                    </blockquote>
                    <cite className="text-sm text-gray-600 dark:text-gray-400">— {favorite.quote.author}</cite>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        // In a real app, this would navigate to the full moodboard
                        toast.info("This would open the full moodboard in a real app")
                      }}
                    >
                      View Full MoodBoard
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                When you find a MoodBoard you love, click the heart icon to save it here for easy access.
              </p>
              <Button
                onClick={() => {
                  // Navigate to home
                  window.location.href = "/"
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Create a MoodBoard
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}