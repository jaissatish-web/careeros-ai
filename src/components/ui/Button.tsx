"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#D4AF37] to-[#B8941E] text-[#07070E] font-bold shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:shadow-xl",
  secondary:
    "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-[#00F0FF]/30",
  ghost:
    "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
  outline:
    "bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center font-semibold
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-inherit bg-gradient-to-r from-[#D4AF37] to-[#B8941E] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
