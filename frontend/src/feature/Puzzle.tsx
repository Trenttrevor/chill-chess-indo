import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import puzzlesData from "@/data/puzzle_1900.json";

type Puzzles = {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
};

type Status = "playing" | "wrong" | "correct";

type Theme = "all" | "mateIn1" | "mateIn2" | "mateIn3" | "mateIn4";

const Puzzle = () => {
  // apa saja themes yg ada
  const puzzleThemes = new Set(puzzlesData.flatMap((pt) => pt.themes));
  const uniquePuzzleThemes = [...puzzleThemes];
  console.log(uniquePuzzleThemes);

  const [game, setGame] = useState<Chess>(new Chess());
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<Status>("playing");
  const [theme, setTheme] = useState<Theme>("all");

  const themes: { value: Theme; label: string }[] = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "mateIn1",
      label: "Mate In 1",
    },
    {
      value: "mateIn2",
      label: "Mate In 2",
    },
    {
      value: "mateIn3",
      label: "Mate In 3",
    },
    {
      value: "mateIn4",
      label: "Mate In 4",
    },
  ];

  const filteredPuzzle = puzzlesData.filter((pt) =>
    theme === "all" ? puzzlesData : pt.themes.includes(theme),
  );
  const currentPuzzle: Puzzles = filteredPuzzle[puzzleIndex];
  console.log(currentPuzzle.id);

  const reset = () => {
    const newGame = new Chess(currentPuzzle.fen);
    const turn = newGame.turn();
    const player = turn === "w" ? "b" : "w";
    setPlayerColor(player);

    setStatus("playing");

    setGame(newGame);
    setMoveIndex(0);
    setTimeout(() => {
      computerMove(newGame, 0);
    }, 1000);
  };

  useEffect(() => {
    setPuzzleIndex(0);
  }, [theme]);

  useEffect(() => {
    if (currentPuzzle) reset();
  }, [puzzleIndex, currentPuzzle]);

  // Player Move
  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs): boolean => {
    if (!sourceSquare || !targetSquare) return false;
    if (sourceSquare === targetSquare) return false;

    const newGame = new Chess(game.fen());

    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    const nextIndex = moveIndex + 1;

    // cek kalo salah langkah
    const expectedMove = currentPuzzle.moves[moveIndex];
    const playerMove = sourceSquare + targetSquare;

    if (expectedMove !== playerMove) {
      setStatus("wrong");
      return false;
    }

    setMoveIndex(nextIndex);
    setGame(newGame);

    if (currentPuzzle.moves.length === nextIndex) {
      setStatus("correct");
      return true;
    }

    setTimeout(() => {
      computerMove(newGame, nextIndex);
    }, 200);
    return true;
  };

  // Engine Move
  const computerMove = (currentPosition: Chess, index: number) => {
    const move = currentPuzzle.moves[index];
    if (!move) return;

    const from = move.slice(0, 2);
    const to = move.slice(2, 4);

    const newGame = new Chess(currentPosition.fen());
    newGame.move({ from, to });

    const nextIndex = index + 1;
    setMoveIndex(nextIndex);
    setGame(newGame);
  };

  return (
    <div className="w-[400px]">
      <div>
        <h1>Themes</h1>
      </div>

      {themes.map((t) => (
        <div>
          <button onClick={() => setTheme(t.value)} className="cursor-pointer">
            {t.label}
          </button>
        </div>
      ))}

      <Chessboard
        options={{
          onPieceDrop,
          position: game.fen(),
          boardOrientation: playerColor === "w" ? "white" : "black",
        }}
      />

      {status === "correct" && (
        <div>
          <h1>nice!!</h1>
          <button onClick={() => setPuzzleIndex((prev) => prev + 1)}>
            next puzzle
          </button>
        </div>
      )}
      {status === "wrong" && (
        <div>
          <h1>wrong!!</h1>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default Puzzle;
