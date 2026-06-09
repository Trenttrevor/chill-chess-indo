import { useCallback, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { useStockfish } from "./useStockfish";

type GameStatus = "playing" | "checkmate" | "draw" | "stalemate";

const MAX_HINTS = 3;

const FLOATERS = [
  {
    piece: "♛",
    style: {
      top: "8%",
      left: "4%",
      fontSize: "3.2rem",
      animationDelay: "0s",
      opacity: 0.06,
    },
  },
  {
    piece: "♜",
    style: {
      top: "28%",
      right: "5%",
      fontSize: "2.6rem",
      animationDelay: "1.4s",
      opacity: 0.05,
    },
  },
  {
    piece: "♞",
    style: {
      bottom: "22%",
      left: "7%",
      fontSize: "3.6rem",
      animationDelay: "2.2s",
      opacity: 0.05,
    },
  },
  {
    piece: "♝",
    style: {
      top: "62%",
      right: "6%",
      fontSize: "2.8rem",
      animationDelay: "0.8s",
      opacity: 0.06,
    },
  },
  {
    piece: "♟",
    style: {
      top: "78%",
      left: "3%",
      fontSize: "2.2rem",
      animationDelay: "1.9s",
      opacity: 0.05,
    },
  },
  {
    piece: "♚",
    style: {
      top: "6%",
      right: "18%",
      fontSize: "2.4rem",
      animationDelay: "3.1s",
      opacity: 0.04,
    },
  },
];

// Separate hook instance just for hints — won't interfere with bot's worker
function useHintEngine() {
  const engineRef = useRef<Worker | null>(null);
  const readyRef = useRef(false);
  const cbRef = useRef<((move: string) => void) | null>(null);

  const init = useCallback(() => {
    if (engineRef.current) return;
    const engine = new Worker("/stockfish/stockfish.js");
    engineRef.current = engine;
    engine.onmessage = (e: MessageEvent) => {
      const line: string = e.data;
      if (line === "readyok") {
        readyRef.current = true;
        return;
      }
      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        cbRef.current?.(move);
      }
    };
    engine.postMessage("uci");
    engine.postMessage("isready");
  }, []);

  const getHint = useCallback(
    (fen: string, onMove: (move: string) => void) => {
      init();
      cbRef.current = onMove;
      const tryAsk = () => {
        if (!readyRef.current) {
          setTimeout(tryAsk, 50);
          return;
        }
        engineRef.current!.postMessage(`position fen ${fen}`);
        engineRef.current!.postMessage("go depth 12");
      };
      tryAsk();
    },
    [init],
  );

  return { getHint };
}

