"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Scissors, RotateCcw, Info } from "lucide-react";
import RoomNavigation from "@/components/room-navigation";

interface CrochetRoomProps {
  onSolve: () => void;
  isSolved: boolean;
  onNavigate: (room: string) => void;
}

type PatchColor = "pink" | "yellow" | "green" | "blue" | "purple" | "white";
type PatchPosition = { row: number; col: number };

export default function CrochetRoom({
  onSolve,
  isSolved,
  onNavigate,
}: CrochetRoomProps) {
  const [selectedColor, setSelectedColor] = useState<PatchColor>("yellow");
  const [attempt, setAttempt] = useState(false);
  const [hint, setHint] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize a 11x11 grid for the granny square
  const initialGrid: PatchColor[][] = Array(11)
    .fill(null)
    .map(() => Array(11).fill("yellow"));
  const [grid, setGrid] = useState<PatchColor[][]>(initialGrid);

  // The correct pattern matching the image
  const correctPattern: PatchColor[][] = [
    [
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "pink",
      "yellow",
      "pink",
      "yellow",
      "pink",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "pink",
      "pink",
      "pink",
      "pink",
      "pink",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "pink",
      "pink",
      "pink",
      "pink",
      "pink",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "pink",
      "pink",
      "green",
      "pink",
      "pink",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "pink",
      "pink",
      "pink",
      "pink",
      "pink",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "green",
      "yellow",
      "pink",
      "pink",
      "pink",
      "yellow",
      "green",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "green",
      "green",
      "yellow",
      "green",
      "yellow",
      "green",
      "green",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "green",
      "green",
      "green",
      "green",
      "green",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
    [
      "yellow",
      "yellow",
      "yellow",
      "green",
      "green",
      "green",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
    ],
  ];

  const colors: {
    color: PatchColor;
    bgClass: string;
    borderClass: string;
    name: string;
  }[] = [
    {
      color: "pink",
      bgClass: "bg-pink-400",
      borderClass: "border-pink-500",
      name: "Pink",
    },
    {
      color: "yellow",
      bgClass: "bg-yellow-400",
      borderClass: "border-yellow-500",
      name: "Yellow",
    },
    {
      color: "green",
      bgClass: "bg-forest-300",
      borderClass: "border-forest-400",
      name: "Green",
    },
    {
      color: "blue",
      bgClass: "bg-blue-400",
      borderClass: "border-blue-500",
      name: "Blue",
    },
    {
      color: "purple",
      bgClass: "bg-purple-400",
      borderClass: "border-purple-500",
      name: "Purple",
    },
    {
      color: "white",
      bgClass: "bg-white",
      borderClass: "border-gray-200",
      name: "White",
    },
  ];

  const handleColorSelect = (color: PatchColor) => {
    setSelectedColor(color);
  };

  const handlePatchClick = (row: number, col: number) => {
    if (isSolved) return;

    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
  };

  const checkPattern = () => {
    setAttempt(true);

    // Check if the pattern matches the correct pattern
    let isCorrect = true;
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 11; col++) {
        if (grid[row][col] !== correctPattern[row][col]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }

    if (isCorrect) {
      onSolve();
    }
  };

  const resetPattern = () => {
    setGrid(initialGrid);
    setAttempt(false);
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm border-forest-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-forest-500 font-serif flex items-center gap-2">
              <Scissors className="h-5 w-5" /> Crochet Nook
            </h2>
            {isSolved && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Check className="h-4 w-4" /> Solved
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-forest-50 rounded-lg p-4 flex justify-center">
                <div className="grid grid-cols-11 gap-1">
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.button
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePatchClick(rowIndex, colIndex)}
                        className={`w-8 h-8 rounded-lg ${
                          colors.find(c => c.color === cell)?.bgClass
                        } border-2 ${
                          colors.find(c => c.color === cell)?.borderClass
                        } crochet-cell ${
                          grid[rowIndex][colIndex] ===
                            correctPattern[rowIndex][colIndex] && attempt
                            ? "ring-1 ring-green-500"
                            : ""
                        }`}
                        disabled={isSolved}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-forest-600 mb-2">
                  Yarn Colors:
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(colorObj => (
                    <button
                      key={colorObj.color}
                      onClick={() => handleColorSelect(colorObj.color)}
                      className={`w-10 h-10 rounded-full ${
                        colorObj.bgClass
                      } border-2 ${
                        selectedColor === colorObj.color
                          ? "ring-2 ring-offset-2 ring-forest-500"
                          : colorObj.borderClass
                      }`}
                      disabled={isSolved}
                      title={colorObj.name}
                    />
                  ))}
                </div>
                <div className="mt-2 text-sm text-forest-500">
                  Selected: {colors.find(c => c.color === selectedColor)?.name}
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-forest-500 border-forest-200 flex items-center gap-1"
                >
                  <Info className="h-4 w-4" />
                  {showInfo ? "Hide Info" : "What's a Granny Square?"}
                </Button>
              </div>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-forest-50 border border-forest-100 rounded-lg text-left text-sm"
                >
                  <p className="text-forest-700">
                    A granny square is a crochet technique where you create a
                    small square by working in rounds from the center outward.
                    This pattern features a specific arrangement of colors to
                    create a decorative design. They're popular for blankets,
                    clothing, and decorative items.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-700 mb-4">
                  A new Alien has emerged from the portals created inside the
                  pyramids and demanded a granny patch with a pattern for tulip
                  or he will evaporate the whole world
                </p>
                <p className="text-slate-700 mb-4">
                  Select a yarn color and click on the grid to create your
                  pattern. The grid is already filled with white, and you need
                  to add pink and green according to the pattern.
                </p>

                {attempt && !isSolved && (
                  <p className="text-rose-600 mb-4">
                    That's not quite right. Compare your pattern with the
                    reference.
                  </p>
                )}

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={checkPattern}
                    disabled={isSolved}
                    className="bg-forest-500 hover:bg-forest-600"
                  >
                    Check Pattern
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPattern}
                    className="text-forest-500 border-forest-200"
                    disabled={isSolved}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> Reset
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHint(!hint)}
                    className="text-forest-500 border-forest-200"
                  >
                    {hint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>

                {hint && (
                  <div className="p-3 bg-forest-50 border border-forest-100 rounded-lg mb-4">
                    <p className="text-forest-700 text-sm">
                      <span className="font-medium">Hint:</span> The pattern has
                      a pink heart-like shape in the upper part, with green
                      shapes in the lower part. The background is yellow.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-forest-100 border border-forest-200 rounded-lg">
                  <p className="text-forest-700 text-sm font-medium">
                    Pattern Progress:
                  </p>
                  <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-forest-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (grid
                            .flat()
                            .filter(
                              (cell, i) => cell === correctPattern.flat()[i]
                            ).length /
                            (11 * 11)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {isSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg"
                >
                  <p className="text-green-800 font-medium">
                    Beautiful work! You've created the perfect pattern. Feel
                    free to explore the other rooms.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/*<RoomNavigation onNavigate={onNavigate} currentRoom="crochet" />*/}
    </div>
  );
}
