
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const BOARD_SIZE = 10;
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

type Position = {
  x: number;
  y: number;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 2, y: 2 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Position>(DIRECTIONS.ArrowRight);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (
          head.x < 0 ||
          head.x >= BOARD_SIZE ||
          head.y < 0 ||
          head.y >= BOARD_SIZE ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore((prevScore) => prevScore + 1);
          setFood({
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, isGameOver]);

  const handleStartGame = () => {
    setSnake([{ x: 2, y: 2 }]);
    setFood({ x: 5, y: 5 });
    setDirection(DIRECTIONS.ArrowRight);
    setIsGameOver(false);
    setScore(0);
    gameBoardRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Snake Game</h1>
      <div
        ref={gameBoardRef}
        tabIndex={0}
        className="grid grid-cols-10 gap-1 bg-gray-800 p-1"
        style={{ width: "200px", height: "200px" }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={index}
              className={`w-5 h-5 ${isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-gray-700"}`}
            ></div>
          );
        })}
      </div>
      <div className="text-lg">Score: {score}</div>
      {isGameOver && <div className="text-red-500">Game Over</div>}
      <Button onClick={handleStartGame}>Start/Restart Game</Button>
    </div>
  );
}
