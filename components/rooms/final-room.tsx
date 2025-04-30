"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Gift, Music, ImageIcon, RefreshCw, Trophy } from "lucide-react"

export default function FinalRoom() {
  const [activeTab, setActiveTab] = useState<"message" | "gallery" | "playlist">("message")
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-gradient-to-br from-forest-50 to-forest-200 border-forest-300 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <Trophy className="h-12 w-12 text-forest-500 mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif bg-gradient-to-r from-forest-600 to-forest-800 text-transparent bg-clip-text">
                  Congratulations!
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-slate-700"
              >
                You've solved all the puzzles and unlocked your special surprise!
              </motion.p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-full">
                <Button
                  variant={activeTab === "message" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("message")}
                  className={activeTab === "message" ? "bg-forest-500" : ""}
                >
                  <Heart className="h-4 w-4 mr-1" /> Message
                </Button>
                <Button
                  variant={activeTab === "gallery" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("gallery")}
                  className={activeTab === "gallery" ? "bg-forest-500" : ""}
                >
                  <ImageIcon className="h-4 w-4 mr-1" /> Gallery
                </Button>
                <Button
                  variant={activeTab === "playlist" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("playlist")}
                  className={activeTab === "playlist" ? "bg-forest-500" : ""}
                >
                  <Music className="h-4 w-4 mr-1" /> Playlist
                </Button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 min-h-[300px]">
              {activeTab === "message" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-6 text-center">
                    <Gift className="h-16 w-16 text-forest-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Special Message</h2>
                    <p className="text-slate-700 mb-4">
                      Congratulations on completing all the puzzles in this dreamy escape room! Your creativity and
                      persistence have led you to this special moment.
                    </p>
                    <p className="text-slate-700 mb-4">
                      This space is meant for a personalized message from the creator to you. It could be birthday
                      wishes, words of appreciation, or any heartfelt message that makes this experience truly special.
                    </p>
                    <p className="text-forest-600 font-medium">
                      Remember, the journey through this creative space was made with love, just for you! ✨
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Memory Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-4xl">📸</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-slate-500 mt-4">
                    This is where special photos and memories would be displayed.
                  </p>
                </motion.div>
              )}

              {activeTab === "playlist" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Custom Playlist</h2>
                  <div className="space-y-2">
                    {[
                      "Your Favorite Song #1",
                      "A Song That Reminds Me of You",
                      "Our Happy Memory Song",
                      "That One Song You Always Play",
                      "A New Discovery Just for You",
                    ].map((song, i) => (
                      <div
                        key={i}
                        className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center mr-3">
                          <Music className="h-4 w-4 text-forest-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{song}</div>
                          <div className="text-xs text-slate-500">Artist Name</div>
                        </div>
                        <div className="text-xs text-slate-400">3:42</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="gap-2 text-forest-600 border-forest-200 hover:bg-forest-50"
              >
                <RefreshCw className="h-4 w-4" /> Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
