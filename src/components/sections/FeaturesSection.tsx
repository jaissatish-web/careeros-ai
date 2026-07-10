"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Share2,
  Mail,
  Briefcase,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import Card from "../ui/Card";

const features = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description:
      "Create ATS-optimized resumes in minutes. Our AI analyzes job descriptions and tailors your resume for maximum impact.",
    gradient: "from-[#D4AF37] to-[#B8941E]",
  },

  {
    icon: Mail,
    title: "Cover Letter Generator",
    description:
      "Generate personalized cover letters that match each job application. Stand out from hundreds of applicants.",
    gradient: "from-[#00F0FF] to-[#06B6D4]",
  },
  {
    icon: Briefcase,
    title: "Job Application Tracker",
    description:
      "Organize your job search in one place. Track applications, interviews, and offers with smart reminders.",
    gradient: "from-[#F6E27A] to-[#D4AF37]",
  },
  {
    icon: MessageSquare,
    title: "Interview Coach",
    description:
      "Practice with AI-powered mock interviews. Get real-time feedback on your answers, tone, and confidence.",
    gradient: "from-[#00F0FF] to-[#4A6CF7]",
  },
  {
    icon: BarChart3,
    title: "Career Analytics",
    description:
      "Understand your job search performance. See response rates, optimize timing, and improve your strategy.",
    gradient: "from-[#D4AF37] to-[#00F0FF]",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-black">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-[#F6E27A] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#00F0FF] bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            From resume to offer letter, we've got every step of your job search covered with
            cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={feature.title} delay={i * 0.1}>
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                style={{
                  boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
                }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>

              {/* Learn more link */}
              <motion.a
                href="#"
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#D4AF37] hover:text-[#F6E27A] transition-colors group"
                whileHover={{ x: 4 }}
              >
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </motion.a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
