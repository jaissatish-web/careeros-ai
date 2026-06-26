"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Bell,
  FileText,
  BarChart3,
  StickyNote,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Phone,
  Video,
  MapPin,
  ChevronRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  XCircle,
  Send,
  Award,
  Timer,
  Layers,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

/* ==========================================================================
   Animated Counter Hook
   ========================================================================== */
function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (startOnView && isInView && !hasStarted) {
      setHasStarted(true);
      const controls = animate(0, end, {
        duration: duration / 1000,
        ease: "easeOut" as const,
        onUpdate: (v) => setCount(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, end, duration, startOnView, hasStarted]);

  return { count, ref };
}

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const { count, ref } = useCountUp(end, duration);
  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   Countdown Timer Hook
   ========================================================================== */
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(targetDate: string) {
  const now = new Date();
  const diff = new Date(targetDate).getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, label: "Now" };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  if (days > 0) return { days, hours, minutes, label: `${days}d ${hours}h` };
  if (hours > 0) return { days, hours, minutes, label: `${hours}h ${minutes}m` };
  return { days, hours, minutes, label: `${minutes}m` };
}

/* ==========================================================================
   Data
   ========================================================================== */
interface JobCard {
  id: string;
  company: string;
  role: string;
  date: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  logo: string;
  salary?: string;
  location: string;
}

const jobCards: JobCard[] = [
  {
    id: "1",
    company: "Google",
    role: "Senior Frontend Engineer",
    date: "Jun 12",
    status: "interviewing",
    logo: "G",
    salary: "$180k - $220k",
    location: "Mountain View, CA",
  },
  {
    id: "2",
    company: "Stripe",
    role: "Full Stack Developer",
    date: "Jun 10",
    status: "applied",
    logo: "S",
    salary: "$160k - $200k",
    location: "San Francisco, CA",
  },
  {
    id: "3",
    company: "Vercel",
    role: "React Developer",
    date: "Jun 8",
    status: "interviewing",
    logo: "V",
    salary: "$150k - $190k",
    location: "Remote",
  },
  {
    id: "4",
    company: "OpenAI",
    role: "Software Engineer",
    date: "Jun 5",
    status: "offer",
    logo: "O",
    salary: "$200k - $280k",
    location: "San Francisco, CA",
  },
  {
    id: "5",
    company: "Meta",
    role: "Frontend Engineer",
    date: "Jun 3",
    status: "rejected",
    logo: "M",
    salary: "$170k - $210k",
    location: "Menlo Park, CA",
  },
  {
    id: "6",
    company: "Netflix",
    role: "UI Engineer",
    date: "Jun 1",
    status: "applied",
    logo: "N",
    salary: "$190k - $240k",
    location: "Los Gatos, CA",
  },
  {
    id: "7",
    company: "Shopify",
    role: "Senior Developer",
    date: "May 28",
    status: "interviewing",
    logo: "Sh",
    salary: "$140k - $180k",
    location: "Remote",
  },
  {
    id: "8",
    company: "Airbnb",
    role: "Staff Engineer",
    date: "May 25",
    status: "rejected",
    logo: "A",
    salary: "$200k - $260k",
    location: "San Francisco, CA",
  },
];

const kanbanColumns = [
  {
    key: "applied" as const,
    label: "Applied",
    icon: Send,
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    count: jobCards.filter((j) => j.status === "applied").length,
  },
  {
    key: "interviewing" as const,
    label: "Interviewing",
    icon: Calendar,
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    count: jobCards.filter((j) => j.status === "interviewing").length,
  },
  {
    key: "offer" as const,
    label: "Offer",
    icon: Award,
    color: "from-emerald-500 to-green-500",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    count: jobCards.filter((j) => j.status === "offer").length,
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    icon: XCircle,
    color: "from-red-500 to-rose-500",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    count: jobCards.filter((j) => j.status === "rejected").length,
  },
];

interface Interview {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  type: "Phone" | "Video" | "On-site";
  datetime: string;
}

