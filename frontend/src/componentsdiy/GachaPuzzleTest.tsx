import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import puzzlesData from "@/data/puzzle_1900.json";

import NavbarLux from "./NavbarLux";

import bishopCard from "../assets/cards/bishop.png";
import knightCard from "../assets/cards/knight.png";
import pawnCard from "../assets/cards/pawn.png";

// ───────────────── TYPES ─────────────────

type Puzzles = {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
};

type Status = "playing" | "wrong" | "correct";

type Theme = "skewer" | "pin" | "fork";

type Reward = {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
};

const themes: { value: Theme; label: string }[] = [
  { value: "skewer", label: "Skewer" },
  { value: "pin", label: "Pin" },
  { value: "fork", label: "Fork" },
];

const pieceNames = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

// ───────────────── REWARDS ─────────────────

const rewards: Reward[] = [
  {
    id: "1",
    name: "Bronze Pawn",
    rarity: "common",
    image: pawnCard,
  },
  {
    id: "2",
    name: "Shadow Knight",
    rarity: "rare",
    image: knightCard,
  },
  {
    id: "3",
    name: "Golden Bishop",
    rarity: "epic",
    image: bishopCard,
  },
  {
    id: "4",
    name: "Dragon Bishop",
    rarity: "legendary",
    image: bishopCard,
  },
];

const commonRewards = rewards.filter((r) => r.rarity === "common");
const rareRewards = rewards.filter((r) => r.rarity === "rare");
const epicRewards = rewards.filter((r) => r.rarity === "epic");
const legendaryRewards = rewards.filter((r) => r.rarity === "legendary");

// ───────────────── COMPONENT ─────────────────

