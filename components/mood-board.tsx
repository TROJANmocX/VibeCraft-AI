"use client"

import { motion } from "framer-motion"
import { Quote, Music, Heart, BookOpen, Share2, Download, BookmarkPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { MoodData } from "@/types/mood"
import { useState, useEffect } from "react"

interface MoodBoardProps {
  moodData: MoodData
}

export default function MoodBoard({ moodData }: MoodBoardProps) {
  const [journalEntry, setJournalEntry] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  
  useEffect(() => {
    // Check if this moodboard is already in favorites
    try {
      const savedFavorites = localStorage.getItem("moodboard-favorites")
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites) as MoodData[]
        const isAlreadyFavorite = favorites.some(
          (fav) => fav.emotion === moodData.emotion && fav.quote.text === moodData.quote.text
        )
        setIsFavorite(isAlreadyFavorite)
      }
    } catch (error) {
      console.error("Error checking favorites:", error)
    }
  }, [moodData])

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

  const shouldShowJournal = ["sad", "anxious", "frustrated", "lonely"].includes(moodData.emotion.toLowerCase())

  const toggleFavorite = () => {
    try {
      const savedFavorites = localStorage.getItem("moodboard-favorites")
      let favorites: MoodData[] = savedFavorites ? JSON.parse(savedFavorites) : []
      
      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(
          (fav) => !(fav.emotion === moodData.emotion && fav.quote.text === moodData.quote.text)
        )
        toast.success("Removed from favorites")
      } else {
        // Add to favorites
        favorites.push(moodData)
        toast.success("Added to favorites")
      }
      
      localStorage.setItem("moodboard-favorites", JSON.stringify(favorites))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error updating favorites:", error)
      toast.error("Failed to update favorites")
    }
  }

  const shareMoodboard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${moodData.emotion} Mood`,
          text: `"${moodData.quote.text}" - ${moodData.quote.author}`,
          url: window.location.href,
        })
        toast.success("Shared successfully")
      } catch (error) {
        console.error("Error sharing:", error)
        toast.error("Failed to share")
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(
        `Check out my ${moodData.emotion} mood on MoodBoard AI: "${moodData.quote.text}" - ${moodData.quote.author}`
      )
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Mood Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl">
          {/* Emotion Header */}
          <div className={`bg-gradient-to-r ${getEmotionColor(moodData.emotion)} p-8 text-white text-center`}>
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold capitalize mb-2"
            >
              {moodData.emotion}
            </motion.h2>
            {moodData.confidence && (
              <p className="text-lg opacity-90">Confidence: {Math.round(moodData.confidence * 100)}%</p>
            )}
          </div>

          {/* Background Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              src={moodData.backgroundImage}
              alt={`${moodData.emotion} mood background`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <Quote className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                  "{moodData.quote.text}"
                </blockquote>
                <cite className="text-lg text-gray-600 dark:text-gray-400">— {moodData.quote.author}</cite>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Music Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Music for Your Mood</h3>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={moodData.musicUrl}
              title="Mood Music"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{moodData.musicDescription}</p>
        </Card>
      </motion.div>

      {/* Journal Prompt (for sad/anxious emotions) */}
      {shouldShowJournal && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="p-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Journal Prompt</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium">{moodData.journalPrompt}</p>
              </div>

              <Textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Take a moment to reflect and write your thoughts here..."
                className="min-h-32 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50"
              />

              <Button
                onClick={() => {
                  // Here you could save the journal entry
                  alert("Journal entry saved! (This is a demo)")
                }}
                variant="outline"
                className="w-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Save Journal Entry
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 mt-6"
      >
        <Button
          variant="outline"
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 flex items-center gap-2"
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <>
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              Favorited
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              Add to Favorites
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 flex items-center gap-2"
          onClick={shareMoodboard}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        
        <Button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Save MoodBoard
        </Button>
      </motion.div>
      
      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          size="icon"
          className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 w-12"
          aria-label="Scroll to top"
        >
          ↑
        </Button>
      </motion.div>
    </div>
  )
}
