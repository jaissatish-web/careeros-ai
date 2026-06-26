"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Mic,
  MicOff,
  Play,
  SkipForward,
  BarChart3,
  Brain,
  MessageSquare,
  Code,
  PieChart,
  Users,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

/* ─── data ─── */
const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What is your greatest professional achievement?",
  "Describe a challenging situation you faced at work and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Why do you want to work at our company?",
  "What is your biggest weakness?",
  "Tell me about a time you showed leadership.",
  "How do you handle tight deadlines and pressure?",
];

const INTERVIEW_TYPES = [
  { name: "Behavioral", icon: Users, desc: "STAR method, situational questions", color: "from-blue-500 to-cyan-500", questions: 45 },
  { name: "Technical", icon: Code, desc: "Coding, system design, algorithms", color: "from-purple-500 to-pink-500", questions: 60 },
  { name: "Case Study", icon: PieChart, desc: "Business cases, problem-solving", color: "from-amber-500 to-orange-500", questions: 30 },
  { name: "System Design", icon: Brain, desc: "Architecture, scalability, trade-offs", color: "from-emerald-500 to-teal-500", questions: 25 },
  { name: "Culture Fit", icon: Star, desc: "Values, teamwork, communication", color: "from-rose-500 to-pink-500", questions: 35 },
];

const QUESTION_BANK = [
  { category: "Leadership", questions: ["Tell me about a time you led a team through a difficult project.", "How do you motivate team members who are underperforming?", "Describe a situation where you had to make an unpopular decision.", "How do you delegate tasks effectively?"], difficulty: "Medium" },
  { category: "Problem Solving", questions: ["Describe the most complex problem you've solved.", "How do you approach a problem you've never encountered?", "Tell me about a time you had to think on your feet.", "How do you prioritize when everything is urgent?"], difficulty: "Hard" },
  { category: "Communication", questions: ["Tell me about a time you had to explain something complex.", "How do you handle disagreements with colleagues?", "Describe a presentation you're proud of.", "How do you give constructive feedback?"], difficulty: "Easy" },
  { category: "Technical", questions: ["Explain a technical concept to a non-technical person.", "Describe your approach to debugging a complex issue.", "How do you stay current with technology trends?", "Tell me about a technical decision you regret."], difficulty: "Hard" },
];

const PROGRESS_DATA = [62, 68, 71, 75, 78, 82, 84, 86];
const FEATURES = [
  { icon: Mic, title: "Real-time Feedback", desc: "Get instant AI feedback on your answers as you speak, with suggestions for improvement." },
  { icon: BarChart3, title: "Voice Analysis", desc: "AI analyzes your tone, pace, confidence, and clarity to improve delivery." },
  { icon: Target, title: "Industry-Specific Questions", desc: "Practice with questions tailored to your target role and industry." },
  { icon: MessageSquare, title: "STAR Method Coach", desc: "Learn and practice the STAR method with guided examples and feedback." },
  { icon: TrendingUp, title: "Confidence Scoring", desc: "Track your confidence level over time with detailed analytics." },
  { icon: Brain, title: "Progress Analytics", desc: "Comprehensive dashboards showing your improvement across all areas." },
];

/* ─── animated counter ─── */
function AnimatedCounter({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, target, { duration });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, target, duration, rounded]);
  return <span>{display}</span>;
}

/* ─── radial progress ─── */
function RadialProgress({ value, size = 100, label, color = "#3b82f6" }: { value: number; size?: number; label: string; color?: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const [inView, setInView] = useState(false);
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.3 });
      observer.observe(node);
    }
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference * (1 - value / 100) } : {}}
          transition={{ duration: 1.5, ease: "easeOut" as const }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xl font-bold font-heading text-white">{value}%</span>
      </div>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  );
}

