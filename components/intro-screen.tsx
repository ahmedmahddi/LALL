"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Palette, Scissors, Dog, ImageIcon } from "lucide-react";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-forest-200">
          <CardContent className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 font-serif text-forest-500">
              Welcome Birthday Girl
            </h1>

            <p className="text-lg text-center mb-8 text-slate-700">
              On this, your 24th birthday, destiny calls you to embark on a
              chaotic quest of puzzles and mystery! The path will challenge your
              wit, test your courage, and maybe drive you a little mad (but in a
              good way 😉). Stay strong, brave soul — for rewards beyond your
              wildest dreams await at the journey’s end. So take a deep breath,
              sharpen your mind… and never, ever give up!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { icon: <Coffee className="h-6 w-6" />, name: "Coffee Corner" },
                {
                  icon: <Scissors className="h-6 w-6" />,
                  name: "Crochet Nook",
                },
                {
                  icon: <Palette className="h-6 w-6" />,
                  name: "Sudoku Puzzle",
                },
                { icon: <Dog className="h-6 w-6" />, name: "Maze Puzzle" },
                {
                  icon: <ImageIcon className="h-6 w-6" />,
                  name: "Moon Puzzle",
                },
              ].map((room, index) => (
                <motion.div
                  key={room.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm"
                >
                  <div className="bg-forest-100 p-3 rounded-full mb-2 text-forest-500">
                    {room.icon}
                  </div>
                  <span className="text-sm font-medium">{room.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={onStart}
                size="lg"
                className="bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white px-8"
              >
                Begin Your Escape
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
