import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import puzzlesData from "@/data/puzzle_1900.json";
import NavbarLux from "./NavbarLux";

type Puzzles = {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
};

type Status = "playing" | "wrong" | "correct";

const pushRankThemes = ["skewer", "pin", "fork"];

const PushRank = () => {
  const allThemes = [
    ...new Set(puzzlesData.flatMap((puzzle) => puzzle.themes)),
  ];

  console.log(allThemes);

  const [game, setGame] = useState<Chess>(new Chess());
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [status, setStatus] = useState<Status>("playing");

  const [solvedCount, setSolvedCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [boardVisible, setBoardVisible] = useState(false);

  const pushRankPuzzles = puzzlesData.filter((puzzle) =>
    puzzle.themes.some((theme) => pushRankThemes.includes(theme)),
  );
  const currentPuzzle: Puzzles = pushRankPuzzles[puzzleIndex];

  const getRandomIndex = (length: number) => {
    return Math.floor(Math.random() * length);
  };

  const reset = () => {
    setBoardVisible(false);
    const newGame = new Chess(currentPuzzle.fen);
    setPlayerColor(newGame.turn() === "w" ? "b" : "w");
    setStatus("playing");
    setGame(newGame);
    setMoveIndex(0);
    setTimeout(() => {
      computerMove(newGame, 0);
      setTimeout(() => setBoardVisible(true), 50);
    }, 500);
  };

  useEffect(() => {
    setPuzzleIndex(getRandomIndex(pushRankPuzzles.length));
  }, []);
  useEffect(() => {
    if (currentPuzzle) reset();
  }, [puzzleIndex]);

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs): boolean => {
    if (!sourceSquare || !targetSquare || sourceSquare === targetSquare)
      return false;
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (!move) return false;
    const nextIndex = moveIndex + 1;
    if (currentPuzzle.moves[moveIndex] !== sourceSquare + targetSquare) {
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

  const computerMove = (pos: Chess, index: number) => {
    const move = currentPuzzle.moves[index];
    if (!move) return;
    const newGame = new Chess(pos.fen());
    newGame.move({ from: move.slice(0, 2), to: move.slice(2, 4) });
    setMoveIndex(index + 1);
    setGame(newGame);
  };

  const totalMoves = currentPuzzle?.moves.length ?? 0;
  const playerMoves = Math.ceil(totalMoves / 2);
  const progress = totalMoves
    ? (Math.min(moveIndex, totalMoves) / totalMoves) * 100
    : 0;

  return (
    <>
      <style>{`
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

        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }

        .plx-page {
          position: fixed; inset: 0;
          display: flex; flex-direction: column;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow: hidden;
        }
        .plx-page::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        /* ── BODY ─────────────────────────────────── */
        .plx-body {
          position: relative; z-index: 1;
          flex: 1; min-height: 0;
          display: grid;
          grid-template-columns: 190px 1fr 190px;
        }

        /* ── SIDE PANELS ──────────────────────────── */
        .plx-panel {
          display: flex; flex-direction: column;
          padding: 1rem 1rem;
          gap: 0.65rem;
          border-right: 1px solid var(--border);
          overflow: hidden;
        }
        .plx-panel-r { border-right: none; border-left: 1px solid var(--border); }

        .plx-slabel {
          font-size: 1rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--gold);
          padding-bottom: 0.45rem;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        
        .plx-slabel-glowing {
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);

  padding-bottom: 0.45rem;
  border-bottom: 1px solid var(--border);

  flex-shrink: 0;

  text-shadow:
    0 0 5px rgba(255, 215, 120, 0.45),
    0 0 12px rgba(255, 215, 120, 0.25);

  animation: goldPulse 2.5s ease-in-out infinite;
}

@keyframes goldPulse {
  0%, 100% {
    opacity: 0.85;
    text-shadow:
      0 0 5px rgba(255, 215, 120, 0.35),
      0 0 10px rgba(255, 215, 120, 0.15);
  }

  50% {
    opacity: 1;
    text-shadow:
      0 0 8px rgba(255, 215, 120, 0.7),
      0 0 18px rgba(255, 215, 120, 0.4);
  }
}

        .plx-tbtn {
          width: 100%; display: flex; align-items: center; gap: 0.5rem;
          padding: 0.45rem 0.65rem;
          background: transparent; border: 1px solid var(--border);
          color: var(--muted); font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; cursor: pointer; border-radius: 3px;
          transition: all 0.18s; text-align: left;
        }
        .plx-tbtn:hover { border-color: var(--gold-dim); color: var(--gold-light); background: rgba(201,168,76,0.05); }
        .plx-tbtn.active { border-color: var(--gold); background: rgba(201,168,76,0.1); color: var(--gold-light); }
        .plx-ticon { font-size: 0.9rem; width: 16px; text-align: center; }

        /* ── SESSION STATS (left panel) ──────────── */
        .plx-stats-card {
          border: 1px solid var(--border);
          border-radius: 3px; overflow: hidden;
          background: rgba(17,17,21,0.5);
          flex-shrink: 0;
        }
        .plx-stat-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.38rem 0.65rem;
          border-bottom: 1px solid rgba(201,168,76,0.07);
          font-size: 0.73rem;
        }
        .plx-stat-row:last-child { border-bottom: none; }
        .plx-sl { color: var(--muted); }
        .plx-sv {
          // font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem; font-weight: 700; color: var(--gold-light);
        }
        .plx-sv-green { color: #7ed97e; }
        .plx-sv-red   { color: #e07070; }

        /* ── INFO CARD (right panel) ──────────────── */
        .plx-info-card {
          border: 1px solid var(--border); background: rgba(17,17,21,0.5);
          border-radius: 3px; overflow: hidden; flex-shrink: 0;
        }
        .plx-info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.38rem 0.65rem;
          border-bottom: 1px solid rgba(201,168,76,0.07);
          font-size: 0.73rem;
        }
        .plx-info-row:last-child { border-bottom: none; }
        .plx-il { color: var(--muted); }
        .plx-iv {
          // font-family: 'Cormorant Garamond', serif;
          font-size: 0.92rem; font-weight: 600; color: var(--gold-light);
        }

        .plx-btn {
          width: 100%;
          padding: 0.5rem 0.65rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.76rem; letter-spacing: 0.04em;
          cursor: pointer; border-radius: 3px; transition: all 0.2s;
          border: 1px solid var(--border); background: transparent; color: var(--muted);
          text-align: center;
        }
        .plx-btn:hover { border-color: var(--gold-dim); color: var(--gold-light); background: rgba(201,168,76,0.06); }
        .plx-btn-gold {
          background: linear-gradient(135deg, var(--gold) 0%, #7a540f 100%);
          border-color: transparent; color: #0a0a0c; font-weight: 600;
        }
        .plx-btn-gold:hover {
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(201,168,76,0.22);
        }

        /* ── CENTRE ───────────────────────────────── */
        .plx-center {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 0.75rem 1.25rem;
          gap: 0.65rem; min-height: 0;
        }

        .plx-status {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.73rem; letter-spacing: 0.06em;
          padding: 0.25rem 0.8rem; border-radius: 100px; border: 1px solid;
          transition: all 0.3s; flex-shrink: 0;
        }
        .plx-status-playing { border-color: var(--border); color: var(--muted); }
        .plx-status-correct { border-color: rgba(100,200,100,0.35); color: #7ed97e; background: rgba(100,200,100,0.07); }
        .plx-status-wrong   { border-color: rgba(220,80,80,0.35); color: #e07070; background: rgba(220,80,80,0.07); }
        .plx-sdot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: sdot 2s infinite; }
        @keyframes sdot { 0%,100%{opacity:1} 50%{opacity:0.25} }

        .plx-board-wrap {
          position: relative;
          width: min(calc(100vh - 52px - 110px), calc(100vw - 380px - 2.5rem));
          aspect-ratio: 1;
          flex-shrink: 0;
        }
        .plx-board-wrap > div { width: 100% !important; }

        .plx-overlay {
          position: absolute; inset: 0; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.6rem;
          backdrop-filter: blur(8px); border-radius: 2px;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .plx-ov-correct { background: rgba(10,10,12,0.88); border: 1px solid rgba(100,200,100,0.25); }
        .plx-ov-wrong   { background: rgba(10,10,12,0.88); border: 1px solid rgba(220,80,80,0.25); }
        .plx-ov-icon  { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; }
        .plx-ov-title { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700; }
        .plx-ov-correct .plx-ov-title { color: #7ed97e; }
        .plx-ov-wrong   .plx-ov-title { color: #e07070; }
        .plx-ov-sub { color: var(--muted); font-size: 0.77rem; }
        .plx-ov-btns { display: flex; gap: 0.5rem; margin-top: 0.3rem; }
        .plx-ov-btns .plx-btn { width: auto; padding: 0.45rem 1.1rem; }

        .plx-prog { width: 100%; flex-shrink: 0; }
        .plx-prog-labels {
          display: flex; justify-content: space-between;
          font-size: 0.62rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 0.3rem;
        }
        .plx-prog-track { height: 2px; background: rgba(201,168,76,0.08); border-radius: 2px; overflow: hidden; }
        .plx-prog-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold-dim), var(--gold));
          border-radius: 2px; transition: width 0.4s ease;
        }
        .plx-loading {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; color: var(--gold-light);
          background: rgba(10,10,12,0.92);
          border: 1px solid var(--border);
          z-index: 20;
        }
      `}</style>

      <div className="plx-page">
        <NavbarLux />

        {/* BODY */}
        <div className="plx-body">
          {/* LEFT — theme filter + session stats */}
          <div className="plx-panel">
            <p className="plx-slabel-glowing mb-8">Push Rank</p>

            {/* session */}
            <p className="plx-slabel" style={{ marginTop: "0.4rem" }}>
              Session
            </p>
            <div className="plx-stats-card">
              <div className="plx-stat-row">
                <span className="plx-sl">Puzzle</span>
                <span className="plx-sv">#{puzzleIndex + 1}</span>
              </div>
              <div className="plx-stat-row">
                <span className="plx-sl">Solved</span>
                <span className={`plx-sv plx-sv-green`}>{solvedCount}</span>
              </div>
              <div className="plx-stat-row">
                <span className="plx-sl">Missed</span>
                <span className={`plx-sv plx-sv-red`}>{wrongCount}</span>
              </div>
              <div className="plx-stat-row">
                <span className="plx-sl">Accuracy</span>
                <span className="plx-sv">
                  {solvedCount + wrongCount === 0
                    ? "—"
                    : `${Math.round((solvedCount / (solvedCount + wrongCount)) * 100)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* CENTRE — board */}
          <div className="plx-center">
            <div className={`plx-status plx-status-${status}`}>
              <span className="plx-sdot" />
              {status === "playing" &&
                `Find the best move for${playerColor === "w" ? " WHITE" : " BLACK"}`}
              {status === "correct" && "Brilliant! Well played"}
              {status === "wrong" && "Wrong — study and retry"}
            </div>

            <div className="plx-board-wrap">
              {!boardVisible && <div className="plx-loading">Loading…</div>}
              <div
                style={{
                  opacity: boardVisible ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <Chessboard
                  options={{
                    onPieceDrop,
                    position: game.fen(),
                    boardOrientation: playerColor === "w" ? "white" : "black",
                  }}
                />
              </div>

              {status === "correct" && (
                <div className="plx-overlay plx-ov-correct">
                  <div className="plx-ov-icon">♕</div>
                  <div className="plx-ov-title">Brilliant!</div>
                  <div className="plx-ov-sub">
                    You found the winning combination.
                  </div>
                  <div className="plx-ov-btns">
                    <button
                      className="plx-btn plx-btn-gold"
                      onClick={() =>
                        setPuzzleIndex(getRandomIndex(pushRankPuzzles.length))
                      }
                    >
                      Next →
                    </button>
                    <button className="plx-btn" onClick={reset}>
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {status === "wrong" && (
                <div className="plx-overlay plx-ov-wrong">
                  <div className="plx-ov-icon">♟</div>
                  <div className="plx-ov-title">Wrong Move</div>
                  <div className="plx-ov-sub">
                    Study the position carefully.
                  </div>
                  <div className="plx-ov-btns">
                    <button className="plx-btn plx-btn-gold" onClick={reset}>
                      Try Again
                    </button>
                    <button
                      className="plx-btn"
                      onClick={() => setPuzzleIndex((p) => p + 1)}
                    >
                      Skip →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="plx-prog">
              <div className="plx-prog-labels">
                <span>Progress</span>
                <span>
                  {Math.min(moveIndex, totalMoves)} / {totalMoves} moves
                </span>
              </div>
              <div className="plx-prog-track">
                <div
                  className="plx-prog-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — puzzle info + actions */}
          <div className="plx-panel plx-panel-r">
            <p className="plx-slabel">Puzzle Info</p>
            <div className="plx-info-card">
              <div className="plx-info-row">
                <span className="plx-il">ID</span>
                <span className="plx-iv" style={{ fontSize: "0.72rem" }}>
                  {currentPuzzle?.id ?? "—"}
                </span>
              </div>
              <div className="plx-info-row">
                <span className="plx-il">Rating</span>
                <span className="plx-iv">{currentPuzzle?.rating ?? "—"}</span>
              </div>
              <div className="plx-info-row">
                <span className="plx-il">Your moves</span>
                <span className="plx-iv">{playerMoves}</span>
              </div>
              <div className="plx-info-row">
                <span className="plx-il">You play</span>
                <span className="plx-iv">
                  {playerColor === "w" ? "♔ White" : "♚ Black"}
                </span>
              </div>
            </div>

            <p className="plx-slabel" style={{ marginTop: "0.2rem" }}>
              Actions
            </p>
            <button className="plx-btn" onClick={reset}>
              ↺ Reset
            </button>
            <button
              className="plx-btn"
              onClick={() => setPuzzleIndex((p) => p + 1)}
            >
              Skip →
            </button>
            <button
              className="plx-btn plx-btn-gold"
              onClick={() =>
                setPuzzleIndex(getRandomIndex(pushRankPuzzles.length))
              }
            >
              Next Puzzle
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PushRank;