const upcomingInterviews: Interview[] = [
  {
    id: "i1",
    company: "Google",
    role: "Senior Frontend Engineer",
    date: "Jun 15",
    time: "2:00 PM EST",
    type: "Video",
    datetime: '2026-06-16T18:00:00',
  },
  {
    id: 'i2',
    company: 'Vercel',
    role: 'React Developer',
    date: 'Jun 17',
    time: '10:00 AM EST',
    type: 'Phone',
    datetime: '2026-06-18T14:00:00',
  },
  {
    id: 'i3',
    company: 'Shopify',
    role: 'Senior Developer',
    date: 'Jun 20',
    time: '3:30 PM EST',
    type: 'On-site',
    datetime: '2026-06-21T22:30:00',
  },
];

const activityTimeline = [
  {
    id: "a1",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Offer received from OpenAI",
    description: "Software Engineer position — $200k-$280k",
    time: "2 hours ago",
  },
  {
    id: "a2",
    icon: Calendar,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Interview scheduled with Google",
    description: "Video call — Senior Frontend Engineer",
    time: "5 hours ago",
  },
  {
    id: "a3",
    icon: Send,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Application sent to Netflix",
    description: "UI Engineer position",
    time: "1 day ago",
  },
  {
    id: "a4",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    title: "Application rejected by Meta",
    description: "Frontend Engineer position",
    time: "2 days ago",
  },
  {
    id: "a5",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "Resume updated",
    description: "Added new project experience",
    time: "3 days ago",
  },
  {
    id: "a6",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Phone screen completed — Vercel",
    description: "React Developer position",
    time: "4 days ago",
  },
];

