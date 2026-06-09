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

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: "all", label: "All Puzzles", icon: "♟" },
  { value: "mateIn1", label: "Mate in 1", icon: "①" },
  { value: "mateIn2", label: "Mate in 2", icon: "②" },
  { value: "mateIn3", label: "Mate in 3", icon: "③" },
  { value: "mateIn4", label: "Mate in 4", icon: "④" },
];

const Puzzle = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<Status>("playing");
  const [theme, setTheme] = useState<Theme>("all");
  const [solvedCount, setSolvedCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const filteredPuzzle = puzzlesData.filter((pt) =>
    theme === "all" ? true : pt.themes.includes(theme),
  );
  const currentPuzzle: Puzzles = filteredPuzzle[puzzleIndex];

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
    const expectedMove = currentPuzzle.moves[moveIndex];
    const playerMove = sourceSquare + targetSquare;
    if (expectedMove !== playerMove) {
      setStatus("wrong");
      setWrongCount((p) => p + 1);
      return false;
    }
    setMoveIndex(nextIndex);
    setGame(newGame);
    if (currentPuzzle.moves.length === nextIndex) {
      setStatus("correct");
      setSolvedCount((p) => p + 1);
      return true;
    }
    setTimeout(() => {
      computerMove(newGame, nextIndex);
    }, 200);
    return true;
  };

  const computerMove = (currentPosition: Chess, index: number) => {
    const move = currentPuzzle.moves[index];
    if (!move) return;
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    const newGame = new Chess(currentPosition.fen());
    newGame.move({ from, to });
    setMoveIndex(index + 1);
    setGame(newGame);
  };

  const totalMoves = currentPuzzle?.moves.length ?? 0;
  const playerMoves = Math.ceil(totalMoves / 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: #8a6e2f;
          --bg: #0a0a0c;
          --bg2: #111115;
          --surface: #1e1e26;
          --border: rgba(201,168,76,0.18);
          --border-bright: rgba(201,168,76,0.35);
          --text: #f0ece0;
          --muted: #7a7465;
        }

        .puzzle-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* background grid */
        .puzzle-page::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .puzzle-inner {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* PAGE HEADER */
        .puzzle-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .puzzle-title-block {}
        .puzzle-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.4rem;
        }
        .puzzle-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem;
          font-weight: 700;
          line-height: 1;
          color: var(--text);
        }
        .puzzle-title span { color: var(--gold-light); }

        .puzzle-stats {
          display: flex; gap: 1.5rem;
        }
        .stat-pill {
          text-align: center;
          border: 1px solid var(--border);
          background: var(--bg2);
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          min-width: 72px;
        }
        .stat-pill-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--gold-light);
          line-height: 1;
        }
        .stat-pill-label {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 2px;
        }

        /* LAYOUT */
        .puzzle-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* SIDEBAR */
        .sidebar {}
        .sidebar-section {
          margin-bottom: 1.5rem;
        }
        .sidebar-label {
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }
        .theme-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.9rem;
          margin-bottom: 0.4rem;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
          text-align: left;
        }
        .theme-btn:hover {
          border-color: var(--gold-dim);
          color: var(--gold-light);
          background: rgba(201,168,76,0.05);
        }
        .theme-btn.active {
          border-color: var(--gold);
          background: rgba(201,168,76,0.1);
          color: var(--gold-light);
        }
        .theme-icon { font-size: 1rem; width: 20px; text-align: center; }

        .puzzle-info-card {
          border: 1px solid var(--border);
          background: var(--bg2);
          border-radius: 4px;
          padding: 1rem;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.45rem 0;
          border-bottom: 1px solid rgba(201,168,76,0.08);
          font-size: 0.82rem;
        }
        .info-row:last-child { border-bottom: none; }
        .info-row-label { color: var(--muted); }
        .info-row-val {
          color: var(--gold-light);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
        }

        /* BOARD AREA */
        .board-area {}

        .board-wrapper {
          position: relative;
          border: 1px solid var(--border);
          background: var(--bg2);
          padding: 1.5rem;
          border-radius: 4px;
        }

        /* status bar above board */
        .status-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.2rem;
          min-height: 36px;
        }
        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          padding: 0.3rem 0.9rem;
          border-radius: 100px;
          border: 1px solid;
          transition: all 0.3s;
        }
        .status-playing {
          border-color: var(--border);
          color: var(--muted);
          background: transparent;
        }
        .status-correct {
          border-color: rgba(100,200,100,0.4);
          color: #7ed97e;
          background: rgba(100,200,100,0.08);
        }
        .status-wrong {
          border-color: rgba(220,80,80,0.4);
          color: #e07070;
          background: rgba(220,80,80,0.08);
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .turn-badge {
          margin-left: auto;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .turn-badge span {
          color: var(--gold-light);
          font-weight: 500;
        }

        /* move progress */
        .move-progress {
          margin-top: 1.2rem;
          margin-bottom: 0;
        }
        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }
        .progress-track {
          height: 3px;
          background: rgba(201,168,76,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-dim), var(--gold));
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        /* action buttons */
        .action-row {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .btn-action {
          flex: 1;
          padding: 0.65rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.25s;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
        }
        .btn-action:hover {
          border-color: var(--gold-dim);
          color: var(--gold-light);
          background: rgba(201,168,76,0.06);
        }
        .btn-action-gold {
          background: linear-gradient(135deg, var(--gold) 0%, #8a6020 100%);
          border-color: transparent;
          color: #0a0a0c;
          font-weight: 600;
        }
        .btn-action-gold:hover {
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201,168,76,0.25);
        }

        /* result overlay */
        .result-panel {
          position: absolute; inset: 0;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          z-index: 10;
          backdrop-filter: blur(6px);
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .result-correct {
          background: rgba(10,10,12,0.88);
          border: 1px solid rgba(100,200,100,0.3);
        }
        .result-wrong {
          background: rgba(10,10,12,0.88);
          border: 1px solid rgba(220,80,80,0.3);
        }
        .result-icon {
          font-size: 3.5rem;
          font-family: 'Cormorant Garamond', serif;
        }
        .result-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
        }
        .result-correct .result-title { color: #7ed97e; }
        .result-wrong .result-title { color: #e07070; }
        .result-sub { color: var(--muted); font-size: 0.85rem; }
        .result-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }

        /* chessboard custom colors */
        .board-wrapper [data-square-color="white"] { background: #2a2520 !important; }
        .board-wrapper [data-square-color="black"] { background: #1a1714 !important; }

        /* responsive */
        @media (max-width: 780px) {
          .puzzle-layout { grid-template-columns: 1fr; }
          .sidebar { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .sidebar-section { flex: 1; min-width: 160px; }
          .puzzle-title { font-size: 2rem; }
          .puzzle-stats { gap: 0.75rem; }
        }
      `}</style>

      <div className="puzzle-page">
        <div className="puzzle-inner">
          {/* PAGE HEADER */}
          <div className="puzzle-header">
            <div className="puzzle-title-block">
              <p className="puzzle-eyebrow">Training Ground</p>
              <h1 className="puzzle-title">
                Chess <span>Puzzles</span>
              </h1>
            </div>
            <div className="puzzle-stats">
              <div className="stat-pill">
                <div className="stat-pill-val">{solvedCount}</div>
                <div className="stat-pill-label">Solved</div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-val">{wrongCount}</div>
                <div className="stat-pill-label">Missed</div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-val">{puzzleIndex + 1}</div>
                <div className="stat-pill-label">Puzzle #</div>
              </div>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="puzzle-layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
              <div className="sidebar-section">
                <p className="sidebar-label">Difficulty</p>
                {themes.map((t) => (
                  <button
                    key={t.value}
                    className={`theme-btn${theme === t.value ? " active" : ""}`}
                    onClick={() => setTheme(t.value)}
                  >
                    <span className="theme-icon">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="sidebar-section">
                <p className="sidebar-label">Puzzle Info</p>
                <div className="puzzle-info-card">
                  <div className="info-row">
                    <span className="info-row-label">ID</span>
                    <span
                      className="info-row-val"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {currentPuzzle?.id ?? "—"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Rating</span>
                    <span className="info-row-val">
                      {currentPuzzle?.rating ?? "—"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Moves</span>
                    <span className="info-row-val">{playerMoves}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">You play</span>
                    <span className="info-row-val">
                      {playerColor === "w" ? "♔ White" : "♚ Black"}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* BOARD AREA */}
            <div className="board-area">
              <div className="board-wrapper">
                {/* STATUS BAR */}
                <div className="status-bar">
                  <div className={`status-indicator status-${status}`}>
                    <span className="status-dot" />
                    {status === "playing" && "Find the best move"}
                    {status === "correct" && "Excellent move!"}
                    {status === "wrong" && "Not the right move"}
                  </div>
                  <span className="turn-badge">
                    Playing as{" "}
                    <span>{playerColor === "w" ? "White ♔" : "Black ♚"}</span>
                  </span>
                </div>

                {/* BOARD */}
                <div style={{ position: "relative" }}>
                  <Chessboard
                    options={{
                      onPieceDrop,
                      position: game.fen(),
                      boardOrientation: playerColor === "w" ? "white" : "black",
                    }}
                  />

                  {/* CORRECT OVERLAY */}
                  {status === "correct" && (
                    <div className="result-panel result-correct">
                      <div className="result-icon">♕</div>
                      <div className="result-title">Brilliant!</div>
                      <div className="result-sub">
                        You found the winning combination.
                      </div>
                      <div className="result-actions">
                        <button
                          className="btn-action btn-action-gold"
                          onClick={() => setPuzzleIndex((prev) => prev + 1)}
                        >
                          Next Puzzle →
                        </button>
                        <button className="btn-action" onClick={reset}>
                          Retry
                        </button>
                      </div>
                    </div>
                  )}

                  {/* WRONG OVERLAY */}
                  {status === "wrong" && (
                    <div className="result-panel result-wrong">
                      <div className="result-icon">♟</div>
                      <div className="result-title">Wrong Move</div>
                      <div className="result-sub">
                        Study the position and try again.
                      </div>
                      <div className="result-actions">
                        <button
                          className="btn-action btn-action-gold"
                          onClick={reset}
                        >
                          Try Again
                        </button>
                        <button
                          className="btn-action"
                          onClick={() => setPuzzleIndex((prev) => prev + 1)}
                        >
                          Skip →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PROGRESS */}
                <div className="move-progress">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>
                      {Math.min(moveIndex, totalMoves)} / {totalMoves} moves
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${totalMoves ? (Math.min(moveIndex, totalMoves) / totalMoves) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* ACTION ROW */}
                <div className="action-row">
                  <button className="btn-action" onClick={reset}>
                    ↺ Reset
                  </button>
                  <button
                    className="btn-action"
                    onClick={() => setPuzzleIndex((prev) => prev + 1)}
                  >
                    Skip →
                  </button>
                  <button
                    className="btn-action btn-action-gold"
                    onClick={() => setPuzzleIndex((prev) => prev + 1)}
                  >
                    Next Puzzle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Puzzle;
