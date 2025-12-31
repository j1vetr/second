import { useRef, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  sparkColor?: string;
  sparkCount?: number;
  sparkSize?: number;
  duration?: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export function ClickSpark({
  children,
  className,
  sparkColor = "hsl(var(--primary))",
  sparkCount = 8,
  sparkSize = 10,
  duration = 400,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const createSpark = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement("div");
      const angle = (i / sparkCount) * 360;
      const distance = 30 + Math.random() * 20;
      
      spark.style.cssText = `
        position: absolute;
        left: ${relX}px;
        top: ${relY}px;
        width: ${sparkSize}px;
        height: ${sparkSize}px;
        background: ${sparkColor};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: spark-${angle} ${duration}ms ease-out forwards;
      `;

      const keyframes = `
        @keyframes spark-${angle} {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + ${Math.cos(angle * Math.PI / 180) * distance}px),
              calc(-50% + ${Math.sin(angle * Math.PI / 180) * distance}px)
            ) scale(0);
            opacity: 0;
          }
        }
      `;

      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      container.appendChild(spark);

      setTimeout(() => {
        spark.remove();
        style.remove();
      }, duration);
    }
  }, [sparkColor, sparkCount, sparkSize, duration]);

  const handleClick = (e: React.MouseEvent) => {
    createSpark(e.clientX, e.clientY);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