export default function CobaCoba() {
  const chessRef = useRef<Chess>(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [status, setStatus] = useState<GameStatus>("playing");
  const [moveCount, setMoveCount] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [hint, setHint] = useState<{ from: string; to: string } | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const { getHint } = useHintEngine();

  const checkGameStatus = (game: Chess): GameStatus => {
    if (game.isCheckmate()) return "checkmate";
    if (game.isDraw()) return "draw";
    if (game.isStalemate()) return "stalemate";
    return "playing";
  };

  const handleBestMove = useCallback((move: string) => {
    const game = chessRef.current;
    if (!move) return;
    const engineMove = game.move({
      from: move.slice(0, 2),
      to: move.slice(2, 4),
      promotion: "q",
    });
    if (!engineMove) return;
    setLastMove({ from: move.slice(0, 2), to: move.slice(2, 4) });
    setFen(game.fen());
    setMoveCount((c) => c + 1);
    setThinking(false);
    setStatus(checkGameStatus(game));
  }, []);

  const { getBestMove } = useStockfish(handleBestMove);

  const playerMove = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      const game = chessRef.current;
      if (game.turn() !== "w" || status !== "playing") return false;
      if (!targetSquare) return false;
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (!move) return false;
      setHint(null); // clear hint on move
      setLastMove({ from: sourceSquare, to: targetSquare });
      setFen(game.fen());
      setMoveCount((c) => c + 1);
      const newStatus = checkGameStatus(game);
      setStatus(newStatus);
      if (newStatus === "playing") {
        setThinking(true);
        setTimeout(() => getBestMove(game.fen()), 400);
      }
      return true;
    },
    [getBestMove, status],
  );

  const requestHint = () => {
    const game = chessRef.current;
    if (
      hintLoading ||
      thinking ||
      status !== "playing" ||
      game.turn() !== "w" ||
      hintsUsed >= MAX_HINTS
    )
      return;

    setHint(null);
    setHintLoading(true);
    setHintsUsed((n) => n + 1);

    getHint(game.fen(), (move) => {
      if (!move || move === "(none)") {
        setHintLoading(false);
        return;
      }
      setHint({ from: move.slice(0, 2), to: move.slice(2, 4) });
      setHintLoading(false);
    });
  };

  const resetGame = () => {
    chessRef.current = new Chess();
    setFen(chessRef.current.fen());
    setStatus("playing");
    setMoveCount(0);
    setThinking(false);
    setLastMove(null);
    setHint(null);
    setHintsUsed(0);
  };

  const isGameOver = status !== "playing";
  const canHint =
    !hintLoading &&
    !thinking &&
    !isGameOver &&
    chessRef.current.turn() === "w" &&
    hintsUsed < MAX_HINTS;
  const hintsLeft = MAX_HINTS - hintsUsed;

  const statusLabel = {
    playing: thinking ? "Bot sedang berpikir…" : "Giliran kamu, Putih",
    checkmate: moveCount % 2 === 0 ? "♔ Kamu Menang!" : "♚ Kamu Kalah",
    draw: "⚖ Permainan Seri",
    stalemate: "⚑ Stalemate",
  }[status];

  // Build square styles: last move (gold) + hint (teal), hint takes priority on overlap
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    customSquareStyles[lastMove.from] = {
      backgroundColor: "rgba(201,168,76,0.28)",
    };
    customSquareStyles[lastMove.to] = {
      backgroundColor: "rgba(201,168,76,0.46)",
    };
  }
  if (hint) {
    customSquareStyles[hint.from] = {
      backgroundColor: "rgba(80,200,140,0.35)",
      boxShadow: "inset 0 0 0 3px rgba(80,200,140,0.7)",
      borderRadius: "2px",
    };
    customSquareStyles[hint.to] = {
      backgroundColor: "rgba(80,200,140,0.55)",
      boxShadow: "inset 0 0 0 3px rgba(80,200,140,0.85)",
      borderRadius: "2px",
    };
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold:       #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim:   #8a6e2f;
          --teal:       #50C88C;
          --teal-dim:   rgba(80,200,140,0.15);
          --bg:         #0a0a0c;
          --bg2:        #111115;
          --bg3:        #18181e;
          --surface:    #1e1e26;
          --border:     rgba(201,168,76,0.18);
          --text:       #f0ece0;
          --muted:      #7a7465;
        }

        .cb-root {
          min-height: 100vh;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 70%, rgba(201,168,76,0.04) 0%, transparent 60%);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 20px 72px;
          position: relative; overflow: hidden;
        }

        .cb-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 100%);
        }

        .cb-floater {
          position: fixed; color: var(--gold);
          animation: floatDrift 9s ease-in-out infinite;
          user-select: none; pointer-events: none; z-index: 0;
        }
        @keyframes floatDrift {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-16px) rotate(3deg); }
          66%      { transform: translateY(7px) rotate(-2.5deg); }
        }

        .cb-content { position: relative; z-index: 1; width: 100%; display: flex; flex-direction: column; align-items: center; }

        .cb-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid var(--border); background: rgba(201,168,76,0.06);
          color: var(--gold); font-size: 0.72rem; letter-spacing: 0.16em;
          text-transform: uppercase; padding: 0.32rem 1rem; border-radius: 100px;
          margin-bottom: 1.6rem; animation: fadeUp 0.7s ease both;
        }
        .cb-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

        .cb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 6vw, 4.8rem); font-weight: 700;
          line-height: 1.05; letter-spacing: -0.01em; text-align: center;
          color: var(--text); animation: fadeUp 0.7s 0.1s ease both; margin-bottom: 0.5rem;
        }
        .cb-title .gold { color: var(--gold-light); }

        .cb-divider {
          width: 56px; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 1.4rem auto 1rem; animation: fadeUp 0.7s 0.2s ease both;
        }

        .cb-sub {
          font-size: 0.95rem; color: var(--muted); font-weight: 300;
          letter-spacing: 0.03em; text-align: center; margin-bottom: 3rem;
          animation: fadeUp 0.7s 0.25s ease both;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .cb-card {
          background: var(--bg2); border: 1px solid var(--border); border-radius: 4px;
          padding: 28px; max-width: 520px; width: 100%;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.8), 0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(201,168,76,0.07);
          animation: fadeUp 0.7s 0.3s ease both; position: relative;
        }
        .cb-card::before {
          content: ''; position: absolute;
          top: -1px; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent); opacity: 0.7;
        }

        .cb-banner {
          text-align: center; padding: 12px 16px; margin-bottom: 20px;
          border: 1px solid rgba(201,168,76,0.28); background: rgba(201,168,76,0.06);
          border-radius: 3px; font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; font-style: italic; color: var(--gold-light);
          animation: fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        .cb-board-wrap {
          border-radius: 2px; overflow: hidden;
          box-shadow:
            0 0 0 5px var(--bg), 0 0 0 6px var(--gold-dim),
            0 0 0 7px var(--bg), 0 24px 60px rgba(0,0,0,0.6),
            0 0 40px rgba(201,168,76,0.07);
        }

        /* ── Hint banner ── */
        .cb-hint-banner {
          display: flex; align-items: center; gap: 10px;
          margin-top: 16px; padding: 11px 16px;
          background: rgba(80,200,140,0.07);
          border: 1px solid rgba(80,200,140,0.25);
          border-radius: 3px;
          animation: fadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cb-hint-icon { font-size: 1rem; }
        .cb-hint-text {
          font-size: 0.85rem; color: var(--teal); font-weight: 400; letter-spacing: 0.02em; flex: 1;
        }
        .cb-hint-dismiss {
          background: none; border: none; color: var(--muted);
          cursor: pointer; font-size: 1rem; line-height: 1; padding: 0 2px;
          transition: color 0.2s;
        }
        .cb-hint-dismiss:hover { color: var(--text); }

        /* ── Status bar ── */
        .cb-status-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 16px; padding: 13px 18px;
          background: var(--bg3); border: 1px solid var(--border); border-radius: 3px;
        }
        .cb-status-left { display: flex; align-items: center; gap: 10px; }
        .cb-status-indicator {
          width: 7px; height: 7px; border-radius: 50%; background: var(--gold);
          box-shadow: 0 0 8px rgba(201,168,76,0.6); flex-shrink: 0;
        }
        .cb-status-text {
          font-size: 0.88rem; font-weight: 400; color: var(--text);
          display: flex; align-items: center; gap: 8px; letter-spacing: 0.02em;
        }
        .cb-move-tag {
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--gold);
          border: 1px solid var(--border); padding: 3px 10px; border-radius: 100px;
          background: rgba(201,168,76,0.06);
        }

        /* Thinking dots */
        .dots { display:inline-flex; gap:4px; align-items:center; }
        .dots span { width:4px; height:4px; border-radius:50%; background: var(--gold); animation: dotPulse 1.3s ease-in-out infinite; }
        .dots span:nth-child(2) { animation-delay:.22s; }
        .dots span:nth-child(3) { animation-delay:.44s; }
        @keyframes dotPulse {
          0%,80%,100% { opacity:.2; transform:scale(.75); }
          40%          { opacity:1;  transform:scale(1);   }
        }

        /* ── Action row ── */
        .cb-actions { display: flex; gap: 10px; margin-top: 14px; }

        /* Hint button */
        .cb-btn-hint {
          flex: 1; padding: 13px 10px;
          background: var(--teal-dim);
          border: 1px solid rgba(80,200,140,0.3);
          color: var(--teal);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; border-radius: 3px;
          transition: all 0.25s ease; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .cb-btn-hint:hover:not(:disabled) {
          background: rgba(80,200,140,0.18);
          border-color: rgba(80,200,140,0.55);
          box-shadow: 0 4px 20px rgba(80,200,140,0.12);
          transform: translateY(-1px);
        }
        .cb-btn-hint:disabled {
          opacity: 0.38; cursor: not-allowed;
        }
        .cb-btn-hint:active:not(:disabled) { transform: scale(0.99); }

        .cb-hint-pips { display: flex; gap: 3px; align-items: center; }
        .cb-hint-pip {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--teal); transition: opacity 0.2s;
        }
        .cb-hint-pip.used { background: var(--muted); opacity: 0.4; }

        /* Reset button */
        .cb-btn-reset {
          flex: 1; padding: 13px 10px;
          background: transparent; border: 1px solid var(--border);
          color: var(--gold-light);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; border-radius: 3px;
          transition: all 0.25s ease; position: relative; overflow: hidden;
        }
        .cb-btn-reset::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(201,168,76,0.06); opacity: 0; transition: opacity 0.25s;
        }
        .cb-btn-reset:hover::before { opacity: 1; }
        .cb-btn-reset:hover {
          border-color: var(--gold); color: var(--gold-light);
          box-shadow: 0 4px 20px rgba(201,168,76,0.12); transform: translateY(-1px);
        }
        .cb-btn-reset:active { transform: scale(0.99); }

        .cb-footer-note {
          margin-top: 24px; font-size: 0.75rem; font-weight: 300;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
          text-align: center; animation: fadeUp 0.7s 0.4s ease both;
        }

        /* Hint loading spin */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="cb-grid" />
      {FLOATERS.map((f, i) => (
        <div key={i} className="cb-floater" style={f.style}>
          {f.piece}
        </div>
      ))}

      <div className="cb-content">
        <div className="cb-badge">
          <span className="cb-badge-dot" />
          Human vs Robot
        </div>

        <h1 className="cb-title">
          Challenge <span className="gold">the Bot</span>
        </h1>

        <div className="cb-divider" />
        <p className="cb-sub">Rebut kembali mahkota untuk ras manusia</p>

        <div className="cb-card">
          {isGameOver && <div className="cb-banner">{statusLabel}</div>}

          <div className="cb-board-wrap">
            <Chessboard
              options={{
                position: fen,
                onPieceDrop: playerMove,
                customSquareStyles,
                lightSquareStyle: { backgroundColor: "#2a2520" },
                darkSquareStyle: { backgroundColor: "#1a1714" },
              }}
            />
          </div>

          {/* Hint result banner */}
          {hint && (
            <div className="cb-hint-banner">
              <span className="cb-hint-icon">💡</span>
              <span className="cb-hint-text">
                Langkah terbaik:{" "}
                <strong>
                  {hint.from.toUpperCase()} → {hint.to.toUpperCase()}
                </strong>
              </span>
              <button className="cb-hint-dismiss" onClick={() => setHint(null)}>
                ✕
              </button>
            </div>
          )}

          <div className="cb-status-bar">
            <div className="cb-status-left">
              <div className="cb-status-indicator" />
              <div className="cb-status-text">
                {thinking ? (
                  <>
                    Bot berpikir{" "}
                    <span className="dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </>
                ) : hintLoading ? (
                  <>
                    <span className="spin">⟳</span> Menganalisis…
                  </>
                ) : (
                  statusLabel
                )}
              </div>
            </div>
            <div className="cb-move-tag">
              Move {Math.ceil(moveCount / 2) || 1}
            </div>
          </div>

          <div className="cb-actions">
            {/* Hint button */}
            <button
              className="cb-btn-hint"
              onClick={requestHint}
              disabled={!canHint}
              title={
                hintsUsed >= MAX_HINTS
                  ? "Petunjuk habis"
                  : "Minta petunjuk terbaik dari Stockfish"
              }
            >
              {hintLoading ? <span className="spin">⟳</span> : "💡"}
              Minta Petunjuk
              <span className="cb-hint-pips">
                {Array.from({ length: MAX_HINTS }, (_, i) => (
                  <span
                    key={i}
                    className={`cb-hint-pip${i >= hintsLeft ? " used" : ""}`}
                  />
                ))}
              </span>
            </button>

            {/* New game button */}
            <button className="cb-btn-reset" onClick={resetGame}>
              ♟ Mulai Baru
            </button>
          </div>
        </div>

        <p className="cb-footer-note">
          Kamu bermain sebagai Putih &nbsp;·&nbsp; Stockfish Depth 12
        </p>
      </div>
    </>
  );
}
