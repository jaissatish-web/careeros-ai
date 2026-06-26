import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* -------------------------------------------------------------
         Color System
         ------------------------------------------------------------- */
      colors: {
        // Deep space blacks
        "space-black": {
          950: "#030712",
          900: "#0a0f1e",
          800: "#111827",
        },
        // Electric blue
        "electric-blue": {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
        // Purple
        purple: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        // Cyan accents
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        // Glass
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          strong: "rgba(255, 255, 255, 0.1)",
          border: "rgba(255, 255, 255, 0.1)",
          "border-strong": "rgba(255, 255, 255, 0.2)",
        },
      },

      /* -------------------------------------------------------------
         Fonts
         ------------------------------------------------------------- */
      fontFamily: {
        heading: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      /* -------------------------------------------------------------
         Background Images (Gradients)
         ------------------------------------------------------------- */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
        "gradient-brand-animated": "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
        "gradient-dark": "linear-gradient(180deg, #030712 0%, #0a0f1e 50%, #111827 100%)",
      },

      /* -------------------------------------------------------------
         Box Shadows (Glow Effects)
         ------------------------------------------------------------- */
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)",
        "glow-brand": "0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
      },

      /* -------------------------------------------------------------
         Backdrop Blur (Glassmorphism)
         ------------------------------------------------------------- */
      backdropBlur: {
        glass: "16px",
        "glass-strong": "24px",
      },

      /* -------------------------------------------------------------
         Animations
         ------------------------------------------------------------- */
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
        "orbit": "orbit 20s linear infinite",
        "typing-blink": "typing-blink 1s step-end infinite",
        "fade-in-scale": "fade-in-scale 0.5s ease-out forwards",
        "gradient-text-flow": "gradient-text-flow 6s ease infinite",
        "orb-float-1": "orb-float-1 8s ease-in-out infinite",
        "orb-float-2": "orb-float-2 12s ease-in-out infinite",
        "orb-float-3": "orb-float-3 10s ease-in-out infinite",
        "border-glow-rotate": "border-glow-rotate 4s linear infinite",
        "particle-drift": "particle-drift 15s linear infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "scroll-reveal": "scroll-reveal 0.8s ease-out forwards",
      },

      /* -------------------------------------------------------------
         Keyframes
         ------------------------------------------------------------- */
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)",
          },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        "typing-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "scroll-reveal": {
          from: { opacity: "0", transform: "translateY(60px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "gradient-text-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "orb-float-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -40px) scale(1.05)" },
          "50%": { transform: "translate(-20px, -60px) scale(0.95)" },
          "75%": { transform: "translate(-40px, -20px) scale(1.02)" },
        },
        "orb-float-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-50px, 30px) scale(1.08)" },
          "66%": { transform: "translate(40px, -50px) scale(0.92)" },
        },
        "orb-float-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "20%": { transform: "translate(20px, 30px) scale(1.03)" },
          "40%": { transform: "translate(-30px, 50px) scale(0.97)" },
          "60%": { transform: "translate(-50px, -20px) scale(1.06)" },
          "80%": { transform: "translate(30px, -40px) scale(0.94)" },
        },
        "border-glow-rotate": {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
        "particle-drift": {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": {
            transform: "translate(var(--drift-x, 100px), var(--drift-y, -200px)) rotate(360deg)",
            opacity: "0",
          },
        },
      },

      /* -------------------------------------------------------------
         Transition Timing Functions
         ------------------------------------------------------------- */
      transitionTimingFunction: {
        "glass": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      /* -------------------------------------------------------------
         Z-Index Scale
         ------------------------------------------------------------- */
      zIndex: {
        "orb": "-1",
        "content": "1",
        "glass": "10",
        "overlay": "50",
        "modal": "100",
        "toast": "200",
      },
    },
  },
  plugins: [],
};

export default config;
