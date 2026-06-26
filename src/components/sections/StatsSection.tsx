"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, FileText, TrendingUp, Star } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatItem({ icon: Icon, value, suffix, label, delay }: StatItemProps) {
  return (
    <motion.div
      className="relative text-center p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm group hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>

      {/* Counter */}
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>

      {/* Label */}
      <p className="text-sm text-gray-500">{label}</p>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "K+",
    label: "Active Users",
  },
  {
    icon: FileText,
    value: 1,
    suffix: "M+",
    label: "Resumes Created",
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: "%",
    label: "Success Rate",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-black">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            By the Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hundreds of Thousands
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            Join the fastest-growing community of job seekers who are landing their dream jobs
            with AI.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
