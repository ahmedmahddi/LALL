"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, CheckCircle, RefreshCw, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SudokuControlsProps {
  onCheck: () => void
  onReset: () => void
  onNewGame: () => void
  difficulty: "easy" | "medium" | "hard"
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void
}

export default function SudokuControls({
  onCheck,
  onReset,
  onNewGame,
  difficulty,
  onDifficultyChange,
}: SudokuControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={onCheck} variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Check
          </Button>

          <Button onClick={onReset} variant="outline" className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <Button onClick={onNewGame} variant="outline" className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          New Game
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Difficulty:</div>
        <Select value={difficulty} onValueChange={(value) => onDifficultyChange(value as "easy" | "medium" | "hard")}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <p className="flex items-center gap-1">
          <Lightbulb className="h-3 w-3" />
          <span>Tip: Use keyboard arrows to navigate between cells</span>
        </p>
      </div>
    </div>
  )
}
