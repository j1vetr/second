import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  animateOnScroll?: boolean;
}

export function BlurText({
  text,
  className,
  delay = 0,
  duration = 0.5,
  animateOnScroll = true,
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const words = text.split(" ");

  useEffect(() => {
    if (animateOnScroll) {
      if (isInView && !hasAnimated) {
        controls.start("visible");
        setHasAnimated(true);
      }
    } else {
      controls.start("visible");
    }
  }, [isInView, controls, animateOnScroll, hasAnimated]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn("flex flex-wrap justify-center gap-x-2", className)}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