const GachaPuzzleTest = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<Status>("playing");
  const [theme, setTheme] = useState<Theme>("skewer");

  const [solvedCount, setSolvedCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [solvedPuzzles, setSolvedPuzzles] = useState(0);
  const [gachaTickets, setGachaTickets] = useState(0);

  const [inventory, setInventory] = useState<Reward[]>([]);
  const [showGachaModal, setShowGachaModal] = useState(false);
  const [rolledReward, setRolledReward] = useState<Reward | null>(null);

  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState<string[]>([]);

  const [hint, setHint] = useState<string | null>(null);

  // ───────────────── FILTER PUZZLE ─────────────────

  const filteredPuzzle = puzzlesData.filter((pt) => pt.themes.includes(theme));

  const currentPuzzle: Puzzles = filteredPuzzle[puzzleIndex];

  // ───────────────── RANDOM INDEX ─────────────────

  const getRandomIndex = (length: number) => {
    return Math.floor(Math.random() * length);
  };

  // ───────────────── LOAD LOCAL STORAGE ─────────────────

  useEffect(() => {
    const saved = localStorage.getItem("gacha-progress");

    if (!saved) return;

    const parsed = JSON.parse(saved);

    setSolvedPuzzles(parsed.solvedPuzzles || 0);
    setGachaTickets(parsed.gachaTickets || 0);
    setInventory(parsed.inventory || []);
    setSolvedPuzzleIds(parsed.solvedPuzzleIds || []);
  }, []);

  // ───────────────── SAVE LOCAL STORAGE ─────────────────

  useEffect(() => {
    localStorage.setItem(
      "gacha-progress",
      JSON.stringify({
        solvedPuzzles,
        gachaTickets,
        inventory,
        solvedPuzzleIds,
      }),
    );
  }, [solvedPuzzles, gachaTickets, inventory, solvedPuzzleIds]);

  // ───────────────── RESET ─────────────────

  const reset = () => {
    const newGame = new Chess(currentPuzzle.fen);

    setPlayerColor(newGame.turn() === "w" ? "b" : "w");

    setStatus("playing");
    setMoveIndex(0);
    setGame(newGame);

    setTimeout(() => {
      computerMove(newGame, 0);
    }, 500);
  };

  // ───────────────── INIT ─────────────────

  useEffect(() => {
    setPuzzleIndex(getRandomIndex(filteredPuzzle.length));
  }, [theme]);

  useEffect(() => {
    if (currentPuzzle) {
      reset();
    }
  }, [puzzleIndex]);

  // ───────────────── HINT ─────────────────

  const showHint = () => {
    if (status !== "wrong") return;

    const correctMove = currentPuzzle.moves[moveIndex];

    if (!correctMove) return;

    const correctSquare = correctMove.slice(0, 2);

    const correctPiece = game.get(correctSquare);

    setHint(`Move your ${pieceNames[correctPiece?.type]}`);
  };

  // ───────────────── ROLL REWARD ─────────────────

  function rollReward(): Reward {
    const random = Math.random();

    // 60%
    if (random < 0.6) {
      return commonRewards[Math.floor(Math.random() * commonRewards.length)];
    }

    // 25%
    if (random < 0.85) {
      return rareRewards[Math.floor(Math.random() * rareRewards.length)];
    }

    // 10%
    if (random < 0.95) {
      return epicRewards[Math.floor(Math.random() * epicRewards.length)];
    }

    // 5%
    return legendaryRewards[
      Math.floor(Math.random() * legendaryRewards.length)
    ];
  }

  // ───────────────── GACHA ─────────────────

  const handleGachaRoll = () => {
    if (gachaTickets <= 0) return;

    setGachaTickets((prev) => prev - 1);

    const reward = rollReward();

    setInventory((prev) => [...prev, reward]);

    setRolledReward(reward);

    setShowGachaModal(true);
  };

  // ───────────────── PLAYER MOVE ─────────────────

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs): boolean => {
    if (!sourceSquare || !targetSquare) {
      return false;
    }

    if (sourceSquare === targetSquare) {
      return false;
    }

    const newGame = new Chess(game.fen());

    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    const moveString = move.from + move.to + (move.promotion || "");

    // WRONG MOVE
    if (currentPuzzle.moves[moveIndex] !== moveString) {
      setStatus("wrong");
      setWrongCount((p) => p + 1);
      return false;
    }

    const nextIndex = moveIndex + 1;

    setMoveIndex(nextIndex);
    setGame(newGame);

    // SOLVED
    if (currentPuzzle.moves.length === nextIndex) {
      setStatus("correct");

      // prevent duplicate farming
      if (!solvedPuzzleIds.includes(currentPuzzle.id)) {
        const newSolved = solvedPuzzles + 1;

        setSolvedPuzzles(newSolved);

        setSolvedPuzzleIds((prev) => [...prev, currentPuzzle.id]);

        setSolvedCount((prev) => prev + 1);

        // every 5 solve = 1 ticket
        if (newSolved % 5 === 0) {
          setGachaTickets((prev) => prev + 1);
        }
      }

      return true;
    }

    // COMPUTER MOVE
    setTimeout(() => {
      computerMove(newGame, nextIndex);
    }, 300);

    return true;
  };

  // ───────────────── COMPUTER MOVE ─────────────────

  const computerMove = (pos: Chess, index: number) => {
    const move = currentPuzzle.moves[index];

    if (!move) return;

    const newGame = new Chess(pos.fen());

    newGame.move({
      from: move.slice(0, 2),
      to: move.slice(2, 4),
      promotion: move[4] as "q" | "r" | "b" | "n" | undefined,
    });

    setMoveIndex(index + 1);

    setGame(newGame);
  };

  // ───────────────── UI VALUES ─────────────────

  const totalMoves = currentPuzzle?.moves.length ?? 0;

  const progress = totalMoves
    ? (Math.min(moveIndex, totalMoves) / totalMoves) * 100
    : 0;

  // ───────────────── RENDER ─────────────────

  return (
    <>
      <NavbarLux />

      <div className="min-h-screen bg-black text-white p-6">
        <div className="grid grid-cols-[220px_1fr_260px] gap-6 h-screen">
          {/* LEFT */}
          <div className="border border-yellow-700 p-4 rounded-lg">
            <h2 className="mb-4 text-yellow-400 font-bold uppercase">Themes</h2>

            <div className="flex flex-col gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`p-2 rounded border ${
                    theme === t.value
                      ? "bg-yellow-500 text-black"
                      : "border-yellow-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* CENTER */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-yellow-400 text-sm uppercase tracking-[0.3em]">
              {status}
            </div>

            <div className="w-[650px]">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop,
                  boardOrientation: playerColor === "w" ? "white" : "black",
                }}
              />
            </div>

            {/* CORRECT */}
            {status === "correct" && (
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setPuzzleIndex(getRandomIndex(filteredPuzzle.length))
                  }
                  className="bg-yellow-500 text-black px-4 py-2 rounded"
                >
                  Next Puzzle
                </button>

                <button
                  onClick={reset}
                  className="border border-yellow-700 px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            )}

            {/* WRONG */}
            {status === "wrong" && (
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Retry
                </button>

                <button
                  onClick={showHint}
                  className="border border-yellow-700 px-4 py-2 rounded"
                >
                  Hint
                </button>
              </div>
            )}

            {/* PROGRESS */}
            <div className="w-full max-w-[650px]">
              <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="border border-yellow-700 p-4 rounded-lg overflow-auto">
            <h2 className="mb-4 text-yellow-400 font-bold uppercase">
              Gacha System
            </h2>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Solved</span>
                <span>{solvedPuzzles}</span>
              </div>

              <div className="flex justify-between">
                <span>Tickets</span>
                <span>🎴 {gachaTickets}</span>
              </div>

              <div className="flex justify-between">
                <span>Inventory</span>
                <span>{inventory.length}</span>
              </div>
            </div>

            <button
              onClick={handleGachaRoll}
              disabled={gachaTickets <= 0}
              className="w-full bg-yellow-500 text-black py-3 rounded font-bold disabled:opacity-40"
            >
              OPEN GACHA
            </button>

            {/* INVENTORY */}
            <div className="mt-6">
              <h3 className="mb-3 text-yellow-400 uppercase text-sm">
                Inventory
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {inventory.map((item, index) => (
                  <div
                    key={index}
                    className="border border-yellow-700 rounded p-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full rounded"
                    />

                    <p className="text-sm mt-2">{item.name}</p>

                    <p className="text-xs uppercase opacity-70">
                      {item.rarity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GACHA MODAL */}
        {showGachaModal && rolledReward && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="w-[350px] bg-zinc-900 border border-yellow-600 rounded-xl p-6 text-center">
              <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm mb-4">
                Gacha Reward
              </p>

              <img
                src={rolledReward.image}
                alt={rolledReward.name}
                className={`w-[220px] mx-auto mb-4 ${
                  rolledReward.rarity === "legendary"
                    ? "drop-shadow-[0_0_30px_gold]"
                    : ""
                }`}
              />

              <h2 className="text-2xl text-yellow-300 mb-2">
                {rolledReward.name}
              </h2>

              <p className="uppercase text-sm tracking-[0.2em] opacity-70 mb-6">
                {rolledReward.rarity}
              </p>

              <button
                onClick={() => setShowGachaModal(false)}
                className="bg-yellow-500 text-black px-6 py-3 rounded font-bold"
              >
                Claim
              </button>
            </div>
          </div>
        )}

        {/* HINT MODAL */}
        {hint && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
            <div className="bg-zinc-900 border border-yellow-700 p-8 rounded-xl text-center">
              <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs mb-3">
                Hint
              </p>

              <h2 className="text-2xl mb-6">{hint}</h2>

              <button
                onClick={() => setHint(null)}
                className="bg-yellow-500 text-black px-5 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GachaPuzzleTest;
