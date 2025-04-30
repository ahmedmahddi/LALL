"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Palette, RotateCcw, Lightbulb, Eraser, Info } from "lucide-react"
import RoomNavigation from "@/components/room-navigation"

interface SudokuRoomProps {
  onSolve: () => void
  isSolved: boolean
  onNavigate: (room: string) => void
}

type SudokuGrid = (number | null)[][]
type SudokuFixedCells = boolean[][]

export default function SudokuRoom({ onSolve, isSolved, onNavigate }: SudokuRoomProps) {
  const [grid, setGrid] = useState<SudokuGrid>([])
  const [fixedCells, setFixedCells] = useState<SudokuFixedCells>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [errors, setErrors] = useState<[number, number][]>([])
  const [hint, setHint] = useState(false)
  const [attempt, setAttempt] = useState(false)
  const [eraseMode, setEraseMode] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [filledCells, setFilledCells] = useState(0)
  const [totalEmptyCells, setTotalEmptyCells] = useState(0)

  // Initialize the Sudoku grid
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // This is a pre-solved Sudoku puzzle
    const solvedPuzzle: number[][] = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]

    // Create a puzzle by removing some numbers
    const puzzle: SudokuGrid = solvedPuzzle.map((row) => [...row])
    const fixed: SudokuFixedCells = Array(9)
      .fill(null)
      .map(() => Array(9).fill(true))

    // Define positions to remove (make this consistent for the puzzle)
    const positionsToRemove = [
      [0, 2],
      [0, 5],
      [0, 6],
      [0, 8],
      [1, 3],
      [1, 4],
      [1, 7],
      [2, 1],
      [2, 2],
      [2, 6],
      [2, 7],
      [3, 0],
      [3, 4],
      [3, 8],
      [4, 1],
      [4, 3],
      [4, 5],
      [4, 7],
      [5, 0],
      [5, 4],
      [5, 8],
      [6, 1],
      [6, 2],
      [6, 6],
      [6, 7],
      [7, 1],
      [7, 4],
      [7, 7],
      [8, 0],
      [8, 2],
      [8, 3],
      [8, 6],
    ]

    // Remove numbers from the puzzle
    positionsToRemove.forEach(([row, col]) => {
      puzzle[row][col] = null
      fixed[row][col] = false
    })

    setGrid(puzzle)
    setFixedCells(fixed)
    setSelectedCell(null)
    setErrors([])
    setAttempt(false)
    setEraseMode(false)
    setTotalEmptyCells(positionsToRemove.length)

    // Count initially filled cells (by the player)
    const filledCount = positionsToRemove.filter(([row, col]) => puzzle[row][col] !== null).length
    setFilledCells(filledCount)
  }

  const handleCellClick = (row: number, col: number) => {
    if (isSolved || fixedCells[row][col]) return

    if (eraseMode) {
      // If in erase mode, clear the cell
      const newGrid = [...grid]
      if (newGrid[row][col] !== null) {
        setFilledCells(filledCells - 1)
      }
      newGrid[row][col] = null
      setGrid(newGrid)
      // Remove from errors if it was previously marked as an error
      setErrors((prev) => prev.filter(([r, c]) => !(r === row && c === col)))
    } else {
      setSelectedCell([row, col])
    }
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isSolved) return

    const [row, col] = selectedCell
    if (fixedCells[row][col]) return

    const newGrid = [...grid]
    if (newGrid[row][col] === null) {
      setFilledCells(filledCells + 1)
    }
    newGrid[row][col] = num
    setGrid(newGrid)

    // Check if this causes any errors
    validateCell(row, col, num)
  }

  const validateCell = (row: number, col: number, value: number) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value) {
        setErrors((prev) => [...prev.filter(([r, c]) => !(r === row && c === col)), [row, col]])
        return false
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === value) {
        setErrors((prev) => [...prev.filter(([r, c]) => !(r === row && c === col)), [row, col]])
        return false
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = boxRow + i
        const c = boxCol + j
        if (r !== row && c !== col && grid[r][c] === value) {
          setErrors((prev) => [...prev.filter(([r, c]) => !(r === row && c === col)), [row, col]])
          return false
        }
      }
    }

    // Remove from errors if it was previously marked as an error
    setErrors((prev) => prev.filter(([r, c]) => !(r === row && c === col)))
    return true
  }

  const checkSolution = () => {
    setAttempt(true)

    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          return false
        }
      }
    }

    // Check if there are any errors
    if (errors.length > 0) {
      return false
    }

    // Validate all cells
    let isValid = true
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col]
        if (value !== null) {
          // Temporarily set cell to null to check against other cells
          const tempGrid = [...grid]
          tempGrid[row][col] = null
          setGrid(tempGrid)

          if (!validateCell(row, col, value)) {
            isValid = false
          }

          // Restore cell value
          tempGrid[row][col] = value
          setGrid(tempGrid)
        }
      }
    }

    if (isValid) {
      onSolve()
      return true
    }

    return false
  }

  const giveHint = () => {
    if (!selectedCell || isSolved) return

    const [row, col] = selectedCell
    if (fixedCells[row][col]) return

    // Find the correct value for this cell from the solved puzzle
    const solvedValue = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ][row][col]

    const newGrid = [...grid]
    if (newGrid[row][col] === null) {
      setFilledCells(filledCells + 1)
    }
    newGrid[row][col] = solvedValue
    setGrid(newGrid)

    // Remove from errors if it was previously marked as an error
    setErrors((prev) => prev.filter(([r, c]) => !(r === row && c === col)))
  }

  const toggleEraseMode = () => {
    setEraseMode(!eraseMode)
    if (!eraseMode) {
      setSelectedCell(null)
    }
  }

  const getCellColor = (row: number, col: number) => {
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      return "bg-forest-200 sudoku-cell selected"
    }

    if (errors.some(([r, c]) => r === row && c === col)) {
      return "bg-rose-200 sudoku-cell error"
    }

    if (fixedCells[row][col]) {
      return "bg-slate-100 font-bold sudoku-cell fixed"
    }

    // Alternate box colors for better visibility
    const boxRow = Math.floor(row / 3)
    const boxCol = Math.floor(col / 3)
    if ((boxRow + boxCol) % 2 === 0) {
      return "bg-forest-50 sudoku-cell"
    }

    return "bg-white sudoku-cell"
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border-forest-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-forest-500 font-serif flex items-center gap-2">
              <Palette className="h-5 w-5" /> Sudoku Puzzle
            </h2>
            {isSolved && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Check className="h-4 w-4" /> Solved
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-9 gap-[1px] bg-slate-200">
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.button
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={!fixedCells[rowIndex][colIndex] && !isSolved ? { scale: 1.05 } : {}}
                        whileTap={!fixedCells[rowIndex][colIndex] && !isSolved ? { scale: 0.95 } : {}}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`aspect-square flex items-center justify-center text-lg ${getCellColor(rowIndex, colIndex)} ${
                          fixedCells[rowIndex][colIndex] ? "cursor-default" : "cursor-pointer"
                        }`}
                        disabled={isSolved}
                      >
                        {cell !== null ? cell : ""}
                      </motion.button>
                    )),
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-10 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    className={`aspect-square p-0 text-lg ${eraseMode ? "opacity-50" : ""}`}
                    onClick={() => handleNumberInput(num)}
                    disabled={isSolved || !selectedCell || eraseMode}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant={eraseMode ? "default" : "outline"}
                  className={`aspect-square p-0 ${eraseMode ? "bg-forest-500" : "text-forest-500 border-forest-200"}`}
                  onClick={toggleEraseMode}
                  disabled={isSolved}
                >
                  <Eraser className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 text-center">
                <div className="text-sm text-forest-600 mb-2">
                  Progress: {filledCells}/{totalEmptyCells} cells filled
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-forest-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(filledCells / totalEmptyCells) * 100}%` }}
                  ></div>
                </div>

                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-forest-500 border-forest-200 flex items-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    {showInfo ? "Hide Info" : "About Sudoku"}
                  </Button>
                </div>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-forest-50 border border-forest-100 rounded-lg text-left text-sm"
                  >
                    <p className="text-forest-700">
                      Sudoku is a logic-based number placement puzzle. The objective is to fill a 9×9 grid with digits
                      so that each column, each row, and each of the nine 3×3 subgrids contains all of the digits from 1
                      to 9. The puzzle setter provides a partially completed grid.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-700 mb-4">
                  Welcome to the Sudoku puzzle room! Fill in the grid so that every row, column, and 3×3 box contains
                  the digits 1-9.
                </p>
                <p className="text-slate-700 mb-4">
                  Click on an empty cell to select it, then use the number buttons below the grid to fill it in. Use the
                  eraser to clear cells.
                </p>

                {attempt && !isSolved && (
                  <p className="text-rose-600 mb-4">That's not quite right. Check for errors or missing numbers.</p>
                )}

                <div className="flex gap-2 mb-4">
                  <Button onClick={checkSolution} disabled={isSolved} className="bg-forest-500 hover:bg-forest-600">
                    Check Solution
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={initializeGame}
                    className="text-forest-500 border-forest-200"
                    disabled={isSolved}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> Reset
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={giveHint}
                    className="text-forest-500 border-forest-200"
                    disabled={isSolved || !selectedCell || eraseMode}
                  >
                    <Lightbulb className="h-3 w-3 mr-1" /> Hint
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHint(!hint)}
                    className="text-forest-500 border-forest-200"
                  >
                    {hint ? "Hide Help" : "Show Help"}
                  </Button>
                </div>

                {hint && (
                  <div className="p-3 bg-forest-50 border border-forest-100 rounded-lg mb-4">
                    <p className="text-forest-700 text-sm">
                      <span className="font-medium">How to play Sudoku:</span>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Fill in the grid so that every row, column, and 3×3 box contains the digits 1-9</li>
                        <li>Each number can only appear once in each row, column, and box</li>
                        <li>The puzzle is solved when all cells are filled correctly</li>
                        <li>Use the hint button if you get stuck on a particular cell</li>
                        <li>Use the eraser button to clear cells if you made a mistake</li>
                      </ul>
                    </p>
                  </div>
                )}

                {selectedCell && !eraseMode && (
                  <div className="p-3 bg-forest-100 border border-forest-200 rounded-lg">
                    <p className="text-forest-700 text-sm">
                      Selected cell: Row {selectedCell[0] + 1}, Column {selectedCell[1] + 1}
                    </p>
                  </div>
                )}

                {eraseMode && (
                  <div className="p-3 bg-forest-100 border border-forest-200 rounded-lg">
                    <p className="text-forest-700 text-sm">
                      <span className="font-medium">Eraser mode active:</span> Click on any cell to clear it
                    </p>
                  </div>
                )}
              </div>

              {isSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg"
                >
                  <p className="text-green-800 font-medium">
                    Excellent! You've solved the Sudoku puzzle. Your logical thinking has unlocked the next clue. Feel
                    free to explore the other rooms.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <RoomNavigation onNavigate={onNavigate} currentRoom="interior" />
    </div>
  )
}
