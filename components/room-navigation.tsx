"use client";

import { Button } from "@/components/ui/button";
import { Coffee, Scissors, Palette, Dog, ImageIcon, Home } from "lucide-react";

interface RoomNavigationProps {
  onNavigate: (room: string) => void;
  currentRoom: string;
}

export default function RoomNavigation({
  onNavigate,
  currentRoom,
}: RoomNavigationProps) {
  const rooms = [
    { id: "coffee", icon: <Coffee className="h-4 w-4" />, label: "Coffee" },
    { id: "crochet", icon: <Scissors className="h-4 w-4" />, label: "Crochet" },
    { id: "sudoku", icon: <Palette className="h-4 w-4" />, label: "Sudoku" },
    { id: "doggo", icon: <Dog className="h-4 w-4" />, label: "Maze" },
    { id: "gallery", icon: <ImageIcon className="h-4 w-4" />, label: "Puzzle" },
  ];

  return (
    <div className="flex justify-center mt-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("intro")}
        className="text-forest-600 border-forest-200"
      >
        <Home className="h-4 w-4 mr-1" /> Home
      </Button>

      {rooms.map(room => (
        <Button
          key={room.id}
          variant={currentRoom === room.id ? "default" : "outline"}
          size="sm"
          onClick={() => onNavigate(room.id)}
          className={
            currentRoom === room.id
              ? "bg-forest-500"
              : "text-forest-600 border-forest-200"
          }
        >
          {room.icon}
          <span className="ml-1 hidden sm:inline">{room.label}</span>
        </Button>
      ))}
    </div>
  );
}
