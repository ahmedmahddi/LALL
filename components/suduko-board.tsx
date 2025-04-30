"use client";
import SudokuCell from "./suduko-cell";

interface SudokuBoardProps {
  board: (number | null)[][];
  initialBoard: (number | null)[][];
  conflicts: [number, number][];
  correctCells: [number, number][];
  incorrectCells: [number, number][];
  selectedCell: [number, number] | null;
  onCellChange: (row: number, col: number, value: number | null) => void;
  onCellSelect: (row: number, col: number) => void;
}

export default function SudokuBoard({
  board,
  initialBoard,
  conflicts,
  correctCells,
  incorrectCells,
  selectedCell,
  onCellChange,
  onCellSelect,
}: SudokuBoardProps) {
  const handleCellChange = (row: number, col: number, value: string) => {
    if (initialBoard[row][col] !== null) return;

    const numValue = value === "" ? null : Number.parseInt(value);
    onCellChange(row, col, numValue);
  };

  const handleCellSelect = (row: number, col: number) => {
    onCellSelect(row, col);
  };

  const isInSameUnit = (row: number, col: number) => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;

    // Same row
    if (row === selectedRow) return true;

    // Same column
    if (col === selectedCol) return true;

    // Same 3x3 box
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const selectedBoxRow = Math.floor(selectedRow / 3);
    const selectedBoxCol = Math.floor(selectedCol / 3);

    return boxRow === selectedBoxRow && boxCol === selectedBoxCol;
  };

  const getBgColor = (row: number, col: number) => {
    // Priority order for cell colors
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      return "bg-blue-200";
    }
    if (incorrectCells.some(([r, c]) => r === row && c === col)) {
      return "bg-red-100";
    }
    if (correctCells.some(([r, c]) => r === row && c === col)) {
      return "bg-green-100";
    }
    if (conflicts.some(([r, c]) => r === row && c === col)) {
      return "bg-orange-100";
    }
    if (isInSameUnit(row, col)) {
      return "bg-blue-50";
    }
    if (initialBoard[row][col] !== null) {
      return "bg-gray-100";
    }
    return "bg-white";
  };

  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-300 border-2 border-gray-800 mb-6">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isFixed = initialBoard[rowIndex][colIndex] !== null;
          const isConflict = conflicts.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          const isCorrect = correctCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          const isIncorrect = incorrectCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          const isSelected =
            selectedCell &&
            selectedCell[0] === rowIndex &&
            selectedCell[1] === colIndex;
          const isRelated = isInSameUnit(rowIndex, colIndex);

          // Add border styling for 3x3 boxes
          const borderRight =
            (colIndex + 1) % 3 === 0 && colIndex < 8
              ? "border-r-2 border-gray-800"
              : "";
          const borderBottom =
            (rowIndex + 1) % 3 === 0 && rowIndex < 8
              ? "border-b-2 border-gray-800"
              : "";

          // Get background color based on cell state
          const bgColor = getBgColor(rowIndex, colIndex);

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isFixed={isFixed}
              isConflict={isConflict}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              isSelected={isSelected || false}
              isRelated={isRelated}
              onChange={value => handleCellChange(rowIndex, colIndex, value)}
              onSelect={() => handleCellSelect(rowIndex, colIndex)}
              className={`${borderRight} ${borderBottom} ${bgColor}`}
            />
          );
        })
      )}
    </div>
  );
}