const features = [
  {
    icon: Layers,
    title: "Visual Pipeline",
    description: "Drag-and-drop Kanban board to manage every stage of your job search.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a follow-up. AI-powered reminders for every application.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Target,
    title: "Interview Prep Integration",
    description: "Practice questions tailored to each company and role you're interviewing for.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Status Analytics",
    description: "Track response rates, interview conversion, and optimize your strategy.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: StickyNote,
    title: "Notes & Follow-ups",
    description: "Add notes to each application and schedule follow-up reminders.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: RefreshCw,
    title: "Calendar Sync",
    description: "Sync interviews and deadlines with Google Calendar, Outlook, and more.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

/* ==========================================================================
   Section Components
   ========================================================================== */

function SectionHeading({
  badge,
  title,
  highlight,
  description,
}: {
  badge: string;
  title: string;
  highlight: string;
  description: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-gray-400 mb-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        {badge}
      </motion.span>
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        {title}{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </motion.h2>
      <motion.p
        className="text-lg text-gray-400"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {description}
      </motion.p>
    </div>
  );
}

/* ==========================================================================
   Hero Section
   ========================================================================== */
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-[orb-float-1_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-[orb-float-2_12s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] animate-[orb-float-3_10s_ease-in-out_infinite]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm text-gray-300">47 applications tracked this month</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-white">Track Every</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-[gradient-text-flow_6s_ease_infinite]">
            Application.
          </span>{" "}
          <span className="text-white">Land Every</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-[gradient-text-flow_6s_ease_infinite]">
            Job.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your entire job search in one place. Visual pipeline, smart reminders,
          interview prep, and analytics — all powered by AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant="primary" size="lg">
            Start Tracking Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="lg">
            <Zap className="w-5 h-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { value: "500K+", label: "Active Users" },
            { value: "2.1M", label: "Applications Tracked" },
            { value: "34%", label: "Avg. Response Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Kanban Board Section
   ========================================================================== */
function KanbanSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pipeline Board"
          title="Your Applications"
          highlight="At a Glance"
          description="Visualize every stage of your job search with our Kanban-style board. Track progress from application to offer."
        />

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kanbanColumns.map((column, colIdx) => {
            const columnJobs = jobCards.filter((j) => j.status === column.key);
            const Icon = column.icon;
            return (
              <motion.div
                key={column.key}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: colIdx * 0.1 }}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-t-2xl bg-gradient-to-r ${column.color} bg-opacity-10 border ${column.borderColor} border-b-0`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-white">{column.label}</span>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${column.bgColor} ${column.textColor}`}
                  >
                    {column.count}
                  </span>
                </div>

                {/* Column Body */}
                <div
                  className={`p-3 rounded-b-2xl bg-white/[0.02] border ${column.borderColor} border-t-0 min-h-[300px] space-y-3`}
                >
                  {columnJobs.map((job, jobIdx) => (
                    <motion.div
                      key={job.id}
                      className="group relative p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: colIdx * 0.1 + jobIdx * 0.05 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      {/* Drag handle indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-gray-500" />
                          <div className="w-1 h-1 rounded-full bg-gray-500" />
                          <div className="w-1 h-1 rounded-full bg-gray-500" />
                        </div>
                      </div>

                      {/* Company logo */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${column.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                        >
                          {job.logo}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{job.company}</div>
                          <div className="text-xs text-gray-500">{job.location}</div>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="text-sm text-gray-300 mb-2">{job.role}</div>

                      {/* Salary */}
                      {job.salary && (
                        <div className="text-xs text-gray-500 mb-3">{job.salary}</div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{job.date}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${column.bgColor} ${column.textColor}`}
                        >
                          {column.label}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add card placeholder */}
                  <motion.div
                    className="flex items-center justify-center p-4 rounded-xl border border-dashed border-white/[0.08] text-gray-600 text-sm hover:border-white/[0.15] hover:text-gray-400 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                  >
                    + Add Application
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Pipeline Funnel Section
   ========================================================================== */
function PipelineSection() {
  const stages = [
    { label: "Applied", count: 47, color: "from-blue-500 to-blue-600", width: "100%" },
    { label: "Screening", count: 28, color: "from-cyan-500 to-blue-500", width: "80%" },
    { label: "Interviewing", count: 11, color: "from-amber-500 to-orange-500", width: "55%" },
    { label: "Offer", count: 2, color: "from-emerald-500 to-green-500", width: "30%" },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pipeline Analytics"
          title="Your Application"
          highlight="Funnel"
          description="See how your applications progress through each stage. Identify bottlenecks and optimize your strategy."
        />

        <div className="max-w-2xl mx-auto space-y-4">
          {stages.map((stage, idx) => (
            <motion.div
              key={stage.label}
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm font-medium text-gray-300 w-28 text-right">
                  {stage.label}
                </span>
                <div className="flex-1 relative h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r ${stage.color} flex items-center justify-end pr-4`}
                    initial={{ width: 0 }}
                    whileInView={{ width: stage.width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.15, ease: "easeOut" as const }}
                  >
                    <span className="text-sm font-bold text-white">{stage.count}</span>
                  </motion.div>
                </div>
                <span className="text-sm text-gray-500 w-16">
                  {idx > 0
                    ? `${Math.round((stage.count / stages[idx - 1].count) * 100)}%`
                    : "—"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Conversion insights */}
        <motion.div
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { label: "Apply → Screen", value: "60%", color: "text-blue-400" },
            { label: "Screen → Interview", value: "39%", color: "text-amber-400" },
            { label: "Interview → Offer", value: "18%", color: "text-emerald-400" },
            { label: "Overall Rate", value: "4.3%", color: "text-purple-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-gray-500 mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Interview Schedule Section
   ========================================================================== */
function InterviewScheduleSection() {
  const typeIcons = {
    Phone: Phone,
    Video: Video,
    "On-site": MapPin,
  };
  const typeColors = {
    Phone: "text-blue-400 bg-blue-500/10",
    Video: "text-purple-400 bg-purple-500/10",
    "On-site": "text-amber-400 bg-amber-500/10",
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Interview Schedule"
          title="Upcoming"
          highlight="Interviews"
          description="Never miss an interview. See what's coming up and prepare with AI-powered practice questions."
        />

        <div className="space-y-4">
          {upcomingInterviews.map((interview, idx) => {
            const countdown = useCountdown(interview.datetime);
            const TypeIcon = typeIcons[interview.type];
            return (
              <motion.div
                key={interview.id}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Company info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                      {interview.company[0]}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">
                        {interview.company}
                      </div>
                      <div className="text-sm text-gray-400">{interview.role}</div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{interview.time}</span>
                    </div>
                  </div>

                  {/* Type badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${typeColors[interview.type]}`}
                  >
                    <TypeIcon className="w-3.5 h-3.5" />
                    {interview.type}
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">
                      {countdown.label}
                    </span>
                  </div>

                  {/* Action */}
                  <motion.button
                    className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick action */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="secondary" size="md">
            <Calendar className="w-4 h-4" />
            Sync with Calendar
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Progress Analytics Section
   ========================================================================== */
function AnalyticsSection() {
  const metrics = [
    {
      label: "Applications Sent",
      value: 47,
      suffix: "",
      icon: Send,
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: "+12%",
      changeUp: true,
    },
    {
      label: "Response Rate",
      value: 23,
      suffix: "%",
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      change: "+5%",
      changeUp: true,
    },
    {
      label: "Interviews",
      value: 11,
      suffix: "",
      icon: Calendar,
      color: "from-amber-500 to-orange-500",
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
      change: "+3",
      changeUp: true,
    },
    {
      label: "Offers",
      value: 2,
      suffix: "",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "+1",
      changeUp: true,
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Progress Analytics"
          title="Your Job Search"
          highlight="Metrics"
          description="Track your performance with real-time analytics. Understand what's working and optimize your approach."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Gradient orb on hover */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${metric.color} rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>

                  {/* Value */}
                  <div className="text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                  </div>

                  {/* Label */}
                  <div className="text-sm text-gray-400 mb-3">{metric.label}</div>

                  {/* Change indicator */}
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Weekly activity chart placeholder */}
        <motion.div
          className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Applications
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Interviews
              </span>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-40">
            {[
              { day: "Mon", apps: 4, interviews: 1 },
              { day: "Tue", apps: 7, interviews: 2 },
              { day: "Wed", apps: 3, interviews: 0 },
              { day: "Thu", apps: 8, interviews: 3 },
              { day: "Fri", apps: 5, interviews: 1 },
              { day: "Sat", apps: 2, interviews: 0 },
              { day: "Sun", apps: 1, interviews: 0 },
            ].map((bar, idx) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end h-28">
                  <motion.div
                    className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(bar.apps / 8) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                  />
                  <motion.div
                    className="flex-1 rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${Math.max((bar.interviews / 3) * 100, 8)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 + 0.1 }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{bar.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Activity Timeline Section
   ========================================================================== */
function ActivityTimelineSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Activity Feed"
          title="Recent"
          highlight="Activity"
          description="Stay updated with a chronological feed of all your job search activities."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent" />

          <div className="space-y-6">
            {activityTimeline.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  className="relative flex gap-5 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-xl ${activity.bg} border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6 border-b border-white/[0.04] group-hover:border-white/[0.08] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-400">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap mt-1">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Features Section
   ========================================================================== */
function FeaturesSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Powerful Features"
          title="Everything You Need to"
          highlight="Get Hired"
          description="From application tracking to interview prep, CareerOS gives you every tool to land your dream job."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {/* Hover gradient */}
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CTA Section
   ========================================================================== */
function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-8 shadow-lg shadow-blue-500/20"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          <Briefcase className="w-8 h-8 text-white" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Ready to Take Control of{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Your Job Search?
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join 500,000+ professionals who are already using CareerOS to organize,
          track, and accelerate their job search. Start free today.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button variant="primary" size="lg">
            Start Tracking Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="lg">
            View Pricing
          </Button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-8 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          No credit card required · Free plan available · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}

/* ==========================================================================
   Main Page Export
   ========================================================================== */
export default function JobTrackerPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-[#f9fafb] overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <KanbanSection />
        <PipelineSection />
        <InterviewScheduleSection />
        <AnalyticsSection />
        <ActivityTimelineSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
