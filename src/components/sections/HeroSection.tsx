"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Users, Zap } from "lucide-react";
import Button from "../ui/Button";

function FloatingParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const duration = 4 + (Math.sin(x * 0.1) * 0.5 + 0.5) * 2; // deterministic 4-6s based on position
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-[#D4AF37]/30"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut" as const,
      }}
    />
  );
}

function GradientOrb({
  className,
  color,
  delay,
}: {
  className: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${color} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut" as const,
      }}
    />
  );
}

function DashboardMockup() {
  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-blue-500/5">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <div className="flex-1 mx-4">
            <div className="w-48 h-5 rounded-md bg-white/[0.04] mx-auto" />
          </div>
        </div>
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Score bar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center text-white font-bold text-sm">
              94
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#00F0FF]"
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" as const }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Resume Score: 94/100</p>
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Keywords", value: "23/25" },
              { label: "ATS Match", value: "98%" },
              { label: "Impact", value: "High" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
              >
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          {/* Suggestion cards */}
          <div className="space-y-2">
            {[
              "Add quantifiable achievements to your experience",
              "Include more industry-specific keywords",
            ].map((tip, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 p-3 rounded-lg bg-[#D4AF37]/[0.05] border border-blue-500/10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + i * 0.2 }}
              >
                <Zap className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs text-gray-400">{tip}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Glow behind mockup */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
}

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const fullText =
    "Build resumes, optimize LinkedIn profiles, track applications, and ace interviews — all powered by AI.";

  // Seeded pseudo-random for deterministic SSR
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 3 + 1) * 100,
        y: seededRandom(i * 3 + 2) * 100,
        delay: seededRandom(i * 3 + 3) * 4,
      })),
    []
  );

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background gradient orbs */}
      <GradientOrb
        className="w-[600px] h-[600px] -top-40 -left-40"
        color="bg-[#D4AF37]"
        delay={0}
      />
      <GradientOrb
        className="w-[500px] h-[500px] top-1/3 -right-32"
        color="bg-[#00F0FF]"
        delay={2}
      />
      <GradientOrb
        className="w-[400px] h-[400px] -bottom-20 left-1/3"
        color="bg-[#D4AF37]"
        delay={4}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles - client only to avoid hydration mismatch */}
      {mounted && particles.map((p) => (
        <FloatingParticle key={p.id} x={p.x} y={p.y} delay={p.delay} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="px-3 py-1 text-xs font-medium text-[#F6E27A] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full backdrop-blur-sm">
                ✨ Now with GPT-4o Integration
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-white">Your Career.</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F6E27A] to-[#00F0FF] bg-clip-text text-transparent">
                Supercharged by AI.
              </span>
            </motion.h1>

            {/* Typing subtext */}
            <motion.p
              className="mt-6 text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 h-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {typedText}
              <span className="inline-block w-0.5 h-5 bg-blue-400 ml-0.5 animate-pulse" />
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button variant="primary" size="lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["bg-[#D4AF37]", "bg-purple-500", "bg-emerald-500", "bg-amber-500"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${color} border-2 border-black flex items-center justify-center text-[10px] font-bold text-white`}
                      >
                        {["JD", "AK", "MR", "SL"][i]}
                      </div>
                    )
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">500K+ users</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm text-gray-400">
                  <span className="text-white font-semibold">4.9/5</span> from 10K+ reviews
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Dashboard Mockup */}
          <DashboardMockup />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
