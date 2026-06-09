import React, { useState } from "react";

import pawnCard from "../assets/cards/pawn.png";

interface Card {
  name: string;
  rarity: "Common" | "Rare" | "Legendary";
  image: string;
}

const ROLLS: Card[] = [
  {
    name: "Pawn",
    rarity: "Rare",
    image: pawnCard,
  },
];

export default function GachaPreview() {
  const [phase, setPhase] = useState<"idle" | "rolling" | "reveal">("idle");

  const [reward, setReward] = useState<Card | null>(null);

  const triggerGacha = () => {
    setPhase("rolling");

    setTimeout(() => {
      const pull = ROLLS[Math.floor(Math.random() * ROLLS.length)];

      setReward(pull);

      setPhase("reveal");
    }, 2200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B14] px-4 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)]" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute text-purple-300/20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 12 + 8}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* ========================= */}
      {/* IDLE */}
      {/* ========================= */}

      {phase === "idle" && (
        <div className="z-10 text-center animate-in fade-in duration-500">
          <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-purple-300">
            Reward Unlocked
          </h1>

          <p className="mt-4 text-slate-400">You solved 5 chess puzzles.</p>

          {/* Chest */}
          <div className="mt-12 flex justify-center">
            <div className="relative flex h-44 w-44 animate-bounce items-center justify-center rounded-[32px] border border-white/10 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-violet-700 text-8xl shadow-[0_0_80px_rgba(168,85,247,0.45)]">
              ♜{/* glow */}
              <div className="absolute inset-0 rounded-[32px] bg-white/10 blur-xl" />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={triggerGacha}
            className="mt-12 rounded-2xl bg-gradient-to-r from-purple-400 to-fuchsia-500 px-10 py-4 text-lg font-black uppercase tracking-wide text-white shadow-[0_0_40px_rgba(217,70,239,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Open Pack
          </button>
        </div>
      )}

      {/* ========================= */}
      {/* ROLLING */}
      {/* ========================= */}

      {phase === "rolling" && (
        <div className="z-10 flex flex-col items-center">
          {/* Rings */}
          <div className="relative flex h-72 w-72 items-center justify-center">
            <div className="absolute h-72 w-72 animate-spin rounded-full border border-purple-400/20" />

            <div className="absolute h-56 w-56 animate-ping rounded-full border border-fuchsia-400/20" />

            <div className="absolute h-44 w-44 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />

            {/* Chest */}
            <div className="animate-bounce text-8xl drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">
              ✨♜✨
            </div>
          </div>

          <p className="mt-8 animate-pulse text-sm font-black uppercase tracking-[0.5em] text-purple-300">
            Summoning Card...
          </p>
        </div>
      )}

      {/* ========================= */}
      {/* REVEAL */}
      {/* ========================= */}

      {phase === "reveal" && reward && (
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in-50 duration-500">
          {/* Legendary glow */}
          <div className="absolute h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" />

          {/* Card container */}
          <div className="relative">
            {/* Shine */}
            <div className="absolute -inset-3 rounded-[40px] bg-gradient-to-r from-purple-500/20 via-fuchsia-500/30 to-violet-500/20 blur-2xl" />

            {/* Actual card image */}
            <img
              src={reward.image}
              alt={reward.name}
              className="
                relative
                w-[340px]
                rounded-[32px]
                border
                border-white/20
                shadow-[0_0_80px_rgba(168,85,247,0.45)]
                animate-[cardReveal_0.7s_ease]
                hover:scale-[1.03]
                transition-all
                duration-300
              "
            />

            {/* Holographic overlay */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-[32px]
                bg-gradient-to-tr
                from-transparent
                via-white/10
                to-transparent
                opacity-70
                mix-blend-screen
              "
            />
          </div>

          {/* Rarity */}
          <div className="mt-8 rounded-full border border-purple-400/30 bg-purple-500/10 px-6 py-2 backdrop-blur-md">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-purple-300">
              {reward.rarity}
            </p>
          </div>

          {/* Name */}
          <h2 className="mt-5 text-4xl font-black uppercase tracking-wide">
            {reward.name}
          </h2>

          {/* Claim button */}
          <button
            onClick={() => {
              setPhase("idle");
              setReward(null);
            }}
            className="mt-10 rounded-2xl bg-slate-800 px-8 py-3 text-sm font-bold uppercase tracking-[0.3em] text-slate-200 transition-all hover:scale-105 hover:bg-slate-700 active:scale-95"
          >
            Claim Reward
          </button>
        </div>
      )}
    </div>
  );
}
