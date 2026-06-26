"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import {
  Sparkles,
  FileText,
  Zap,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Palette,
  Target,
  BarChart3,
  Layout,
  Wand2,
  Download,
  Eye,
  Search,
  Lightbulb,
  ChevronRight,
  Star,
  Grip,
  Brain,
  FileDown,
  Workflow,
  Sparkle,
  TrendingUp,
  Award,
  MousePointerClick,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

/* ==========================================================================
   Animated Counter Hook
   ========================================================================== */
function useCounter(target: number, duration: number = 2, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const started = startOnView ? isInView : true;

  useEffect(() => {
    if (!started) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut" as const,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return controls.stop;
  }, [started, target, duration]);

  return { count, ref };
}

/* ==========================================================================
   Circular Score Gauge Component
   ========================================================================== */
function ScoreGauge() {
  const score = useCounter(87, 2.5);
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (isInView) {
      animate(0, 87, {
        duration: 2.5,
        ease: "easeOut" as const,
        onUpdate: (v) => setProgress(Math.round(v)),
      });
    }
  }, [isInView]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-2xl animate-pulse-glow" />

      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 relative z-10"
      >
        {/* Background track */}
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Subtle inner track */}
        <circle
          stroke="rgba(255,255,255,0.02)"
          fill="transparent"
          strokeWidth={stroke + 4}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated progress arc */}
        <motion.circle
          stroke="url(#scoreGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.div
          className="text-6xl font-bold font-heading"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" as const }}
        >
          <span className="text-gradient">{progress}</span>
          <span className="text-gray-500 text-3xl">/100</span>
        </motion.div>
        <motion.p
          className="text-sm text-gray-400 mt-1 font-medium"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          Resume Score
        </motion.p>
        <motion.div
          className="flex items-center gap-1 mt-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Top 13%</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Score Breakdown Bars
   ========================================================================== */
const scoreBreakdown = [
  { label: "Content", value: 92, icon: FileText },
  { label: "Formatting", value: 85, icon: Palette },
  { label: "Keywords", value: 78, icon: Search },
  { label: "Impact", value: 91, icon: Target },
];

