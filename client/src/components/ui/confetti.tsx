import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  scale: number;
}

const colors = [
  "#f97316", // orange-500
  "#ea580c", // orange-600
  "#fb923c", // orange-400
  "#fdba74", // orange-300
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
];

export function Confetti({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3"
              style={{
                left: `${piece.x}%`,
                top: -20,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
              initial={{ 
                y: -20, 
                rotate: 0,
                opacity: 1,
                scale: piece.scale,
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
