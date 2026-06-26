"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-white/5 border-white/10 text-gray-300",
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-gray-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1
        text-xs font-medium rounded-full
        border backdrop-blur-sm
        ${variantClasses[variant]}
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </motion.span>
  );
}
