import { useCallback, useEffect, useRef } from "react";

export function useStockfish(onBestMove: (move: string) => void) {
  const engineRef = useRef<Worker | null>(null);
  const readyRef = useRef(false);

  // Fix #3: store callback in ref to avoid stale closure
  const onBestMoveRef = useRef(onBestMove);
  useEffect(() => {
    onBestMoveRef.current = onBestMove;
  }, [onBestMove]);

  useEffect(() => {
    const engine = new Worker("/stockfish/stockfish-18-lite-single.js");
    engineRef.current = engine;
    readyRef.current = false;

    engine.onmessage = (e) => {
      const line: string = e.data;

      // Fix #2: wait for readyok before accepting commands
      if (line === "readyok") {
        readyRef.current = true;
        return;
      }

      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        onBestMoveRef.current(move); // Fix #3: use ref, not stale closure
      }
    };

    engine.postMessage("uci");
    engine.postMessage("isready");

    return () => {
      engine.terminate();
      readyRef.current = false;
    };
  }, []); // Fix #1: no dependency on onBestMove — ref handles updates

  // Fix #4: stable function reference with useCallback
  const getBestMove = useCallback((fen: string) => {
    const engine = engineRef.current;
    if (!engine || !readyRef.current) return; // Fix #2: guard until ready
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage("go depth 10");
  }, []);

  return { getBestMove };
}
