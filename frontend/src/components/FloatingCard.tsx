"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  floatIntensity?: number;
}

export const FloatingCard = ({ 
  children, 
  className, 
  floatIntensity = 1 
}: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [0, -10 * floatIntensity, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ 
        scale: 1.02,
        y: -15 * floatIntensity,
        transition: { duration: 0.3 }
      }}
      className={cn(
        "glass-card p-6 rounded-2xl relative overflow-hidden group",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
