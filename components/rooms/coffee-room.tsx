"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Coffee, Plus, Minus, Info } from "lucide-react";
import RoomNavigation from "@/components/room-navigation";

interface CoffeeRoomProps {
  onSolve: () => void;
  isSolved: boolean;
  onNavigate: (room: string) => void;
}

export default function CoffeeRoom({
  onSolve,
  isSolved,
  onNavigate,
}: CoffeeRoomProps) {
  const [espressoShots, setEspressoShots] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);
  const [temperature, setTemperature] = useState(85); // Default temperature in Celsius
  const [attempt, setAttempt] = useState(false);
  const [hint, setHint] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Perfect Americano recipe
  const perfectAmericano = {
    espressoShots: 2,
    waterAmount: 6, // 6 oz of water
    temperature: 90, // 90°C
  };

  const handleMakeCoffee = () => {
    setAttempt(true);

    // Check if the coffee matches the perfect Americano
    if (
      espressoShots === perfectAmericano.espressoShots &&
      waterAmount === perfectAmericano.waterAmount &&
      Math.abs(temperature - perfectAmericano.temperature) <= 5 // Allow a 5-degree margin
    ) {
      onSolve();
    }
  };

  const resetCoffee = () => {
    setEspressoShots(0);
    setWaterAmount(0);
    setTemperature(85);
    setAttempt(false);
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-sm border-forest-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-forest-500 font-serif flex items-center gap-2">
              <Coffee className="h-5 w-5" /> Coffee Corner
            </h2>
            {isSolved && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Check className="h-4 w-4" /> Solved
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="bg-forest-50 rounded-lg p-4 flex justify-center">
                <div className="relative">
                  {/* Coffee cup */}
                  <div className="w-48 h-64 relative">
                    {/* Cup */}
                    <div className="absolute bottom-0 w-full h-48 bg-white rounded-b-3xl rounded-t-xl border-2 border-gray-200 overflow-hidden shadow-md">
                      {/* Water */}
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-b from-blue-300 to-blue-400 transition-all duration-500"
                        style={{
                          height: `${Math.min(waterAmount * 10, 100)}%`,
                          opacity: waterAmount > 0 ? 1 : 0,
                        }}
                      ></div>

                      {/* Espresso */}
                      {espressoShots > 0 && (
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-b from-amber-900 to-amber-800 transition-all duration-500"
                          style={{
                            height: `${Math.min(espressoShots * 10, 30)}%`,
                            opacity: 0.8,
                          }}
                        ></div>
                      )}

                      {/* Steam for hot coffee */}
                      {(waterAmount > 0 || espressoShots > 0) &&
                        temperature > 70 && (
                          <div className="absolute top-[-20px] left-0 right-0">
                            <div className="coffee-steam"></div>
                            <div className="coffee-steam"></div>
                            <div className="coffee-steam"></div>
                          </div>
                        )}
                    </div>

                    {/* Handle */}
                    <div className="absolute right-[-20px] top-1/3 w-8 h-16 border-2 border-gray-200 rounded-r-full bg-white shadow-sm"></div>

                    {/* Saucer */}
                    <div className="absolute bottom-[-10px] w-full h-[10px] bg-white border-2 border-gray-200 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="text-lg font-medium text-forest-600">
                  Your Americano
                </div>
                <div className="text-sm text-forest-500 mt-1">
                  {espressoShots} shot{espressoShots !== 1 ? "s" : ""} of
                  espresso, {waterAmount} oz of water at {temperature}°C
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-forest-500 border-forest-200 flex items-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    {showInfo ? "Hide Info" : "What's an Americano?"}
                  </Button>
                </div>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-forest-50 border border-forest-100 rounded-lg text-left text-sm"
                  >
                    <p className="text-forest-700">
                      An Americano is a coffee drink prepared by diluting
                      espresso with hot water, giving it a similar strength to,
                      but different flavor from, traditionally brewed coffee.
                      The strength varies with the number of shots of espresso
                      and the amount of water added.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-700 mb-4">
                  As usual you came to usual coffee spot and found that MR Ridha
                  has killed and butchered all of his baristas, so you stood
                  there wondring and thinking who's going to make your order.
                  After 15 minutes of waiting, the strong independent women you
                  are or muscle mommy as someone would say, you decided to make
                  your own coffee and don't be wasting more time.
                </p>
                <p className="text-slate-700 mb-4">
                  Adjust the espresso shots, water amount, and temperature to
                  create the ideal brew.
                </p>

                {attempt && !isSolved && (
                  <p className="text-rose-600 mb-4">
                    That's not quite right. Try a different combination for the
                    perfect Americano.
                  </p>
                )}

                <div className="space-y-4 mb-6">
                  {/* Espresso shots */}
                  <div>
                    <label className="block text-sm font-medium text-forest-600 mb-1">
                      Espresso Shots
                    </label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEspressoShots(Math.max(0, espressoShots - 1))
                        }
                        disabled={espressoShots === 0 || isSolved}
                        className="border-forest-200 text-forest-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center font-medium">
                        {espressoShots}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEspressoShots(Math.min(4, espressoShots + 1))
                        }
                        disabled={espressoShots === 4 || isSolved}
                        className="border-forest-200 text-forest-500"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Water amount */}
                  <div>
                    <label className="block text-sm font-medium text-forest-600 mb-1">
                      Water Amount (oz)
                    </label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setWaterAmount(Math.max(0, waterAmount - 1))
                        }
                        disabled={waterAmount === 0 || isSolved}
                        className="border-forest-200 text-forest-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center font-medium">
                        {waterAmount}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setWaterAmount(Math.min(10, waterAmount + 1))
                        }
                        disabled={waterAmount === 10 || isSolved}
                        className="border-forest-200 text-forest-500"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div
                        className="bg-forest-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(waterAmount / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-forest-600 mb-1">
                      Temperature (°C)
                    </label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTemperature(Math.max(70, temperature - 5))
                        }
                        disabled={temperature === 70 || isSolved}
                        className="border-forest-200 text-forest-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center font-medium">
                        {temperature}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTemperature(Math.min(100, temperature + 5))
                        }
                        disabled={temperature === 100 || isSolved}
                        className="border-forest-200 text-forest-500"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((temperature - 70) / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={handleMakeCoffee}
                    disabled={
                      isSolved || (espressoShots === 0 && waterAmount === 0)
                    }
                    className="bg-forest-500 hover:bg-forest-600"
                  >
                    Make Coffee
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCoffee}
                    className="text-forest-500 border-forest-200"
                    disabled={isSolved}
                  >
                    Reset
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
                      <span className="font-medium">Hint:</span> A classic
                      Americano consists of espresso shots diluted with hot
                      water. The ratio and temperature are key to the perfect
                      cup! The standard recipe uses 2 shots of espresso with
                      about 6 oz of hot water at around 90°C.
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
                    Perfect Americano! You've created the ideal coffee with 2
                    shots of espresso, 6 oz of hot water at around 90°C. Feel
                    free to explore the other rooms.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/*<RoomNavigation onNavigate={onNavigate} currentRoom="coffee" />*/}
    </div>
  );
}
