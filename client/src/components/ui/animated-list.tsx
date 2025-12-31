import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animation?: "fade" | "slide" | "scale" | "blur";
}

export function AnimatedList({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  animation = "fade",
}: AnimatedListProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const getItemVariants = (): Variants => {
    switch (animation) {
      case "slide":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(10px)" },
          visible: { 
            opacity: 1, 
            filter: "blur(0px)",
            transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration: 0.4,
            },
          },
        };
    }
  };

  const itemVariants = getItemVariants();

  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
