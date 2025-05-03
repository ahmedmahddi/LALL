"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import CoffeeRoom from "@/components/rooms/coffee-room";
import CrochetRoom from "@/components/rooms/crochet-room";
import DoggoRoom from "@/components/rooms/doggo-room";
import GalleryRoom from "@/components/rooms/gallery-room";
import FinalRoom from "@/components/rooms/final-room";
import IntroScreen from "@/components/intro-screen";
import { Progress } from "@/components/ui/progress";
import SudokuBoard from "@/components/suduko-board";
import SudokuControls from "@/components/suduko-controls";
import { generateSudoku, isBoardValid } from "@/lib/suduko-generator";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
export default function EscapeRoom() {
  const [currentRoom, setCurrentRoom] = useState("intro");
  const [solvedRooms, setSolvedRooms] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const rooms = ["coffee", "crochet", "sudoku", "doggo", "gallery", "final"];
  const progress = (solvedRooms.length / 5) * 100;

  const handleSolveRoom = (room: string) => {
    console.log("handleSolveRoom called with:", room);
    console.log("Current solvedRooms:", solvedRooms);

    // Normalize room name to handle both spellings (sudoku/suduko)
    let normalizedRoom = room;
    if (room === "sudoku" || room === "suduko") {
      normalizedRoom = "sudoku"; // Always use "sudoku" internally
    }

    if (!solvedRooms.includes(normalizedRoom)) {
      const newSolvedRooms = [...solvedRooms, normalizedRoom];
      console.log("New solvedRooms will be:", newSolvedRooms);
      setSolvedRooms(newSolvedRooms);

      // If all puzzles are solved, show the final room
      if (newSolvedRooms.length === 5 && !newSolvedRooms.includes("final")) {
        console.log("All 5 puzzles solved, navigating to final room");
        setTimeout(() => {
          setCurrentRoom("final");
          setShowConfetti(true);
        }, 1000);
      }
    } else {
      console.log("Room already solved, not adding");
    }
  };

  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [initialBoard, setInitialBoard] = useState<(number | null)[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [conflicts, setConflicts] = useState<[number, number][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const { toast } = useToast();
  const [correctCells, setCorrectCells] = useState<[number, number][]>([]);
  const [incorrectCells, setIncorrectCells] = useState<[number, number][]>([]);

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const startNewGame = () => {
    const { puzzle, solution } = generateSudoku(difficulty);
    setBoard(puzzle);
    setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
    setSolution(solution);
    setConflicts([]);
    setSelectedCell(null);
    setCorrectCells([]);
    setIncorrectCells([]);
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newBoard = [...board];
    newBoard[row][col] = value;
    setBoard(newBoard);

    // Check for conflicts
    const newConflicts = findConflicts(newBoard, row, col, value);
    setConflicts(newConflicts);
  };

  const findConflicts = (
    board: (number | null)[][],
    row: number,
    col: number,
    value: number | null
  ): [number, number][] => {
    if (value === null) {
      return conflicts.filter(([r, c]) => !(r === row && c === col));
    }

    const newConflicts: [number, number][] = [
      ...conflicts.filter(([r, c]) => !(r === row && c === col)),
    ];

    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) {
        newConflicts.push([row, c]);
        newConflicts.push([row, col]);
      }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) {
        newConflicts.push([r, col]);
        newConflicts.push([row, col]);
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          newConflicts.push([r, c]);
          newConflicts.push([row, col]);
        }
      }
    }

    return newConflicts;
  };

  const handleCheck = () => {
    console.log("Checking board:", board);
    console.log("Solution:", solution);

    // Reset visual feedback
    setCorrectCells([]);
    setIncorrectCells([]);

    let allCorrect = true;
    let allFilled = true;
    const newCorrectCells: [number, number][] = [];
    const newIncorrectCells: [number, number][] = [];

    // Check each cell
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        // Skip empty cells
        if (board[r][c] === null) {
          allFilled = false;
          continue;
        }

        // Check if the cell matches the solution
        if (board[r][c] === solution[r][c]) {
          newCorrectCells.push([r, c]);
        } else {
          newIncorrectCells.push([r, c]);
          allCorrect = false;
        }
      }
    }

    // Update visual feedback
    setCorrectCells(newCorrectCells);
    setIncorrectCells(newIncorrectCells);

    // Provide user feedback
    if (allFilled && allCorrect) {
      // Complete and correct puzzle
      toast({
        title: "Congratulations!",
        description: "You've solved the puzzle correctly!",
        variant: "default",
      });
      handleSolveRoom("sudoku");
    } else if (newIncorrectCells.length > 0) {
      // Some cells are incorrect
      toast({
        title: "Some cells are incorrect",
        description: `${newCorrectCells.length} correct, ${newIncorrectCells.length} incorrect`,
        variant: "destructive",
      });
    } else if (newCorrectCells.length > 0) {
      // All filled cells are correct but puzzle is incomplete
      toast({
        title: "Looking good!",
        description: `${newCorrectCells.length} cells correct, keep going!`,
        variant: "default",
      });
    }
  };

  const handleReset = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setConflicts([]);
    setSelectedCell(null);
    setCorrectCells([]);
    setIncorrectCells([]);
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleDifficultyChange = (
    newDifficulty: "easy" | "medium" | "hard"
  ) => {
    setDifficulty(newDifficulty);
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Add this effect to ensure the board is initialized when navigating to the sudoku room
  useEffect(() => {
    if (currentRoom === "sudoku" && board.length === 0) {
      console.log("Initializing Sudoku board for first visit");
      startNewGame();
    }
  }, [currentRoom, board.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-forest-200 text-slate-800">
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 font-serif text-forest-500">
            Amal and the Puzzles of Destiny
          </h1>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2 bg-forest-500" />
            <p className="text-center mt-2 text-sm text-forest-600">
              {solvedRooms.length}/5 puzzles solved
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoom}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {currentRoom === "intro" && (
              <IntroScreen onStart={() => setCurrentRoom("coffee")} />
            )}
            {currentRoom === "coffee" && (
              <CoffeeRoom
                onSolve={() => handleSolveRoom("coffee")}
                isSolved={solvedRooms.includes("coffee")}
                onNavigate={setCurrentRoom}
              />
            )}
            {currentRoom === "crochet" && (
              <CrochetRoom
                onSolve={() => handleSolveRoom("crochet")}
                isSolved={solvedRooms.includes("crochet")}
                onNavigate={setCurrentRoom}
              />
            )}
            {currentRoom === "sudoku" && (
              <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full flex flex-col items-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Sudoku Puzzle
                  </h1>
                  <SudokuBoard
                    board={board}
                    initialBoard={initialBoard}
                    conflicts={conflicts}
                    selectedCell={selectedCell}
                    correctCells={correctCells}
                    incorrectCells={incorrectCells}
                    onCellChange={handleCellChange}
                    onCellSelect={handleCellSelect}
                  />

                  <SudokuControls
                    onCheck={handleCheck}
                    onReset={handleReset}
                    onNewGame={startNewGame}
                    difficulty={difficulty}
                    onDifficultyChange={handleDifficultyChange}
                  />
                </div>
                <Toaster />
              </div>
            )}
            {currentRoom === "doggo" && (
              <DoggoRoom
                onSolve={() => handleSolveRoom("doggo")}
                isSolved={solvedRooms.includes("doggo")}
                onNavigate={setCurrentRoom}
              />
            )}
            {currentRoom === "gallery" && (
              <GalleryRoom
                onSolve={() => handleSolveRoom("gallery")}
                isSolved={solvedRooms.includes("gallery")}
                onNavigate={setCurrentRoom}
              />
            )}
            {currentRoom === "final" && <FinalRoom />}
          </motion.div>
        </AnimatePresence>

        {currentRoom !== "intro" && currentRoom !== "final" && (
          <div className="mt-8 flex justify-center gap-4">
            {rooms.slice(0, 5).map(room => {
              // Normalize room name for display/checks
              const displayRoom = room === "suduko" ? "sudoku" : room;
              return (
                <button
                  key={room}
                  onClick={() => setCurrentRoom(displayRoom)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentRoom === displayRoom
                      ? "bg-forest-500 text-white"
                      : solvedRooms.includes(displayRoom)
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {displayRoom.charAt(0).toUpperCase() + displayRoom.slice(1)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