function ScoreBreakdown() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimated(true), 300);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="space-y-5">
      {scoreBreakdown.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <item.icon className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-300">{item.label}</span>
            </div>
            <span className="text-sm font-bold text-white">{item.value}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 relative"
              initial={{ width: 0 }}
              animate={animated ? { width: `${item.value}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" as const }}
            >
              <div className="absolute inset-0 shimmer opacity-30" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ==========================================================================
   Template Preview Cards
   ========================================================================== */
const templates = [
  {
    name: "Modern",
    description: "Clean layout with bold headers and accent colors",
    accentColor: "from-blue-500 to-cyan-400",
    badge: "Popular",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    preview: (
      <div className="w-full h-full bg-gray-900 rounded-lg p-3 flex flex-col gap-2">
        <div className="h-2 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        <div className="h-1.5 w-24 rounded-full bg-gray-700" />
        <div className="mt-2 space-y-1">
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-4/5 rounded-full bg-gray-800" />
          <div className="h-1 w-3/5 rounded-full bg-gray-800" />
        </div>
        <div className="mt-2 h-1.5 w-14 rounded-full bg-gray-700" />
        <div className="space-y-1">
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-3/4 rounded-full bg-gray-800" />
        </div>
      </div>
    ),
  },
  {
    name: "Classic",
    description: "Traditional format trusted by recruiters worldwide",
    accentColor: "from-gray-400 to-gray-600",
    badge: "Trusted",
    badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    preview: (
      <div className="w-full h-full bg-gray-900 rounded-lg p-3 flex flex-col items-center gap-2">
        <div className="h-2.5 w-20 rounded-full bg-gray-500" />
        <div className="h-px w-full bg-gray-700 my-1" />
        <div className="w-full space-y-1">
          <div className="h-1 w-2/3 rounded-full bg-gray-700 mx-auto" />
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-5/6 rounded-full bg-gray-800" />
        </div>
        <div className="h-px w-full bg-gray-700 my-1" />
        <div className="h-1 w-20 rounded-full bg-gray-700 mx-auto" />
        <div className="space-y-1 w-full">
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-4/5 rounded-full bg-gray-800" />
        </div>
      </div>
    ),
  },
  {
    name: "Creative",
    description: "Stand out with unique layouts and visual flair",
    accentColor: "from-purple-500 to-pink-500",
    badge: "ATS Safe",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    preview: (
      <div className="w-full h-full bg-gray-900 rounded-lg p-3 flex gap-3">
        <div className="w-1/4 h-full bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-md flex flex-col items-center gap-2 p-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <div className="h-0.5 w-full rounded-full bg-gray-700" />
          <div className="h-0.5 w-4/5 rounded-full bg-gray-700" />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-2.5 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="h-1 w-20 rounded-full bg-gray-700" />
          <div className="space-y-1 mt-1">
            <div className="h-0.5 w-full rounded-full bg-gray-800" />
            <div className="h-0.5 w-4/5 rounded-full bg-gray-800" />
          </div>
          <div className="space-y-1">
            <div className="h-0.5 w-full rounded-full bg-gray-800" />
            <div className="h-0.5 w-3/5 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Minimal",
    description: "Maximum impact with clean, essential design",
    accentColor: "from-emerald-500 to-teal-400",
    badge: "Minimal",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    preview: (
      <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="h-2 w-20 rounded-full bg-gray-600" />
        </div>
        <div className="h-px w-full bg-gray-800" />
        <div className="space-y-1.5">
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-5/6 rounded-full bg-gray-800" />
          <div className="h-1 w-2/3 rounded-full bg-gray-800" />
        </div>
        <div className="h-px w-full bg-gray-800" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-full rounded-full bg-gray-800" />
          <div className="h-1 w-3/4 rounded-full bg-gray-800" />
          <div className="h-1 w-4/5 rounded-full bg-gray-800" />
        </div>
      </div>
    ),
  },
];

function TemplateCard({ template, index }: { template: typeof templates[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]">
        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${template.badgeColor}`}>
            {template.badge}
          </span>
        </div>

        {/* Preview area */}
        <div className="relative h-52 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 overflow-hidden">
          {/* Gradient orb on hover */}
          <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${template.accentColor} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

          <motion.div
            className="relative z-10"
            animate={{ y: hovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {template.preview}
          </motion.div>

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Button variant="primary" size="sm">
                    Use Template
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-5 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${template.accentColor}`} />
            <h3 className="text-base font-semibold text-white font-heading">{template.name}</h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   AI Suggestions Panel
   ========================================================================== */
const aiSuggestions = [
  {
    type: "Critical",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: Target,
    text: "Add quantifiable metrics to your experience bullets (e.g., 'Increased revenue by 34%')",
  },
  {
    type: "Suggestion",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: Zap,
    text: "Include more action verbs like 'Spearheaded', 'Orchestrated', 'Accelerated'",
  },
  {
    type: "Improvement",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: TrendingUp,
    text: "Your skills section is missing 4 keywords found in the target job description",
  },
  {
    type: "Tip",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: Lightbulb,
    text: "Add a 3-sentence professional summary at the top to increase ATS match by 15%",
  },
  {
    type: "Strength",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: Award,
    text: "Great use of consistent date formatting and section headers throughout",
  },
];

function AISuggestionsPanel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8"
    >
      {/* Animated border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">AI Suggestions</h3>
            <p className="text-sm text-gray-500">Powered by GPT-4 analysis</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-medium">Live</span>
          </div>
        </div>

        {/* Suggestions list */}
        <div className="space-y-3">
          {aiSuggestions.map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${suggestion.bg}/50 hover:${suggestion.bg} ${suggestion.border}`}
            >
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${suggestion.bg} border ${suggestion.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <suggestion.icon className={`w-4.5 h-4.5 ${suggestion.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${suggestion.color}`}>
                    {suggestion.type}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{suggestion.text}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>

        {/* Apply all button */}
        <motion.div
          className="mt-6 pt-6 border-t border-white/[0.04]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <Button variant="primary" size="md" className="w-full">
            <Sparkles className="w-4 h-4" />
            Apply All Suggestions
            <span className="ml-1 text-xs opacity-70">(4 pending)</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   Feature Card
   ========================================================================== */
const features = [
  {
    icon: Grip,
    title: "Drag & Drop Editor",
    description: "Intuitively rearrange sections with a beautiful drag-and-drop interface that just works.",
    color: "blue",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Beat applicant tracking systems with keyword-optimized, perfectly formatted resumes.",
    color: "purple",
  },
  {
    icon: Brain,
    title: "AI Content Suggestions",
    description: "Get intelligent recommendations to strengthen every bullet point and section.",
    color: "cyan",
  },
  {
    icon: FileDown,
    title: "Multiple Formats",
    description: "Export to PDF, Word, TXT, or share with a single click. Your resume, your choice.",
    color: "emerald",
  },
  {
    icon: Eye,
    title: "Real-time Preview",
    description: "See changes instantly as you edit with our live preview that updates in real time.",
    color: "amber",
  },
  {
    icon: Search,
    title: "Keyword Analysis",
    description: "Match your resume against job descriptions to maximize your interview callbacks.",
    color: "pink",
  },
];

const colorMap: Record<string, { bg: string; icon: string; glow: string; border: string }> = {
  blue: { bg: "bg-blue-500/10", icon: "text-blue-400", glow: "group-hover:shadow-blue-500/10", border: "hover:border-blue-500/20" },
  purple: { bg: "bg-purple-500/10", icon: "text-purple-400", glow: "group-hover:shadow-purple-500/10", border: "hover:border-purple-500/20" },
  cyan: { bg: "bg-cyan-500/10", icon: "text-cyan-400", glow: "group-hover:shadow-cyan-500/10", border: "hover:border-cyan-500/20" },
  emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400", glow: "group-hover:shadow-emerald-500/10", border: "hover:border-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", icon: "text-amber-400", glow: "group-hover:shadow-amber-500/10", border: "hover:border-amber-500/20" },
  pink: { bg: "bg-pink-500/10", icon: "text-pink-400", glow: "group-hover:shadow-pink-500/10", border: "hover:border-pink-500/20" },
};

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const colors = colorMap[feature.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={`group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-6 transition-all duration-300 ${colors.border} hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${colors.glow}`}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className={`w-6 h-6 ${colors.icon}`} />
      </div>

      <h3 className="text-base font-bold text-white font-heading mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

/* ==========================================================================
   How It Works Steps
   ========================================================================== */
const steps = [
  {
    number: "01",
    title: "Paste Your Resume",
    description: "Upload your existing resume or paste your content. We'll parse everything automatically.",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "AI Analyses & Optimizes",
    description: "Our AI evaluates your resume for ATS compatibility, content quality, and impact — then applies fixes.",
    icon: Workflow,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Download Perfect Resume",
    description: "Get your polished, ATS-ready resume in PDF, Word, or share it online with a single click.",
    icon: Download,
    color: "from-emerald-500 to-teal-500",
  },
];

function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="relative">
      {/* Connecting line */}
      <div className="hidden lg:block absolute top-24 left-[20%] right-[20%] h-px">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
            className="relative flex flex-col items-center text-center"
          >
            {/* Step number circle */}
            <div className="relative mb-6">
              <motion.div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative z-10`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring" as const, stiffness: 300 }}
              >
                <step.icon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-950 border-2 border-white/10 flex items-center justify-center z-20">
                <span className="text-[10px] font-bold text-white">{step.number}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white font-heading mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */
export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden relative noise-overlay">
      {/* ============ GLOBAL GRADIENT ORBS ============ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Hero orbs */}
        <div
          className="gradient-orb gradient-orb-blue w-[600px] h-[600px] -top-48 -right-48 opacity-30 animate-orb-float-1"
          style={{ animationName: "orb-float-1", animationDuration: "8s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}
        />
        <div
          className="gradient-orb gradient-orb-purple w-[500px] h-[500px] top-1/4 -left-48 opacity-25 animate-orb-float-2"
          style={{ animationName: "orb-float-2", animationDuration: "12s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}
        />
        {/* Mid page orb */}
        <div
          className="gradient-orb gradient-orb-cyan w-[400px] h-[400px] top-1/2 right-0 opacity-20 animate-orb-float-3"
          style={{ animationName: "orb-float-3", animationDuration: "10s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}
        />
        {/* Bottom orb */}
        <div
          className="gradient-orb gradient-orb-blue w-[350px] h-[350px] bottom-1/4 -left-24 opacity-20 animate-orb-float-1"
          style={{ animationName: "orb-float-1", animationDuration: "9s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: "2s" }}
        />
        {/* CTA section orb */}
        <div
          className="gradient-orb gradient-orb-purple w-[500px] h-[500px] -bottom-48 right-1/4 opacity-25 animate-orb-float-2"
          style={{ animationName: "orb-float-2", animationDuration: "14s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: "3s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-content">
        <Navbar />

        {/* ================================================================
            SECTION 1: HERO
            ================================================================ */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl mb-8"
              >
                <Sparkle className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">
                  Powered by <span className="text-blue-400 font-semibold">GPT-4</span> & Advanced NLP
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Build{" "}
                <span className="text-gradient-animated">
                  ATS-Perfect
                </span>
                <br />
                Resumes in{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">Minutes</span>
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <motion.path
                      d="M2 8 C50 2, 150 2, 198 8"
                      stroke="url(#underlineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                    <defs>
                      <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Our AI analyzes your resume in real-time, suggests powerful improvements,
                and formats everything to pass Applicant Tracking Systems — so you land more interviews.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button variant="primary" size="lg">
                  <Sparkles className="w-5 h-5" />
                  Build Your Resume Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Eye className="w-5 h-5" />
                  See Examples
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {["No credit card required", "Free forever plan", "Cancel anytime"].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: LIVE RESUME SCORE + SUGGESTIONS
            ================================================================ */}
        <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Live Analysis</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
                Your Resume <span className="text-gradient">Score</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Get instant feedback on your resume with our AI-powered scoring engine.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Score Gauge */}
              <div className="flex flex-col items-center">
                <ScoreGauge />
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Excellent — Ready to send</p>
                </motion.div>
              </div>

              {/* Breakdown */}
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white font-heading mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Score Breakdown
                </h3>
                <ScoreBreakdown />
              </div>

              {/* AI Suggestions */}
              <AISuggestionsPanel />
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: RESUME TEMPLATES
            ================================================================ */}
        <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Templates</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
                Choose Your <span className="text-gradient">Style</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Professional, ATS-optimized templates designed for every industry. One click to get started.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template, i) => (
                <TemplateCard key={template.name} template={template} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: FEATURES GRID
            ================================================================ */}
        <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Features</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
                Everything You Need to{" "}
                <span className="text-gradient">Get Hired</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                A complete AI toolkit that transforms your resume from ordinary to interview-winning.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} feature={feature} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: HOW IT WORKS
            ================================================================ */}
        <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">How It Works</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mt-3 mb-4">
                Three Simple <span className="text-gradient">Steps</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                From raw resume to interview-ready in under 60 seconds.
              </p>
            </motion.div>

            <HowItWorks />
          </div>
        </section>

        {/* ================================================================
            SECTION 6: FINAL CTA
            ================================================================ */}
        <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
              <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-xl" />

              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />

              {/* Glow lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              {/* Background orbs */}
              <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <MousePointerClick className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Join 500,000+ professionals</span>
                </motion.div>

                <motion.h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Ready to Build Your{" "}
                  <span className="text-gradient-animated">Dream Resume?</span>
                </motion.h2>

                <motion.p
                  className="text-lg text-gray-400 max-w-xl mx-auto mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Stop guessing. Start succeeding. Let AI craft the perfect resume
                  that gets you past ATS filters and into interviews.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Button variant="primary" size="lg">
                    <Sparkles className="w-5 h-5" />
                    Get Started — It&apos;s Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button variant="secondary" size="lg">
                    <FileText className="w-5 h-5" />
                    View Sample Resume
                  </Button>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-14 pt-10 border-t border-white/[0.04]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    { value: "500K+", label: "Resumes Built" },
                    { value: "94%", label: "Interview Rate" },
                    { value: "4.9★", label: "User Rating" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white font-heading">{stat.value}</div>
                      <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================================================================
            FOOTER
            ================================================================ */}
        <Footer />
      </div>
    </div>
  );
}