/* ─── waveform bars ─── */
function WaveformBars({ active }: { active: boolean }) {
  // Pre-compute deterministic random heights for each bar
  const bars = useMemo(
    () => Array.from({ length: 48 }, (_, i) => ({
      height: 4 + ((Math.sin(i * 1.7) * 0.5 + 0.5) * 40),
      duration: 0.4 + ((Math.sin(i * 2.3) * 0.5 + 0.5) * 0.3),
    })),
    []
  );

  return (
    <div className="flex items-end gap-[2px] h-12">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-blue-500 to-purple-500"
          animate={active ? { height: [4, bar.height, 4] } : { height: 4 }}
          transition={active ? { duration: bar.duration, repeat: Infinity, repeatType: "reverse" as const, delay: i * 0.02 } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* ─── line chart ─── */
function ProgressChart() {
  const data = PROGRESS_DATA;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const w = 600;
  const h = 200;
  const pad = 30;
  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2),
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} y1={h - pad - f * (h - pad * 2)} x2={w - pad} y2={h - pad - f * (h - pad * 2)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {/* area fill */}
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
      </defs>
      <motion.path d={areaD} fill="url(#chartGrad)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} />
      {/* line */}
      <motion.path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut" as const }} viewport={{ once: true }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </motion.path>
      {/* dots */}
      {points.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={5} fill="#3b82f6" stroke="#030712" strokeWidth={2} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.15, duration: 0.4 }} viewport={{ once: true }} />
      ))}
      {/* labels */}
      {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map((label, i) => (
        <text key={i} x={points[i].x} y={h - 5} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={11}>{label}</text>
      ))}
    </svg>
  );
}

