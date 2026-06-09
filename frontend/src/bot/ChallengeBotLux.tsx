import { useCallback, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { useStockfish } from "./useStockfish";
import NavbarLux from "@/componentsdiy/NavbarLux";

/* ─────────────────────────────────────────────────────────
   STYLES
   ───────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --gold:       #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim:   #8a6e2f;
    --bg:         #0a0a0c;
    --bg2:        #111115;
    --border:     rgba(201,168,76,0.16);
    --text:       #f0ece0;
    --muted:      #6e6860;
  }

  html, body { margin: 0; padding: 0; height: 100%; }

  .cb-page {
    position: fixed; inset: 0;
    display: flex; flex-direction: column;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    overflow: hidden;
  }
  .cb-page::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.022) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  /* NAV */
  .cb-nav {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 52px;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,12,0.85);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
  }
  .cb-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 700;
    color: var(--gold-light); letter-spacing: 0.04em;
  }
  .cb-logo span { color: var(--muted); font-weight: 400; font-size: 1rem; }
  .cb-nav-badge {
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--gold); border: 1px solid var(--border);
    padding: 0.2rem 0.7rem; border-radius: 100px;
  }

  /* BODY GRID */
  .cb-body {
    position: relative; z-index: 1;
    flex: 1; min-height: 0;
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    overflow: hidden;
  }

  /* SIDE PANELS */
  .cb-panel {
    display: flex; flex-direction: column;
    padding: 1rem; gap: 0.7rem;
    border-right: 1px solid var(--border);
    overflow: hidden;
  }
  .cb-panel-r { border-right: none; border-left: 1px solid var(--border); }

  .cb-slabel {
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    padding-bottom: 0.45rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; margin: 0;
  }
  .cb-slabel-glow {
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    padding-bottom: 0.45rem; border-bottom: 1px solid var(--border);
    flex-shrink: 0; margin: 0;
    animation: goldPulse 2.5s ease-in-out infinite;
  }
  @keyframes goldPulse {
    0%,100% { opacity:.85; text-shadow: 0 0 5px rgba(255,215,120,.35), 0 0 10px rgba(255,215,120,.15); }
    50%      { opacity:1;   text-shadow: 0 0 8px rgba(255,215,120,.7),  0 0 18px rgba(255,215,120,.4); }
  }

  /* CARDS */
  .cb-card {
    border: 1px solid var(--border); border-radius: 3px; overflow: hidden;
    background: rgba(17,17,21,0.5); flex-shrink: 0;
  }
  .cb-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.4rem 0.7rem;
    border-bottom: 1px solid rgba(201,168,76,0.07);
    font-size: 0.73rem;
  }
  .cb-row:last-child { border-bottom: none; }
  .cb-rl { color: var(--muted); }
  .cb-rv { font-size: 0.9rem; font-weight: 700; color: var(--gold-light); }
  .cb-rv-g { color: #7ed97e; }
  .cb-rv-r { color: #e07070; }
  .cb-rv-b { color: #7ab8e0; }

  /* BUTTONS */
  .cb-btn {
    width: 100%; padding: 0.5rem 0.65rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.76rem; letter-spacing: 0.04em;
    cursor: pointer; border-radius: 3px; transition: all 0.2s;
    border: 1px solid var(--border); background: transparent; color: var(--muted);
    text-align: center;
  }
  .cb-btn:hover { border-color: var(--gold-dim); color: var(--gold-light); background: rgba(201,168,76,0.06); }
  .cb-btn-gold {
    background: linear-gradient(135deg, var(--gold) 0%, #7a540f 100%);
    border-color: transparent; color: #0a0a0c; font-weight: 600;
  }
  .cb-btn-gold:hover {
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(201,168,76,0.22);
  }
  .cb-btn-danger { border-color: rgba(220,80,80,0.3); color: #b06060; }
  .cb-btn-danger:hover { border-color: #e07070; color: #e07070; background: rgba(220,80,80,0.06); }

  /* MOVE LOG */
  .cb-movelog {
    flex: 1; min-height: 0;
    border: 1px solid var(--border); border-radius: 3px;
    background: rgba(17,17,21,0.5);
    overflow-y: auto; padding: 0.4rem 0.6rem;
    display: flex; flex-direction: column; gap: 0.15rem;
    scrollbar-width: thin; scrollbar-color: var(--gold-dim) transparent;
  }
  .cb-move-pair {
    display: grid; grid-template-columns: 22px 1fr 1fr;
    gap: 0.2rem; align-items: center; font-size: 0.72rem;
  }
  .cb-move-num { color: var(--muted); }
  .cb-move-w { color: var(--text); padding: 0.15rem 0.35rem; border-radius: 2px; }
  .cb-move-b { color: var(--muted); padding: 0.15rem 0.35rem; border-radius: 2px; }
  .cb-move-latest { background: rgba(201,168,76,0.1); color: var(--gold-light) !important; }

  /* CENTRE */
  .cb-center {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 0.6rem 1rem; gap: 0.5rem;
    min-height: 0; overflow: hidden;
  }

  /* STATUS PILL */
  .cb-status {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.71rem; letter-spacing: 0.06em;
    padding: 0.22rem 0.85rem; border-radius: 100px; border: 1px solid;
    transition: all 0.3s; flex-shrink: 0; white-space: nowrap;
  }
  .cb-status-playing  { border-color: var(--border); color: var(--muted); }
  .cb-status-thinking { border-color: rgba(201,168,76,0.3); color: var(--gold); background: rgba(201,168,76,0.06); }
  .cb-status-check    { border-color: rgba(220,160,60,0.4); color: #e0b070; background: rgba(220,160,60,0.07); }
  .cb-status-lost     { border-color: rgba(220,80,80,0.35); color: #e07070; background: rgba(220,80,80,0.07); }
  .cb-status-won      { border-color: rgba(100,200,100,0.35); color: #7ed97e; background: rgba(100,200,100,0.07); }
  .cb-status-draw     { border-color: rgba(201,168,76,0.3); color: var(--gold-light); background: rgba(201,168,76,0.06); }
  .cb-sdot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: sdot 2s infinite; }
  @keyframes sdot { 0%,100%{opacity:1} 50%{opacity:.25} }

  /* BOARD */
  .cb-board-wrap {
    position: relative;
    width: min(calc(100vh - 220px), calc(100vw - 420px));
    aspect-ratio: 1;
    flex-shrink: 0;
  }

  /* PLAYER BARS */
  .cb-player-bar {
    width: min(calc(100vh - 220px), calc(100vw - 420px));
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.3rem 0.65rem;
    border: 1px solid var(--border); border-radius: 3px;
    background: rgba(17,17,21,0.6);
    font-size: 0.78rem; flex-shrink: 0;
  }
  .cb-player-info { display: flex; align-items: center; gap: 0.5rem; }
  .cb-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; border: 1px solid var(--border);
  }
  .cb-avatar-bot { background: rgba(201,168,76,0.1); }
  .cb-avatar-you { background: rgba(100,200,100,0.1); border-color: rgba(100,200,100,0.2); }
  .cb-pname  { font-weight: 500; color: var(--text); font-size: 0.75rem; }
  .cb-prating { font-size: 0.65rem; color: var(--muted); }
  .cb-captured { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.03em; }

  /* THINKING */
  .cb-thinking {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.68rem; color: var(--gold); letter-spacing: 0.06em;
  }
  .cb-think-dot {
    width: 4px; height: 4px; border-radius: 50%; background: var(--gold);
    animation: thinkDot 1.2s ease-in-out infinite;
  }
  .cb-think-dot:nth-child(2) { animation-delay: 0.2s; }
  .cb-think-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes thinkDot { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }

  /* CORNERS */
  .cb-corner {
    position: absolute; width: 10px; height: 10px;
    border-color: var(--gold-dim); border-style: solid; opacity: 0.5; z-index: 1; pointer-events: none;
  }
  .cb-corner-tl { top:0; left:0; border-width:1px 0 0 1px; }
  .cb-corner-tr { top:0; right:0; border-width:1px 1px 0 0; }
  .cb-corner-bl { bottom:0; left:0; border-width:0 0 1px 1px; }
  .cb-corner-br { bottom:0; right:0; border-width:0 1px 1px 0; }

  /* OVERLAY */
  .cb-overlay {
    position: absolute; inset: 0; z-index: 10;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.7rem;
    backdrop-filter: blur(8px);
    background: rgba(10,10,12,0.9);
    border: 1px solid var(--border);
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .cb-ov-icon  { font-family: 'Cormorant Garamond', serif; font-size: 3rem; }
  .cb-ov-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 700; margin: 0; }
  .cb-ov-sub   { color: var(--muted); font-size: 0.77rem; }
  .cb-ov-btns  { display: flex; gap: 0.5rem; margin-top: 0.4rem; }
  .cb-ov-btns .cb-btn { width: auto; padding: 0.45rem 1.2rem; }
`;

/* ─────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────── */
type GameStatus = "playing" | "thinking" | "check" | "won" | "lost" | "draw";
interface MovePair {
  num: number;
  white: string;
  black?: string;
}

/* ─────────────────────────────────────────────────────────
   HELPERS (pure, outside component — no closure issues)
   ───────────────────────────────────────────────────────── */
function deriveStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) return game.turn() === "w" ? "lost" : "won";
  if (
    game.isDraw() ||
    game.isStalemate() ||
    game.isThreefoldRepetition() ||
    game.isInsufficientMaterial()
  )
    return "draw";
  if (game.inCheck()) return "check";
  return "playing";
}

/* ─────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────── */
const ChallengeBotLux = () => {
  const chessRef = useRef<Chess>(new Chess());

  // --- UI state ---
  const [fen, setFen] = useState(() => chessRef.current.fen());
  const [status, setStatus] = useState<GameStatus>("playing");
  const [isThinking, setIsThinking] = useState(false);
  // const [tick, setTick] = useState(0); // forces re-render after ref mutation

  // Move history and captured pieces live in refs → never cause double-recording
  const movePairsRef = useRef<MovePair[]>([]);
  const capturedBlackRef = useRef<string[]>([]);
  const capturedWhiteRef = useRef<string[]>([]);
  const moveLogRef = useRef<HTMLDivElement>(null);

  // const forceUpdate = () => setTick((t) => t + 1);

  const scrollLog = () =>
    setTimeout(
      () => moveLogRef.current?.scrollTo({ top: 99999, behavior: "smooth" }),
      50,
    );

  // Append a white move: always opens a new pair
  const appendWhite = (san: string, pairNum: number) => {
    movePairsRef.current = [
      ...movePairsRef.current,
      { num: pairNum, white: san },
    ];
  };

  // Append a black move: always fills the last pair's black slot
  const appendBlack = (san: string) => {
    const pairs = movePairsRef.current;
    if (pairs.length === 0) return;
    const last = pairs[pairs.length - 1];
    movePairsRef.current = [...pairs.slice(0, -1), { ...last, black: san }];
  };

  /* Engine callback */
  const handleBestMove = useCallback((bestMove: string) => {
    const game = chessRef.current;
    if (!bestMove) return;

    const engineMove = game.move({
      from: bestMove.slice(0, 2),
      to: bestMove.slice(2, 4),
      promotion: "q",
    });
    if (!engineMove) return;

    if (engineMove.captured)
      capturedBlackRef.current = [
        ...capturedBlackRef.current,
        engineMove.captured.toUpperCase(),
      ];
    appendBlack(engineMove.san);
    scrollLog();

    setFen(game.fen());
    setIsThinking(false);
    setStatus(deriveStatus(game));
    // forceUpdate();
  }, []); // chessRef is a ref — safe

  const { getBestMove } = useStockfish(handleBestMove);

  /* Player move handler */
  const playerMove = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      const game = chessRef.current;
      if (game.turn() !== "w") return false;
      if (!targetSquare) return false;

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (!move) return false;

      // pairNum = full-move number from chess.js (increments after black moves)
      const pairNum = game.moveNumber() - 1; // moveNumber already ticked after white
      if (move.captured)
        capturedWhiteRef.current = [
          ...capturedWhiteRef.current,
          move.captured.toUpperCase(),
        ];
      appendWhite(move.san, pairNum);
      scrollLog();

      setFen(game.fen());
      const newStatus = deriveStatus(game);
      setStatus(newStatus);
      // forceUpdate();

      if (newStatus === "playing" || newStatus === "check") {
        setIsThinking(true);
        setStatus("thinking");
        setTimeout(() => getBestMove(game.fen()), 300);
      }

      return true;
    },
    [getBestMove],
  );

  /* Reset */
  const resetGame = () => {
    chessRef.current = new Chess();
    movePairsRef.current = [];
    capturedBlackRef.current = [];
    capturedWhiteRef.current = [];
    setFen(chessRef.current.fen());
    setStatus("playing");
    setIsThinking(false);
    // forceUpdate();
  };

  /* Undo (remove both player + engine half-moves) */
  const undoMove = () => {
    const g = chessRef.current;
    g.undo(); // engine (black)
    g.undo(); // player (white)

    const pairs = movePairsRef.current;
    const last = pairs[pairs.length - 1];
    if (last) {
      if (last.black) {
        movePairsRef.current = [
          ...pairs.slice(0, -1),
          { ...last, black: undefined },
        ];
      } else {
        movePairsRef.current = pairs.slice(0, -1);
      }
    }

    setFen(g.fen());
    setStatus(deriveStatus(g));
    setIsThinking(false);
    // forceUpdate();
  };

  const isOver = ["won", "lost", "draw"].includes(status);
  // const game = chessRef.current;
  const pairs = movePairsRef.current;

  const statusLabel: Record<GameStatus, string> = {
    playing: "Your turn — play as White",
    thinking: "Engine is thinking…",
    check: "Check! Defend your king",
    won: "You won by checkmate",
    lost: "Engine wins by checkmate",
    draw: "Game drawn",
  };

  return (
    <>
      <style>{css}</style>
      <div className="cb-page">
        {/* NAV */}
        <NavbarLux />

        <div className="cb-body">
          {/* LEFT PANEL */}
          <div className="cb-panel">
            <p className="cb-slabel-glow">Challenge Bot</p>

            {/* <p className="cb-slabel">Game</p>
            <div className="cb-card">
              <div className="cb-row">
                <span className="cb-rl">Full moves</span>
                <span className="cb-rv">{pairs.length}</span>
              </div>
              <div className="cb-row">
                <span className="cb-rl">Turn</span>
                <span
                  className={`cb-rv ${game.turn() === "w" ? "cb-rv-g" : "cb-rv-b"}`}
                >
                  {game.turn() === "w" ? "White" : "Black"}
                </span>
              </div>
              <div className="cb-row">
                <span className="cb-rl">In Check</span>
                <span className={`cb-rv ${game.inCheck() ? "cb-rv-r" : ""}`}>
                  {game.inCheck() ? "Yes" : "No"}
                </span>
              </div>
              <div className="cb-row">
                <span className="cb-rl">Legal moves</span>
                <span className="cb-rv">{game.moves().length}</span>
              </div>
            </div> */}

            <p className="cb-slabel">Actions</p>
            <button className="cb-btn cb-btn-gold" onClick={resetGame}>
              New Game
            </button>
            <button className="cb-btn cb-btn-danger" onClick={undoMove}>
              Undo Last Move
            </button>
          </div>

          {/* CENTRE */}
          <div className="cb-center">
            <div className={`cb-status cb-status-${status}`}>
              {!isOver && <span className="cb-sdot" />}
              {statusLabel[status]}
            </div>

            {/* Bot bar */}
            <div className="cb-player-bar">
              <div className="cb-player-info">
                <div className="cb-avatar cb-avatar-bot">♟</div>
                <div>
                  <div className="cb-pname">Chill Chess Indo Bot</div>
                  <div className="cb-prating">Black</div>
                </div>
              </div>
              <div className="cb-captured">
                {capturedBlackRef.current.join(" ")}
              </div>
              {isThinking && (
                <div className="cb-thinking">
                  <span className="cb-think-dot" />
                  <span className="cb-think-dot" />
                  <span className="cb-think-dot" />
                  thinking
                </div>
              )}
            </div>

            {/* Board */}
            <div className="cb-board-wrap">
              <div className="cb-corner cb-corner-tl" />
              <div className="cb-corner cb-corner-tr" />
              <div className="cb-corner cb-corner-bl" />
              <div className="cb-corner cb-corner-br" />

              {isOver && (
                <div className="cb-overlay">
                  <div className="cb-ov-icon">
                    {status === "won" ? "♔" : status === "lost" ? "♚" : "⚖"}
                  </div>
                  <p
                    className="cb-ov-title"
                    style={{
                      color:
                        status === "won"
                          ? "#7ed97e"
                          : status === "lost"
                            ? "#e07070"
                            : "var(--gold-light)",
                    }}
                  >
                    {status === "won"
                      ? "Victory"
                      : status === "lost"
                        ? "Defeated"
                        : "Draw"}
                  </p>
                  <div className="cb-ov-sub">
                    {status === "won" && "Checkmate — you outplayed the engine"}
                    {status === "lost" && "The engine found a forced checkmate"}
                    {status === "draw" && "The game ended in a draw"}
                  </div>
                  <div className="cb-ov-btns">
                    <button className="cb-btn cb-btn-gold" onClick={resetGame}>
                      Play Again
                    </button>
                    <button className="cb-btn" onClick={resetGame}>
                      New Game
                    </button>
                  </div>
                </div>
              )}

              <Chessboard
                options={{
                  position: fen,
                  onPieceDrop: playerMove,
                  boardOrientation: "white",
                }}
              />
            </div>

            {/* Player bar */}
            <div className="cb-player-bar">
              <div className="cb-player-info">
                <div className="cb-avatar cb-avatar-you">♙</div>
                <div>
                  <div className="cb-pname">You</div>
                  <div className="cb-prating">White</div>
                </div>
              </div>
              <div className="cb-captured">
                {capturedWhiteRef.current.join(" ")}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="cb-panel cb-panel-r">
            <p className="cb-slabel">Move Log</p>
            <div className="cb-movelog" ref={moveLogRef}>
              {pairs.length === 0 && (
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.72rem",
                    padding: "0.3rem 0",
                  }}
                >
                  No moves yet…
                </div>
              )}
              {pairs.map((pair, i) => {
                const isLast = i === pairs.length - 1;
                return (
                  <div className="cb-move-pair" key={pair.num}>
                    <span className="cb-move-num">{pair.num}.</span>
                    <span
                      className={`cb-move-w${isLast && !pair.black ? " cb-move-latest" : ""}`}
                    >
                      {pair.white}
                    </span>
                    <span
                      className={`cb-move-b${isLast && pair.black ? " cb-move-latest" : ""}`}
                    >
                      {pair.black ?? ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallengeBotLux;
