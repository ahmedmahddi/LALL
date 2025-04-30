"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ImageIcon, RotateCcw, HelpCircle, Info } from "lucide-react";
import RoomNavigation from "@/components/room-navigation";

interface GalleryRoomProps {
  onSolve: () => void;
  isSolved: boolean;
  onNavigate: (room: string) => void;
}

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
}

export default function GalleryRoom({
  onSolve,
  isSolved,
  onNavigate,
}: GalleryRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(false);
  const [attempt, setAttempt] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Create a 3x3 puzzle (9 pieces)
  const initialPieces: PuzzlePiece[] = [
    { id: 0, correctPosition: 0, currentPosition: 6 },
    { id: 1, correctPosition: 1, currentPosition: 8 },
    { id: 2, correctPosition: 2, currentPosition: 2 },
    { id: 3, correctPosition: 3, currentPosition: 0 },
    { id: 4, correctPosition: 4, currentPosition: 4 },
    { id: 5, correctPosition: 5, currentPosition: 7 },
    { id: 6, correctPosition: 6, currentPosition: 3 },
    { id: 7, correctPosition: 7, currentPosition: 1 },
    { id: 8, correctPosition: 8, currentPosition: 5 },
  ];

  const [pieces, setPieces] = useState<PuzzlePiece[]>(initialPieces);

  const handleDragStart = (id: number) => {
    if (isSolved) return;
    setDraggedPiece(id);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    checkSolution();
  };

  const handleDrop = (targetPosition: number) => {
    if (isSolved || draggedPiece === null) return;

    const draggedPieceIndex = pieces.findIndex(
      piece => piece.id === draggedPiece
    );
    if (draggedPieceIndex === -1) return;

    const targetPieceIndex = pieces.findIndex(
      piece => piece.currentPosition === targetPosition
    );
    if (targetPieceIndex === -1) return;

    // Swap positions
    const newPieces = [...pieces];
    const draggedPiecePosition = newPieces[draggedPieceIndex].currentPosition;
    newPieces[draggedPieceIndex].currentPosition = targetPosition;
    newPieces[targetPieceIndex].currentPosition = draggedPiecePosition;

    setPieces(newPieces);
    setMoveCount(moveCount + 1);
  };

  const checkSolution = () => {
    setAttempt(true);

    // Check if all pieces are in their correct positions
    const isCorrect = pieces.every(
      piece => piece.currentPosition === piece.correctPosition
    );

    if (isCorrect) {
      onSolve();
    }
  };

  const resetPuzzle = () => {
    setPieces(initialPieces);
    setAttempt(false);
    setMoveCount(0);
  };

  const getPieceStyle = (piece: PuzzlePiece) => {
    // Calculate the position in the grid
    const row = Math.floor(piece.currentPosition / 3);
    const col = piece.currentPosition % 3;

    // Calculate the background position to show the correct part of the image
    const bgRow = Math.floor(piece.correctPosition / 3);
    const bgCol = piece.correctPosition % 3;

    return {
      gridRow: `${row + 1} / span 1`,
      gridColumn: `${col + 1} / span 1`,
      backgroundPosition: `${bgCol * 50}% ${bgRow * 50}%`,
    };
  };

  // Calculate how many pieces are in the correct position
  const correctPieces = pieces.filter(
    piece => piece.currentPosition === piece.correctPosition
  ).length;

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border-forest-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-forest-500 font-serif flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Lunar Puzzle
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
                <div
                  ref={containerRef}
                  className="w-[300px] h-[300px] grid grid-cols-3 grid-rows-3 gap-1 bg-black relative puzzle-container"
                >
                  {pieces.map(piece => (
                    <motion.div
                      key={piece.id}
                      style={{
                        ...getPieceStyle(piece),
                        backgroundImage:
                          "url('https://lunaf.com/img/moon/m-phase-12.webp')",
                        backgroundSize: "300% 300%",
                        zIndex: draggedPiece === piece.id ? 10 : 1,
                      }}
                      className={`w-full h-full bg-forest-200 cursor-move border border-forest-300 puzzle-piece ${
                        piece.currentPosition === piece.correctPosition &&
                        attempt
                          ? "ring-1 ring-green-500"
                          : ""
                      }`}
                      draggable={!isSolved}
                      onDragStart={() => handleDragStart(piece.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDrop(piece.currentPosition)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 1.05 }}
                    />
                  ))}

                  {isSolved && (
                    <div className="puzzle-complete-overlay">
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        className="bg-white px-4 py-2 rounded-lg shadow-lg text-forest-600 font-bold"
                      >
                        Completed!
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-center flex-col items-center">
                <div className="text-center">
                  <p className="text-sm text-forest-600 mb-2">
                    {isSolved
                      ? "Completed: Waxing Gibbous Moon Phase"
                      : "Drag and drop pieces to solve the puzzle"}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-forest-500">
                    <span>Moves: {moveCount}</span>
                    <span>•</span>
                    <span>
                      Correct pieces: {correctPieces}/{pieces.length}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-forest-500 border-forest-200 flex items-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    {showInfo ? "Hide Info" : "About Moon Phases"}
                  </Button>
                </div>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-forest-50 border border-forest-100 rounded-lg text-left text-sm"
                  >
                    <p className="text-forest-700">
                      The Waxing Gibbous moon phase occurs when the Moon is more
                      than half illuminated but not yet fully lit. This phase
                      comes after First Quarter and before the Full Moon,
                      typically visible in the afternoon and evening. During
                      this phase, the Moon appears to grow (wax) toward
                      fullness, with approximately 75% of its surface
                      illuminated by sunlight.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-700 mb-4">
                  Welcome, Celestial Seeker! The sacred phases of the Moon lie
                  scattered, its cosmic energy disrupted across fragments of
                  light and shadow. Only a true lunar observer — and a clever
                  mind — can restore its natural order. Align the pieces
                  correctly to reveal the Moon's true form. The cycle of the
                  Moon depends on you.
                </p>
                <p className="text-slate-700 mb-4">
                  Drag and drop the puzzle pieces to swap their positions. Try
                  to recreate the complete image.
                </p>

                {attempt && !isSolved && (
                  <p className="text-rose-600 mb-4">
                    That's not quite right. Keep rearranging the pieces to
                    complete the painting.
                  </p>
                )}

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={checkSolution}
                    disabled={isSolved}
                    className="bg-forest-500 hover:bg-forest-600"
                  >
                    Check Solution
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPuzzle}
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
                    <HelpCircle className="h-3 w-3 mr-1" />
                    {hint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>

                {hint && (
                  <div className="p-3 bg-forest-50 border border-forest-100 rounded-lg mb-4">
                    <p className="text-forest-700 text-sm">
                      <span className="font-medium">Hint:</span> You're trying
                      to recreate a Waxing Gibbous moon phase. Look for the
                      curved edge of shadow and the bright illuminated portion.
                      The darker regions should align on the left side with the
                      bright areas on the right.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-forest-100 border border-forest-200 rounded-lg">
                  <p className="text-forest-700 text-sm font-medium">
                    Puzzle Progress:
                  </p>
                  <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-forest-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(correctPieces / pieces.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-forest-50 border border-forest-200 rounded-lg">
                  <p className="text-forest-700 text-sm">
                    <span className="font-medium">How to play:</span>
                    <ul className="mt-1 space-y-1">
                      <li>
                        Drag a piece and drop it onto another piece to swap
                        their positions
                      </li>
                      <li>
                        Try to arrange all pieces to recreate the complete
                        painting
                      </li>
                      <li>
                        The puzzle is solved when all pieces are in their
                        correct positions
                      </li>
                      <li>
                        Use the hint if you're not sure what the final image
                        should look like
                      </li>
                    </ul>
                  </p>
                </div>
              </div>

              {isSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg"
                >
                  <p className="text-green-800 font-medium">
                    Magnificent! You've successfully recreated the Waxing
                    Gibbous moon phase in {moveCount} moves. Your astronomical
                    knowledge has unlocked the next clue. Feel free to explore
                    the other rooms.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/*<RoomNavigation onNavigate={onNavigate} currentRoom="gallery" /> */}
    </div>
  );
}
