import { useState, useEffect, useRef } from "react";
import BishopCard from "../assets/cards/bishop.png";
import KnightCard from "../assets/cards/knight.png";
import PawnCard from "../assets/cards/pawn.png";

// ── Chess piece card data ──────────────────────────────────────────
const CARDS = [
  {
    id: "pawn",
    name: "Pawn",
    image: PawnCard,
    rarity: "common",
    glow: "rgba(157,39,176,0.5)",
  },
  {
    id: "knight",
    name: "Knight",
    image: KnightCard,
    rarity: "uncommon",
    glow: "rgba(39,174,96,0.5)",
  },
  {
    id: "bishop",
    name: "Bishop",
    image: BishopCard,
    rarity: "uncommon",
    glow: "rgba(230,126,34,0.5)",
  },
];

const WEIGHTS: Record<string, number> = { common: 50, uncommon: 50 };

function pickCard() {
  const pool: typeof CARDS = [];
  CARDS.forEach((c) => {
    for (let i = 0; i < WEIGHTS[c.rarity]; i++) pool.push(c);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Particle burst ────────────────────────────────────────────────
function Particles({ color, active }: { color: string; active: boolean }) {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * 360,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.3,
    duration: 0.6 + Math.random() * 0.5,
  }));
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
            transform: `translate(-50%,-50%) rotate(${p.angle}deg) translateX(0px)`,
            animation: `particleBurst ${p.duration}s ${p.delay}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ── Card Face ─────────────────────────────────────────────────────
function CardFace({
  card,
  revealed,
  shine,
}: {
  card: (typeof CARDS)[0];
  revealed: boolean;
  shine: boolean;
}) {
  return (
    <div
      className="w-full h-full relative"
      style={{
        animation: revealed ? "pieceFloat 3s ease-in-out infinite" : "none",
        boxShadow: revealed
          ? `0 0 40px ${card.glow}, 0 0 80px ${card.glow}40`
          : "none",
        transition: "box-shadow 0.5s",
        borderRadius: 18,
      }}
    >
      {/* Shine sweep */}
      {shine && (
        <div
          className="absolute inset-0 z-10 pointer-events-none rounded-[18px]"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
            animation: "shineSweep 0.8s ease forwards",
          }}
        />
      )}

      {/* Card image — no clipping, full card visible */}
      <img
        src={card.image}
        alt={card.name}
        className="w-full h-full object-contain"
        style={{ display: "block" }}
      />
    </div>
  );
}

// ── Card Back ─────────────────────────────────────────────────────
function CardBack() {
  return (
    <div
      className="w-full h-full rounded-[18px] flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)",
        border: "2px solid rgba(201,168,76,0.3)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="text-center relative z-10">
        <div
          className="text-[64px]"
          style={{
            color: "rgba(201,168,76,0.15)",
            textShadow: "0 0 30px rgba(201,168,76,0.1)",
          }}
        >
          ♚
        </div>
        <div
          className="text-[11px] tracking-[0.3em] uppercase -mt-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "rgba(201,168,76,0.4)",
          }}
        >
          Chill-Chess-Indo
        </div>
      </div>
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (pos) => (
          <div
            key={pos}
            className="absolute text-sm"
            style={{
              top: pos.includes("top") ? 12 : "auto",
              bottom: pos.includes("bottom") ? 12 : "auto",
              left: pos.includes("left") ? 12 : "auto",
              right: pos.includes("right") ? 12 : "auto",
              color: "rgba(201,168,76,0.25)",
            }}
          >
            ✦
          </div>
        ),
      )}
    </div>
  );
}

// ── Slot Reel ─────────────────────────────────────────────────────
function SlotReel({
  spinning,
  onDone,
}: {
  spinning: boolean;
  onDone: () => void;
}) {
  const icons = ["♟", "♞", "♝", "♜", "♛", "♚"];
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef(0);

  useEffect(() => {
    if (!spinning) return;
    countRef.current = 0;
    let delay = 60;
    const tick = () => {
      setIdx((i) => (i + 1) % icons.length);
      countRef.current++;
      if (countRef.current < 20) {
        delay = 60 + countRef.current * 8;
        intervalRef.current = setTimeout(tick, delay);
      } else {
        onDone();
      }
    };
    intervalRef.current = setTimeout(tick, delay);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [spinning]);

  return (
    <div
      className="w-20 h-20 rounded-xl flex items-center justify-center text-[42px] overflow-hidden relative"
      style={{
        border: "2px solid rgba(201,168,76,0.4)",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          animation: spinning ? "reelSpin 0.12s steps(1) infinite" : "none",
        }}
      >
        {icons[idx]}
      </div>
    </div>
  );
}

// ── Gacha Modal ───────────────────────────────────────────────────
export function GachaModal({
  tickets = 1,
  onClose,
  onTicketUsed,
}: {
  tickets?: number;
  onClose: () => void;
  onTicketUsed?: () => void;
}) {
  const [phase, setPhase] = useState<
    "idle" | "spinning" | "flipping" | "revealed"
  >("idle");
  const [card, setCard] = useState<(typeof CARDS)[0] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [shine, setShine] = useState(false);
  const [particles, setParticles] = useState(false);
  const [remaining, setRemaining] = useState(tickets);

  const handlePull = () => {
    if (remaining <= 0 || phase !== "idle") return;
    const drawn = pickCard();
    setCard(drawn);
    setFlipped(false);
    setPhase("spinning");
  };

  const handleSpinDone = () => {
    setPhase("flipping");
    setTimeout(() => {
      setFlipped(true);
      setTimeout(() => {
        setShine(true);
        setParticles(true);
        setPhase("revealed");
        setRemaining((r) => r - 1);
        onTicketUsed?.();
        setTimeout(() => {
          setShine(false);
          setParticles(false);
        }, 1000);
      }, 400);
    }, 200);
  };

  const handleNext = () => {
    setPhase("idle");
    setCard(null);
    setFlipped(false);
  };
  const isRevealed = phase === "revealed";
  const isSpinning = phase === "spinning";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes modalIn {
          from { opacity:0; transform:scale(0.92) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes cardFlipIn {
          0%   { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes shineSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pieceFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes legendaryAura {
          0%,100% { box-shadow: 0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.2); }
          50%     { box-shadow: 0 0 60px rgba(201,168,76,0.7), 0 0 120px rgba(201,168,76,0.35); }
        }
        @keyframes ticketPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50%     { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
        }
        @keyframes reelSpin {
          0%   { opacity:0.3; }
          50%  { opacity:1; }
          100% { opacity:0.3; }
        }
        @keyframes bgPulse {
          0%,100% { opacity:0.4; }
          50%     { opacity:0.7; }
        }
        @keyframes particleBurst {
          0%   { transform: translate(-50%,-50%) rotate(var(--a,0deg)) translateX(0px); opacity:1; }
          100% { transform: translate(-50%,-50%) rotate(var(--a,0deg)) translateX(160px); opacity:0; }
        }
        .gacha-card-3d { perspective: 1000px; }
        .gacha-card-inner {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gacha-card-inner.flipped { animation: cardFlipIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .gacha-card-face, .gacha-card-back { position: absolute; inset: 0; backface-visibility: hidden; }
        .gacha-card-back { transform: rotateY(180deg); }
        .gacha-btn-gold {
          transition: all 0.2s;
        }
        .gacha-btn-gold:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.3);
        }
        .gacha-btn-outline:hover {
          border-color: rgba(201,168,76,0.5) !important;
          color: rgba(201,168,76,0.9) !important;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        onClick={phase === "idle" || isRevealed ? onClose : undefined}
      >
        {/* Modal */}
        <div
          className="w-[480px] max-w-[95vw] rounded-2xl p-7 pb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #111115 0%, #0a0a0c 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow:
              "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.05)",
            animation: "modalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* BG glow */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] pointer-events-none"
            style={{
              background: card ? card.glow : "rgba(201,168,76,0.15)",
              filter: "blur(60px)",
              animation: "bgPulse 3s ease-in-out infinite",
              transition: "background 0.5s",
            }}
          />

          {/* Header */}
          <div className="text-center relative mb-5">
            <div
              className="text-[9px] tracking-[0.35em] uppercase mb-1"
              style={{ color: "rgba(201,168,76,0.5)" }}
            >
              Gacha Draw
            </div>
            <div
              className="text-[26px] font-bold"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#f0ece0",
              }}
            >
              Piece Collection
            </div>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1 rounded-full"
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                animation: remaining > 0 ? "ticketPulse 2s infinite" : "none",
              }}
            >
              <span className="text-[13px]">🎫</span>
              <span
                className="text-xs tracking-wide"
                style={{ color: "rgba(201,168,76,0.8)" }}
              >
                {remaining} ticket{remaining !== 1 ? "s" : ""} remaining
              </span>
            </div>
          </div>

          {/* Slot reels */}
          {isSpinning && (
            <div className="flex justify-center gap-3 mb-5">
              {[0, 1, 2].map((i) => (
                <SlotReel
                  key={i}
                  spinning={isSpinning}
                  onDone={i === 1 ? handleSpinDone : () => {}}
                />
              ))}
            </div>
          )}

          {/* Card display */}
          {(phase === "flipping" || isRevealed) && card && (
            <div className="flex justify-center mb-5">
              <div
                className="gacha-card-3d"
                style={{
                  width: 260,
                  height: 420,
                  animation:
                    card.rarity === "legendary" && isRevealed
                      ? "legendaryAura 2s ease-in-out infinite"
                      : "none",
                  borderRadius: 18,
                }}
              >
                <div className={`gacha-card-inner ${flipped ? "flipped" : ""}`}>
                  <div className="gacha-card-face">
                    <CardFace card={card} revealed={isRevealed} shine={shine} />
                    <Particles color={card.color} active={particles} />
                  </div>
                  <div className="gacha-card-back">
                    <CardBack />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Idle state */}
          {phase === "idle" && (
            <div className="flex justify-center mb-5">
              <div
                className="relative"
                style={{
                  width: 260,
                  height: 420,
                  cursor: remaining > 0 ? "pointer" : "not-allowed",
                }}
                onClick={handlePull}
              >
                <CardBack />
                {remaining > 0 && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[18px] transition-all duration-200 hover:bg-black/30"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                  >
                    <div
                      className="text-[32px]"
                      style={{ color: "rgba(201,168,76,0.6)" }}
                    >
                      ✦
                    </div>
                    <div
                      className="text-lg tracking-[0.1em]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "rgba(201,168,76,0.8)",
                      }}
                    >
                      Click to Draw
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rarity banner */}
          {isRevealed && card && (
            <div className="text-center mb-4">
              <div
                className="inline-block px-5 py-1 rounded-full uppercase tracking-[0.15em] text-[15px]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  background: `linear-gradient(90deg, transparent, ${card.color}33, transparent)`,
                  border: `1px solid ${card.color}44`,
                  color: card.color,
                }}
              >
                {card.rarityLabel} · {card.name}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2.5 justify-center">
            {isRevealed && remaining > 0 && (
              <button
                className="gacha-btn-gold px-7 py-2.5 rounded-md text-[13px] font-semibold tracking-wide border-none cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #C9A84C 0%, #7a540f 100%)",
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#0a0a0c",
                }}
                onClick={handleNext}
              >
                Draw Again →
              </button>
            )}
            <button
              className="gacha-btn-outline px-7 py-2.5 rounded-md text-[13px] tracking-wide cursor-pointer bg-transparent transition-all duration-200"
              style={{
                border: "1px solid rgba(201,168,76,0.2)",
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(201,168,76,0.6)",
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* Odds */}
          <div
            className="mt-4 flex justify-center gap-4 pt-3.5"
            style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
          >
            {[
              { label: "Common", pct: "50%", color: "#9b59b6" },
              { label: "Uncommon", pct: "50%", color: "#27ae60" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div
                  className="text-[10px] font-semibold"
                  style={{ color: r.color }}
                >
                  {r.pct}
                </div>
                <div
                  className="text-[9px] tracking-wide"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Demo wrapper ──────────────────────────────────────────────────
export default function GachaDemo() {
  const [showGacha, setShowGacha] = useState(false);
  const [tickets, setTickets] = useState(3);
  const [solved, setSolved] = useState(0);

  const simulateSolve = () => {
    setSolved((s) => s + 1);
    setTickets((t) => t + 1);
    setTimeout(() => setShowGacha(true), 200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0c; }
        .solve-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.3); }
        .open-btn:hover { border-color: rgba(201,168,76,0.7) !important; color: #C9A84C !important; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{
          background: "#0a0a0c",
          fontFamily: "'DM Sans', sans-serif",
          color: "#f0ece0",
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.022) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div className="text-center">
          <div
            className="text-[32px] mb-1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#C9A84C",
            }}
          >
            Gacha System Demo
          </div>
          <div
            className="text-xs tracking-[0.1em]"
            style={{ color: "#6e6860" }}
          >
            Solve puzzles → earn tickets → draw cards
          </div>
        </div>

        <div
          className="flex gap-6 items-center px-7 py-4 rounded-xl"
          style={{
            background: "rgba(17,17,21,0.8)",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#C9A84C" }}>
              {solved}
            </div>
            <div
              className="text-[10px] tracking-[0.1em]"
              style={{ color: "#6e6860" }}
            >
              PUZZLES SOLVED
            </div>
          </div>
          <div
            className="w-px h-10"
            style={{ background: "rgba(201,168,76,0.15)" }}
          />
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#f0ece0" }}>
              {tickets} 🎫
            </div>
            <div
              className="text-[10px] tracking-[0.1em]"
              style={{ color: "#6e6860" }}
            >
              TICKETS
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="solve-btn px-8 py-3 rounded-md text-[13px] font-semibold tracking-wide border-none cursor-pointer transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #7a540f 100%)",
              fontFamily: "'DM Sans', sans-serif",
              color: "#0a0a0c",
            }}
            onClick={simulateSolve}
          >
            ✓ Solve Puzzle (+1 ticket)
          </button>
          {tickets > 0 && (
            <button
              className="open-btn px-8 py-3 rounded-md text-[13px] tracking-wide cursor-pointer bg-transparent transition-all duration-200"
              style={{
                border: "1px solid rgba(201,168,76,0.3)",
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(201,168,76,0.8)",
              }}
              onClick={() => setShowGacha(true)}
            >
              🎫 Open Gacha
            </button>
          )}
        </div>
      </div>

      {showGacha && (
        <GachaModal
          tickets={tickets}
          onClose={() => setShowGacha(false)}
          onTicketUsed={() => setTickets((t) => Math.max(0, t - 1))}
        />
      )}
    </>
  );
}
