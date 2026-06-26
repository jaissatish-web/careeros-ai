"use client";

import { motion } from "framer-motion";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-white/[0.03] backdrop-blur-md
              border border-white/[0.08]
              text-white placeholder-gray-500
              outline-none
              transition-all duration-300
              focus:border-blue-500/40
              focus:bg-white/[0.05]
              focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]
              ${error ? "border-red-500/50 focus:border-red-500/50" : ""}
              ${className}
            `}
            {...rest}
          />
          {/* Focus glow ring */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        </div>
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-400"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
