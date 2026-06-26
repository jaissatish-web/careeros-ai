"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Share2,
  User,
  Users,
  Eye,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  Camera,
  FileText,
  Award,
  MessageSquare,
  BarChart3,
  Star,
  ChevronRight,
  Brain,
  Shield,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

/* ==========================================================================
   Animated Circular Gauge
   ========================================================================== */

function AnimatedGauge({ value, size = 200 }: { value: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const x = useMotionValue(0);
  const strokeDashoffset = useTransform(x, [0, 100], [circumference, 0]);

  useEffect(() => {
    const controls = animate(x, value, {
      duration: 2,
      ease: "easeOut" as const,
    });
    return controls.stop;
  }, [value, x]);

  const getColor = (v: number) => {
    if (v >= 80) return { stroke: "#22c55e", glow: "rgba(34,197,94,0.4)", label: "Excellent" };
    if (v >= 60) return { stroke: "#eab308", glow: "rgba(234,179,8,0.4)", label: "Good" };
    if (v >= 40) return { stroke: "#f97316", glow: "rgba(249,115,22,0.4)", label: "Fair" };
    return { stroke: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "Needs Work" };
  };

  const color = getColor(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30"
        style={{ background: color.glow }}
      />
      <svg width={size} height={size} className="relative z-10 transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={12}
        />
        {/* Animated progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value}
        </motion.span>
        <span className="text-sm text-gray-400 mt-1">/ 100</span>
        <span
          className="text-xs font-semibold mt-1 px-3 py-1 rounded-full"
          style={{
            color: color.stroke,
            background: `rgba(${color.stroke === "#22c55e" ? "34,197,94" : color.stroke === "#eab308" ? "234,179,8" : color.stroke === "#f97316" ? "249,115,22" : "239,68,68"},0.15)`,
          }}
        >
          {color.label}
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   Floating Orbs Background
   ========================================================================== */

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="gradient-orb gradient-orb-blue"
        style={{ width: 600, height: 600, top: "-10%", left: "-10%", animation: "orb-float-1 12s ease-in-out infinite" }}
      />
      <div
        className="gradient-orb gradient-orb-purple"
        style={{ width: 500, height: 500, top: "30%", right: "-8%", animation: "orb-float-2 15s ease-in-out infinite" }}
      />
      <div
        className="gradient-orb gradient-orb-cyan"
        style={{ width: 400, height: 400, bottom: "5%", left: "20%", animation: "orb-float-3 10s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ==========================================================================
   Page Component
   ========================================================================== */

export default function LinkedInOptimizerPage() {
  const [headlineInput, setHeadlineInput] = useState("");
  const [aboutInput, setAboutInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAboutSuggestion, setShowAboutSuggestion] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const headlineSuggestions = [
    "Senior Full-Stack Engineer | React • Node.js • Cloud | Helping startups scale from 0 to 1M users",
    "Product-Minded Software Architect | Building the future of fintech with TypeScript & AWS",
    "Engineering Leader | Ex-Google | Passionate about developer experience and high-performing teams",
    "Full-Stack Developer | Open Source Contributor | React, Python, Kubernetes | Tech Speaker & Mentor",
  ];

  const aboutSuggestion = `🚀 Senior Full-Stack Engineer with 8+ years of experience building scalable web applications that serve millions of users.

💡 I specialize in React, Node.js, and cloud-native architectures. Previously at Google and two successful startups (one acquired by Stripe).

🎯 My superpower? Turning complex technical challenges into elegant, user-friendly solutions. I've led teams of 12+, shipped products used by 2M+ users, and reduced infrastructure costs by 40% through architectural improvements.

🔥 What drives me:
• Building products that make a real difference
• Mentoring the next generation of engineers
• Exploring the intersection of AI and web development

📍 San Francisco Bay Area | Open to remote opportunities
📩 Let's connect: I'm always excited to discuss innovative projects and collaboration opportunities.

#OpenToWork #React #Nodejs #CloudArchitecture`;

  const handleGenerateHeadlines = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const handleGenerateAbout = useCallback(() => {
    setShowAboutSuggestion(true);
  }, []);

  const features = [
    {
      icon: Camera,
      title: "Profile Photo Analysis",
      description: "AI analyzes your profile photo for professionalism, lighting, and first impression impact.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileText,
      title: "Headline Optimization",
      description: "Generate attention-grabbing headlines that rank in recruiter searches and showcase your value.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Sparkles,
      title: "About Section Generator",
      description: "Create a compelling story-driven About section that converts visitors into connections.",
      gradient: "from-cyan-500 to-purple-500",
    },
    {
      icon: Award,
      title: "Skills Recommendation",
      description: "Discover high-impact skills to add based on your target roles and industry trends.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: MessageSquare,
      title: "Endorsement Strategy",
      description: "Get a strategic plan for earning endorsements that boost your profile credibility.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Share2,
      title: "Content Suggestions",
      description: "Receive personalized post ideas that establish thought leadership in your field.",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Users,
      title: "Network Growth Tips",
      description: "Strategic networking tactics to grow meaningful connections in your industry.",
      gradient: "from-blue-500 to-indigo-500",
    },
  ];

  const stats = [
    { value: "3x", label: "More Profile Views", icon: Eye },
    { value: "5x", label: "More Recruiter InMails", icon: MessageSquare },
    { value: "89%", label: "Score Improvement", icon: TrendingUp },
    { value: "50K+", label: "Profiles Optimized", icon: Users },
  ];

  const strengthBreakdown = [
    { label: "Headline", score: 45, improved: 92 },
    { label: "About Section", score: 30, improved: 88 },
    { label: "Skills", score: 60, improved: 95 },
    { label: "Experience", score: 70, improved: 90 },
    { label: "Photo & Banner", score: 55, improved: 85 },
  ];

  return (
    <div className="relative min-h-screen bg-space-black-950 text-white overflow-x-hidden">
      <Navbar />
      <FloatingOrbs />

      {/* ================================================================== */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">AI-Powered LinkedIn Optimization</span>
              <Star className="w-3.5 h-3.5 text-yellow-400" />
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-text-flow_6s_ease_infinite]">
                LinkedIn
              </span>{" "}
              Into a{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-text-flow_6s_ease_infinite]">
                Job Magnet
              </span>
            </h1>

            {/* Subtext */}
            <motion.p
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Let AI analyze, optimize, and supercharge your LinkedIn profile to attract recruiters,
              grow your network, and land your dream job — in minutes, not hours.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg group">
                <Sparkles className="w-5 h-5" />
                Optimize My Profile
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg">
                See How It Works
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free analysis
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> 30-second results
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS BAR                                                          */}
      {/* ================================================================== */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] mb-3">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PROFILE ANALYZER SECTION                                            */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Analyze Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Profile Strength
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get an instant AI-powered breakdown of your LinkedIn profile&apos;s effectiveness and
              exactly what to improve.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Mock LinkedIn Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card !p-0 overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 -mt-12 mb-4 rounded-full border-4 border-space-black-950 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-xl">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white">Alex Johnson</h3>
                  <p className="text-gray-400 text-sm mt-1">Software Developer at Tech Corp</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> 500+ connections
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> 230 profile views
                    </span>
                  </div>

                  {/* Section completeness */}
                  <div className="mt-5 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Profile Completeness</h4>
                    {strengthBreakdown.map((item, idx) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-gray-500">{item.score}% → <span className="text-green-400">{item.improved}%</span></span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden relative">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.improved}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.15 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gauge + Score Details */}
            <motion.div
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card flex flex-col items-center !p-10">
                <h3 className="text-lg font-semibold text-gray-300 mb-6">Profile Strength Score</h3>
                <AnimatedGauge value={72} size={220} />
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400">
                    You see <span className="text-green-400 font-semibold">3x more profile views</span> on average
                  </span>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="glass-card w-full">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Quick Insights
                </h4>
                <div className="space-y-3">
                  {[
                    { icon: AlertCircle, text: "Your headline is too generic — add keywords and value proposition", type: "warning" as const },
                    { icon: AlertCircle, text: "About section is sparse — add achievements with metrics", type: "warning" as const },
                    { icon: CheckCircle2, text: "Good number of connections — keep networking actively", type: "success" as const },
                    { icon: AlertCircle, text: "Add 5 more relevant skills to rank higher in searches", type: "warning" as const },
                    { icon: AlertCircle, text: "Consider a custom banner image for stronger branding", type: "warning" as const },
                  ].map((insight, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 text-sm"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <insight.icon
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          insight.type === "success" ? "text-green-400" : "text-yellow-400"
                        }`}
                      />
                      <span className="text-gray-400">{insight.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* BEFORE / AFTER COMPARISON                                         */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              See the{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transformation
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real before &amp; after results from profiles optimized with CareerOS AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 relative">
            {/* Before Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card border-red-500/20 !p-8 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Before</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Headline</span>
                    <p className="text-gray-400 text-sm leading-relaxed bg-white/[0.03] rounded-lg p-4 border border-white/[0.04]">
                      Software Developer at Tech Corp
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">About</span>
                    <p className="text-gray-500 text-sm leading-relaxed bg-white/[0.03] rounded-lg p-4 border border-white/[0.04]">
                      I am a software developer with experience in web development. I enjoy coding and
                      building applications. Currently looking for new opportunities in tech.
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "React", "Node.js"].map((s) => (
                        <span key={s} className="px-3 py-1 rounded-full text-xs bg-white/[0.04] text-gray-500 border border-white/[0.06]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Profile Strength: <strong className="text-red-300">38/100</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* VS Divider */}
            <div className="hidden md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-30">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center shadow-2xl shadow-yellow-500/20 border-4 border-space-black-950"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" as const, stiffness: 300 }}
              >
                <span className="text-xs font-bold text-white">VS</span>
              </motion.div>
            </div>

            {/* Mobile VS */}
            <div className="flex md:hidden items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center shadow-xl shadow-yellow-500/20 border-4 border-space-black-950">
                <span className="text-xs font-bold text-white">VS</span>
              </div>
            </div>

            {/* After Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card border-green-500/20 !p-8 h-full relative overflow-hidden">
                {/* Shimmer overlay */}
                <div className="absolute inset-0 shimmer pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">After</span>
                    <Sparkles className="w-4 h-4 text-green-400" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Headline</span>
                      <p className="text-white text-sm leading-relaxed bg-green-500/[0.08] rounded-lg p-4 border border-green-500/20">
                        Senior Full-Stack Engineer | React • Node.js • TypeScript | Building scalable
                        web apps used by 2M+ users | Ex-Google
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">About</span>
                      <div className="bg-green-500/[0.08] rounded-lg p-4 border border-green-500/20">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          🚀 Senior Full-Stack Engineer with 8+ years building scalable web
                          applications that serve millions of users globally.
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed mt-3">
                          💡 Specialized in React, TypeScript, Node.js &amp; cloud-native
                          architectures. Previously at Google and 2 successful startups.
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed mt-3">
                          🎯 Led teams of 12+, shipped products to 2M+ users, reduced
                          infrastructure costs by 40%.
                        </p>
                        <p className="text-gray-400 text-sm mt-3">
                          📩 Let&apos;s connect — always excited to discuss innovative projects!
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {["React", "TypeScript", "Node.js", "AWS", "Next.js", "GraphQL", "Kubernetes", "PostgreSQL", "Redis", "CI/CD"].map((s) => (
                          <span key={s} className="px-3 py-1 rounded-full text-xs bg-green-500/[0.1] text-green-300 border border-green-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Profile Strength: <strong className="text-green-300">94/100</strong></span>
                        <TrendingUp className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HEADLINE OPTIMIZER                                                  */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Headline{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Optimizer
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Paste your current headline and let AI generate powerful, keyword-rich alternatives.
            </p>
          </motion.div>

          <motion.div
            className="glass-card !p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <label className="text-sm font-medium text-gray-300 mb-2 block">Your Current Headline</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                placeholder="e.g. Software Developer at Tech Corp"
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
              <Button variant="primary" size="md" className="w-full sm:w-auto whitespace-nowrap" onClick={handleGenerateHeadlines}>
                <Sparkles className="w-4 h-4" />
                Generate Headlines
              </Button>
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> AI-Generated Headlines
                  </div>
                  {headlineSuggestions.map((suggestion, i) => (
                    <motion.div
                      key={i}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 hover:bg-blue-500/[0.05] transition-all cursor-pointer group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {suggestion}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-blue-400" /> Keyword-rich
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-400" /> High impact
                          </span>
                        </div>
                        <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Use this <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* ABOUT SECTION GENERATOR                                            */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              About Section{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Generator
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tell us about yourself and we&apos;ll craft a compelling About section that tells your story.
            </p>
          </motion.div>

          <motion.div
            className="glass-card !p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <label className="text-sm font-medium text-gray-300 mb-2 block">Quick Summary</label>
            <textarea
              value={aboutInput}
              onChange={(e) => setAboutInput(e.target.value)}
              placeholder="e.g. I'm a software engineer with 5 years of experience. I've worked at Google and a few startups. I specialize in React and Node.js. I'm passionate about building products that help people."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button variant="primary" size="md" onClick={handleGenerateAbout}>
                <Sparkles className="w-4 h-4" />
                Generate About Section
              </Button>
            </div>

            <AnimatePresence>
              {showAboutSuggestion && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> AI-Generated About Section
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.06] border border-purple-500/20">
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                      {aboutSuggestion}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" /> SEO optimized
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" /> Story-driven
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" /> Action-oriented
                      </span>
                    </div>
                    <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      Copy to clipboard <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES GRID                                                       */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Dominate LinkedIn
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete toolkit powered by AI to transform every aspect of your LinkedIn presence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                delay={i * 0.08}
                className={`group cursor-pointer transition-all duration-300 ${
                  activeFeature === i ? "!border-blue-500/30 !bg-blue-500/[0.08]" : ""
                }`}
                onClick={() => setActiveFeature(activeFeature === i ? null : i)}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  style={{
                    boxShadow: `0 8px 25px rgba(${
                      feature.gradient.includes("blue") ? "59,130,246" :
                      feature.gradient.includes("cyan") ? "6,182,212" :
                      "139,92,246"
                    },0.25)`,
                  }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3 h-3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS / SOCIAL PROOF                                               */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="glass-card !p-12 lg:!p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-purple-500/[0.05] to-cyan-500/[0.05]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Proven Results</span>
              </motion.div>

              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white leading-tight mb-6">
                &ldquo;Users see{" "}
                <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  3x more profile views
                </span>{" "}
                on average after optimizing with CareerOS.&rdquo;
              </blockquote>

              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Join thousands of professionals who&apos;ve transformed their LinkedIn presence,
                attracted better opportunities, and accelerated their career growth.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-sm text-gray-400 ml-2">4.9/5 from 2,400+ reviews</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <Button variant="primary" size="lg">
                  <Rocket className="w-5 h-5" />
                  Start Free Now
                </Button>
                <Button variant="ghost" size="lg">
                  View Success Stories
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FINAL CTA SECTION                                                   */}
      {/* ================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Floating icon */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 mb-8 shadow-2xl shadow-blue-500/20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
            >
              <Share2 className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-6">
              Ready to Get{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Noticed on LinkedIn
              </span>
              ?
            </h2>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Your LinkedIn profile is your digital handshake. Make it count. Start optimizing
              today and watch the recruiter InMails roll in.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg group">
                <Sparkles className="w-5 h-5" />
                Optimize My Profile — It&apos;s Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg">
                <Shield className="w-5 h-5" />
                View Pricing
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free forever plan
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card needed
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Results in 30 seconds
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
