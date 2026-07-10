"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hover = true,
  delay = 0,
  onClick,
}: CardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.06]
        p-6
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      whileHover={
        hover
          ? {
              y: -4,
              borderColor: "rgba(255,255,255,0.12)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 80px rgba(212,175,55,0.05)",
            }
          : undefined
      }
      onClick={onClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.02] to-[#00F0FF]/[0.02] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
