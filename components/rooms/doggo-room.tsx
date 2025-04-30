"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Dog, RotateCcw, HelpCircle, Info } from "lucide-react";
import RoomNavigation from "@/components/room-navigation";

interface DoggoRoomProps {
  onSolve: () => void;
  isSolved: boolean;
  onNavigate: (room: string) => void;
}

type CellType = "wall" | "path" | "start" | "end" | "current" | "visited";

export default function DoggoRoom({
  onSolve,
  isSolved,
  onNavigate,
}: DoggoRoomProps) {
  const mazeSize = 10;
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [hint, setHint] = useState(false);
  const [attempt, setAttempt] = useState(false);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [moveCount, setMoveCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize the maze
  useEffect(() => {
    initializeMaze();
  }, []);

  const initializeMaze = () => {
    // Create a predefined maze
    // 0 = wall, 1 = path, 2 = start, 3 = end
    const mazeTemplate = [
      [2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 3, 0],
    ];

    const newMaze: CellType[][] = [];
    let startPosition: [number, number] = [0, 0];

    for (let row = 0; row < mazeSize; row++) {
      const newRow: CellType[] = [];
      for (let col = 0; col < mazeSize; col++) {
        const cellValue = mazeTemplate[row][col];
        if (cellValue === 0) newRow.push("wall");
        else if (cellValue === 1) newRow.push("path");
        else if (cellValue === 2) {
          newRow.push("start");
          startPosition = [row, col];
        } else if (cellValue === 3) newRow.push("end");
        else newRow.push("path");
      }
      newMaze.push(newRow);
    }

    setMaze(newMaze);
    setCurrentPosition(startPosition);
    setVisitedCells(new Set([`${startPosition[0]},${startPosition[1]}`]));
    setAttempt(false);
    setMoveCount(0);
  };

  const movePlayer = (direction: "up" | "down" | "left" | "right") => {
    if (isSolved) return;

    const [row, col] = currentPosition;
    let newRow = row;
    let newCol = col;

    if (direction === "up") newRow = Math.max(0, row - 1);
    else if (direction === "down") newRow = Math.min(mazeSize - 1, row + 1);
    else if (direction === "left") newCol = Math.max(0, col - 1);
    else if (direction === "right") newCol = Math.min(mazeSize - 1, col + 1);

    // Check if the new position is a wall
    if (maze[newRow][newCol] === "wall") return;

    // Update move count
    setMoveCount(moveCount + 1);

    // Update visited cells
    const newVisitedCells = new Set(visitedCells);
    newVisitedCells.add(`${newRow},${newCol}`);
    setVisitedCells(newVisitedCells);

    // Update current position
    setCurrentPosition([newRow, newCol]);

    // Check if player reached the end
    if (maze[newRow][newCol] === "end") {
      onSolve();
    }
  };

  const getCellColor = (cell: CellType, row: number, col: number) => {
    if (row === currentPosition[0] && col === currentPosition[1]) {
      return "bg-forest-500 text-white maze-cell current";
    }

    if (cell === "wall") return "bg-gray-800 maze-cell wall";
    if (cell === "start") return "bg-forest-200 maze-cell start";
    if (cell === "end") return "bg-green-500 maze-cell end";

    // Path cell
    if (visitedCells.has(`${row},${col}`)) {
      return "bg-forest-100 maze-cell visited";
    }

    return "bg-white maze-cell path";
  };

  const getCellContent = (cell: CellType, row: number, col: number) => {
    if (row === currentPosition[0] && col === currentPosition[1]) {
      return "🐕";
    }

    if (cell === "start") return "🏠";
    if (cell === "end") return "🦴";

    return "";
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border-forest-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-forest-500 font-serif flex items-center gap-2">
              <Dog className="h-5 w-5" /> Maze Puzzle
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
                <div className="grid grid-cols-10 gap-1">
                  {maze.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-8 h-8 flex items-center justify-center text-lg rounded-sm ${getCellColor(
                          cell,
                          rowIndex,
                          colIndex
                        )}`}
                      >
                        {getCellContent(cell, rowIndex, colIndex)}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="grid grid-cols-3 gap-2 w-32">
                  <div></div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => movePlayer("up")}
                    disabled={isSolved}
                    className="text-forest-500 border-forest-200 hover:bg-forest-50"
                  >
                    ↑
                  </Button>
                  <div></div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => movePlayer("left")}
                    disabled={isSolved}
                    className="text-forest-500 border-forest-200 hover:bg-forest-50"
                  >
                    ←
                  </Button>
                  <div className="flex items-center justify-center">🐕</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => movePlayer("right")}
                    disabled={isSolved}
                    className="text-forest-500 border-forest-200 hover:bg-forest-50"
                  >
                    →
                  </Button>
                  <div></div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => movePlayer("down")}
                    disabled={isSolved}
                    className="text-forest-500 border-forest-200 hover:bg-forest-50"
                  >
                    ↓
                  </Button>
                  <div></div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-sm text-forest-600">
                  Moves: <span className="font-bold">{moveCount}</span>
                </div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-forest-500 border-forest-200 flex items-center gap-1 mx-auto"
                  >
                    <Info className="h-4 w-4" />
                    {showInfo ? "Hide Story" : "Show Story"}
                  </Button>
                </div>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-forest-50 border border-forest-100 rounded-lg text-left text-sm"
                  >
                    <p className="text-forest-700">
                      Your dog Buddy has spotted a delicious bone at the end of
                      this maze! Help Buddy navigate through the twists and
                      turns to reach the treat. Be careful not to bump into any
                      walls along the way!
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-700 mb-4">
                  Luna vanished into the wild, chasing a shadow — and now she’s
                  lost, in grave danger. But within you, a hidden power awakens:
                  the ancient bond of telepathy. Channel your strength, connect
                  with Luna’s spirit, and lead her back to the safety of home
                  before it’s too late.
                </p>
                <p className="text-slate-700 mb-4">
                  Use the arrow buttons to navigate through the maze. Avoid
                  walls and find the shortest path to the goal.
                </p>

                {attempt && !isSolved && (
                  <p className="text-rose-600 mb-4">
                    You're still trying to find the way out. Keep exploring!
                  </p>
                )}

                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={initializeMaze}
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
                      <span className="font-medium">Hint:</span> Start by going
                      right and then down. The path will wind through the maze.
                      Look for openings and remember that the bone is in the
                      bottom right corner.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-forest-100 border border-forest-200 rounded-lg">
                  <p className="text-forest-700 text-sm">
                    <span className="font-medium">Legend:</span>
                    <ul className="mt-1 space-y-1">
                      <li>🏠 - Starting point</li>
                      <li>🐕 - Your dog</li>
                      <li>🦴 - Goal (bone)</li>
                      <li>Dark squares - Walls (can't pass through)</li>
                      <li>Light squares - Path (can move through)</li>
                      <li>Visited squares - Places you've already been</li>
                    </ul>
                  </p>
                </div>

                <div className="mt-4 p-3 bg-forest-50 border border-forest-200 rounded-lg">
                  <p className="text-forest-700 text-sm font-medium">
                    Exploration Progress:
                  </p>
                  <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-forest-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (visitedCells.size /
                            maze
                              .flat()
                              .filter(
                                cell =>
                                  cell === "path" ||
                                  cell === "start" ||
                                  cell === "end"
                              ).length) *
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
                    Great job! Your dog found the bone and successfully
                    navigated through the maze in {moveCount} moves. Feel free
                    to explore the other rooms.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <RoomNavigation onNavigate={onNavigate} currentRoom="doggo" />*/}
    </div>
  );
}
