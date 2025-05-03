"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Music, ImageIcon, RefreshCw, Trophy } from "lucide-react";
import ImageGallery from "@/components/image-gallery";

export default function FinalRoom() {
  const [activeTab, setActiveTab] = useState<
    "message" | "gallery" | "playlist"
  >("message");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

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
                You've solved all the puzzles and unlocked your special
                surprise!
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
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">
                      HAPPY 24TH BIRTHDAYYYYYYYYYY!!!!!!!
                    </h2>
                    <p className="text-slate-700 mb-4">
                      Congratulations on completing all the puzzles in this
                      dreamy escape room! Your creativity and persistence have
                      led you to this special moment.
                    </p>
                    <p className="text-slate-700 mb-4">
                      AMAL ya AMAL i HOPE that you achiver everything you ever
                      wanted surtt sna tkameel kraytek o tekhou diplomek o
                      tefrah.And honestly i HOPE that you continue this journey
                      that you are in it of discovering yourself, learning
                      yourself, loving yourself. And from the bottom of me heart
                      ya AMAL, im really proud of you, and i know from now on,
                      its going to be even better. CHEERRRRSS DARLINGGG FOR
                      PUSHHING THROUGH ANOTHER YEARR. As someone wise once said
                      to me :
                    </p>
                    <p className="text-forest-600 font-medium">
                      " It's not about forgetting who you are, it's about
                      embracing yourself! " ✨
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                    Memory Gallery
                  </h2>
                  <ImageGallery images={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
                  <p className="text-center text-slate-500 mt-4">
                    Click on any image to view it in full size.
                  </p>
                </motion.div>
              )}

              {activeTab === "playlist" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                    Custom Playlist
                  </h2>
                  <div className="space-y-2">
                    {[
                      {
                        title: "Light dark light",
                        artist: "Fred again..",
                        duration: "3:07",
                        url: "https://www.youtube.com/watch?v=14NvwgZhzSI",
                      },
                      {
                        title: "I'm a party ",
                        artist: "Fred again::",
                        duration: "4:15",
                        url: "https://www.youtube.com/watch?v=BkL4oMeSgDA",
                      },
                      {
                        title: "Our Happy Memory Song",
                        artist: "Edward Sharpe & The Magnetic Zeros - Home",
                        duration: "3:23",
                        url: "https://www.youtube.com/watch?v=DHEOF_rcND8&pp=ygUTaG9tZSBlZGl0aCB3aGlza2Vycw%3D%3D",
                      },

                      {
                        title: "A New Discovery Just for You",
                        artist: "TWO LANES - Live from Málaga",
                        duration: "4:07",
                        url: "https://www.youtube.com/watch?v=27cedsZpN4w&t=1310s",
                      },
                    ].map((song, i) => (
                      <a
                        key={i}
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center mr-3">
                          <Music className="h-4 w-4 text-forest-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">
                            {song.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {song.artist}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          {song.duration}
                        </div>
                      </a>
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
  );
}
