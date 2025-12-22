import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rippleColor?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function RippleButton({ 
  children, 
  className,
  rippleColor = "rgba(255, 255, 255, 0.4)",
  onClick,
  ...props 
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const idRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple: Ripple = {
        id: idRef.current++,
        x,
        y,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      {...props}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: rippleColor,
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
          animate={{ 
            width: 300, 
            height: 300, 
            x: -150, 
            y: -150,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      {children}
    </button>
  );
}