/* ─── main page ─── */
export default function InterviewCoachPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* gradient orbs */}
      <div className="gradient-orb gradient-orb-blue w-[600px] h-[600px] -top-40 -left-40 animate-[orb-float-1_8s_ease-in-out_infinite] opacity-30" aria-hidden="true" />
      <div className="gradient-orb gradient-orb-purple w-[500px] h-[500px] top-1/3 -right-40 animate-[orb-float-2_12s_ease-in-out_infinite] opacity-25" aria-hidden="true" />
      <div className="gradient-orb gradient-orb-cyan w-[400px] h-[400px] bottom-20 left-1/4 animate-[orb-float-3_10s_ease-in-out_infinite] opacity-20" aria-hidden="true" />

      <div className="relative z-[1]">
        <Navbar />

        <main>
          {/* ─── Hero ─── */}
          <section className="relative pt-32 pb-20 px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-blue-400 mb-6">
                <Mic className="w-4 h-4" /> AI-Powered Interview Practice
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
                Ace Every Interview with{" "}
                <span className="text-gradient-animated">AI Coaching</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Practice with realistic mock interviews, get real-time feedback on your answers, and build confidence before the real thing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  <Play className="w-5 h-5" /> Start Free Interview
                </Button>
                <Button variant="secondary" size="lg">
                  View Demo <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </section>

          {/* ─── Mock Interview Demo ─── */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                Practice Makes <span className="text-gradient">Perfect</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                Experience a live mock interview with our AI coach
              </motion.p>

              <motion.div
                className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                {/* AI Avatar */}
                <div className="flex flex-col items-center mb-8">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center mb-4"
                    animate={{ boxShadow: isRecording
                      ? ["0 0 20px rgba(59,130,246,0.4)", "0 0 40px rgba(139,92,246,0.6)", "0 0 20px rgba(59,130,246,0.4)"]
                      : "0 0 20px rgba(59,130,246,0.2)" }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  <span className="text-sm text-gray-400">AI Interview Coach</span>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="text-center mb-8"
                  >
                    <p className="text-xl md:text-2xl font-heading text-white leading-relaxed">
                      &ldquo;{INTERVIEW_QUESTIONS[currentQ]}&rdquo;
                    </p>
                    <span className="text-xs text-gray-500 mt-3 block">Question {currentQ + 1} of {INTERVIEW_QUESTIONS.length}</span>
                  </motion.div>
                </AnimatePresence>

                {/* Waveform */}
                <div className="flex justify-center mb-6">
                  <WaveformBars active={isRecording} />
                </div>

                {/* Timer */}
                <div className="text-center mb-6">
                  <span className="text-3xl font-mono font-bold text-white">{formatTime(timer)}</span>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsRecording(!isRecording); if (!isRecording) setShowFeedback(false); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      isRecording
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </motion.button>

                  <Button
                    variant="secondary"
                    onClick={() => { setCurrentQ((q) => (q + 1) % INTERVIEW_QUESTIONS.length); setIsRecording(false); setTimer(0); setShowFeedback(false); }}
                  >
                    <SkipForward className="w-4 h-4" /> Next Question
                  </Button>

                  {isRecording && (
                    <Button variant="outline" onClick={() => setShowFeedback(true)}>
                      <BarChart3 className="w-4 h-4" /> Get Feedback
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ─── Feedback Report ─── */}
          <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                Detailed <span className="text-gradient">Feedback Reports</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                Get comprehensive scoring across every dimension of your interview performance
              </motion.p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Score circles */}
                <motion.div
                  className="glass-card rounded-2xl p-8"
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                >
                  <h3 className="text-lg font-heading font-semibold mb-6 text-center">Score Breakdown</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: 85, label: "Content", color: "#3b82f6" },
                      { value: 78, label: "Delivery", color: "#8b5cf6" },
                      { value: 92, label: "Confidence", color: "#06b6d4" },
                      { value: 88, label: "Relevance", color: "#10b981" },
                    ].map((item) => (
                      <div key={item.label} className="relative flex justify-center">
                        <RadialProgress value={item.value} size={110} label={item.label} color={item.color} />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Overall score */}
                <motion.div
                  className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                >
                  <h3 className="text-lg font-heading font-semibold mb-6">Overall Score</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg width="160" height="160" className="-rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                      <motion.circle
                        cx="80" cy="80" r="70" fill="none" stroke="url(#overallGrad)" strokeWidth="10"
                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 70}
                        initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                        whileInView={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - 86 / 100) }}
                        transition={{ duration: 2, ease: "easeOut" as const }} viewport={{ once: true }}
                      />
                      <defs>
                        <linearGradient id="overallGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-bold font-heading text-white"><AnimatedCounter target={86} /></span>
                      <span className="text-sm text-gray-400">out of 100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Grade: A-</span>
                  </div>
                  <div className="mt-6 w-full space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300">Strong use of specific examples and metrics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300">Clear, confident delivery with good pace</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300">Could add more quantifiable results</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── Interview Types ─── */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                Practice <span className="text-gradient">Every Interview Type</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                From behavioral to system design, we&apos;ve got you covered
              </motion.p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {INTERVIEW_TYPES.map((type, i) => (
                  <motion.div
                    key={type.name}
                    className="glass-card rounded-2xl p-6 group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{type.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{type.questions} questions</span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Question Bank ─── */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                150+ <span className="text-gradient">Curated Questions</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                Organized by category with difficulty indicators
              </motion.p>

              <div className="space-y-4">
                {QUESTION_BANK.map((cat) => (
                  <motion.div
                    key={cat.category}
                    className="glass-card rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  >
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-heading font-semibold text-lg">{cat.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          cat.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          cat.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {cat.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{cat.questions.length} questions</span>
                      </div>
                      {expandedCategory === cat.category ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                    <AnimatePresence>
                      {expandedCategory === cat.category && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 space-y-3">
                            {cat.questions.map((q, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                <Circle className="w-2 h-2 mt-2 text-blue-400 shrink-0" />
                                <span className="text-sm text-gray-300">{q}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Progress Chart ─── */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                Track Your <span className="text-gradient">Improvement</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                Watch your scores climb as you practice more
              </motion.p>

              <motion.div
                className="glass-card rounded-2xl p-6 md:p-8"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Interview Score Trend</h3>
                    <p className="text-sm text-gray-400">Last 8 weeks</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">+24 pts</span>
                  </div>
                </div>
                <ProgressChart />
              </motion.div>
            </div>
          </section>

          {/* ─── Features ─── */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold font-heading text-center mb-4"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                Everything You Need to <span className="text-gradient">Ace Interviews</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                Powerful features designed by hiring experts and AI researchers
              </motion.p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="glass-card rounded-2xl p-6 group"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:border-blue-500/40 transition-colors">
                      <f.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="relative glass-card rounded-3xl p-10 md:p-16 text-center overflow-hidden"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="relative z-10">
                  <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-6" />
                  <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
                    Ready to <span className="text-gradient-animated">Ace Your Next Interview?</span>
                  </h2>
                  <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
                    Join 500K+ professionals who practice with CareerOS AI and land their dream jobs faster.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg">
                      <Mic className="w-5 h-5" /> Start Practicing Free
                    </Button>
                    <Button variant="secondary" size="lg">
                      View Pricing <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
