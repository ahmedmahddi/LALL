"use client";

import type React from "react";

import { useEffect, useRef } from "react";

interface SudokuCellProps {
  value: number | null;
  isFixed: boolean;
  isConflict: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isSelected: boolean;
  isRelated: boolean;
  onChange: (value: string) => void;
  onSelect: () => void;
  className?: string;
}

export default function SudokuCell({
  value,
  isFixed,
  isConflict,
  isCorrect,
  isIncorrect,
  isSelected,
  isRelated,
  onChange,
  onSelect,
  className = "",
}: SudokuCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow single digits 1-9 or empty
    if (value === "" || (value.length === 1 && /^[1-9]$/.test(value))) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace and delete to clear the cell
    if (e.key === "Backspace" || e.key === "Delete") {
      onChange("");
      return;
    }

    // Prevent non-numeric input
    if (
      !/^[1-9]$/.test(e.key) &&
      !["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
        e.key
      )
    ) {
      e.preventDefault();
    }
  };

  const getBgColor = () => {
    if (isSelected) return "bg-blue-200";
    if (isConflict) return "bg-red-100";
    if (isRelated) return "bg-blue-50";
    if (isFixed) return "bg-gray-100";
    return "bg-white";
  };

  const getTextColor = () => {
    if (isIncorrect) return "text-red-600 font-bold";
    if (isCorrect) return "text-green-600 font-bold";
    if (isConflict) return "text-orange-600";
    if (isFixed) return "text-gray-800 font-bold";
    return "text-blue-600";
  };

  return (
    <div
      className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center ${getBgColor()} ${className} transition-colors duration-200`}
      onClick={onSelect}
    >
      <input
        ref={inputRef}
        type="text"
        value={value === null ? "" : value.toString()}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full h-full text-center ${getTextColor()} bg-transparent focus:outline-none`}
        maxLength={1}
        disabled={isFixed}
        readOnly={isFixed}
      />
    </div>
  );
}
