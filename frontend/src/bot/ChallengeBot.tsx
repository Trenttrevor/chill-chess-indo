import { useCallback, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { useStockfish } from "./useStockfish";

const ChallengeBot = () => {
  const chessRef = useRef<Chess>(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());

  // Fix #1: wrap in useCallback so the reference is stable across renders
  const handleBestMove = useCallback((move: string) => {
    const game = chessRef.current;
    if (!move) return;

    const engineMove = game.move({
      from: move.slice(0, 2),
      to: move.slice(2, 4),
      promotion: "q",
    });

    if (!engineMove) return;
    setFen(game.fen());
  }, []); // chessRef is a ref, safe to omit from deps

  const { getBestMove } = useStockfish(handleBestMove);

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
      setFen(game.fen());

      setTimeout(() => {
        getBestMove(game.fen());
      }, 300);

      return true;
    },
    [getBestMove],
  );

  return (
    <div className="w-[400px] bg-slate-900 m-[40px]">
      <Chessboard
        options={{
          position: fen,
          onPieceDrop: playerMove,
        }}
      />
    </div>
  );
};

export default ChallengeBot;
