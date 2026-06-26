"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Star,
  ChevronDown,
  Sparkles,
  Zap,
  Shield,
  Award,
  Users,
  TrendingUp,
  FileText,
  MessageSquare,
  BarChart3,
  Palette,
  Key,
  Crown,
  ArrowRight,
  BadgeCheck,
  Timer,
  Bot,
  Briefcase,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ============================================================================
   PRICING DATA
   ============================================================================ */

interface Tier {
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  cta: string;
  ctaVariant: "primary" | "secondary" | "outline";
  popular?: boolean;
}

const tiers: Tier[] = [
  {
    name: "FREE",
    priceMonthly: 0,
    priceAnnual: 0,
    description: "Perfect for getting started with your job search.",
    features: [
      "1 resume per month",
      "3 basic templates",
      "ATS compatibility score",
      "Email support",
      "PDF export",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline",
  },
  {
    name: "PRO",
    priceMonthly: 19,
    priceAnnual: 15,
    description: "For serious job seekers who want the best tools.",
    features: [
      "Unlimited resumes",
      "All premium templates",
      "AI content suggestions",
      "LinkedIn profile optimizer",
      "Cover letter generator",
      "Job application tracker",
      "Priority email support",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "primary",
    popular: true,
  },
  {
    name: "ENTERPRISE",
    priceMonthly: 49,
    priceAnnual: 39,
    description: "For teams and organizations at scale.",
    features: [
      "Everything in Pro",
      "AI interview coach",
      "Team analytics dashboard",
      "Custom branding",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaVariant: "secondary",
  },
];

interface FeatureRow {
  feature: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
  icon: React.ReactNode;
}

const featureRows: FeatureRow[] = [
  { feature: "Resume Builder", free: true, pro: true, enterprise: true, icon: <FileText size={16} /> },
  { feature: "PDF & DOCX Export", free: true, pro: true, enterprise: true, icon: <FileText size={16} /> },
  { feature: "ATS Score Check", free: true, pro: true, enterprise: true, icon: <BadgeCheck size={16} /> },
  { feature: "Basic Templates", free: true, pro: true, enterprise: true, icon: <Palette size={16} /> },
  { feature: "The /restworld", free: false, pro: true, enterprise: true, icon: <Sparkles size={16} /> },
  { feature: "LinkedIn Optimizer", free: false, pro: true, enterprise: true, icon: <TrendingUp size={16} /> },
  { feature: "Cover Letter Gen", free: false, pro: true, enterprise: true, icon: <MessageSquare size={16} /> },
  { feature: "Job Application Tracker", free: false, pro: true, enterprise: true, icon: <Briefcase size={16} /> },
  { feature: "Priority Support", free: false, pro: true, enterprise: true, icon: <Zap size={16} /> },
  { feature: "AI Content Suggestions", free: false, pro: true, enterprise: true, icon: <Bot size={16} /> },
  { feature: "Unlimited Resumes", free: false, pro: true, enterprise: true, icon: <FileText size={16} /> },
  { feature: "All Premium Templates", free: false, pro: true, enterprise: true, icon: <Sparkles size={16} /> },
  { feature: "AI Interview Coach", free: false, pro: false, enterprise: true, icon: <Users size={16} /> },
  { feature: "Team Analytics", free: false, pro: false, enterprise: true, icon: <BarChart3 size={16} /> },
  { feature: "Custom Branding", free: false, pro: false, enterprise: true, icon: <Palette size={16} /> },
  { feature: "API Access", free: false, pro: false, enterprise: true, icon: <Key size={16} /> },
  { feature: "Dedicated Manager", free: false, pro: false, enterprise: true, icon: <Crown size={16} /> },
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Absolutely! You can upgrade or downgrade your plan at any time from your account settings. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes! Every Pro plan comes with a 7-day free trial. You get full access to all Pro features during the trial period. No credit card required to start. If you decide Pro isn't for you, your account will automatically revert to the Free plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice with NET-30 terms.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time with no cancellation fees. You'll continue to have access to your paid features until the end of your current billing period. We also offer a 30-day money-back guarantee if you're not satisfied.",
  },
  {
    question: "How does the AI interview coach work?",
    answer:
      "Our AI interview coach (Enterprise only) uses advanced language models to simulate real interview scenarios. It adapts to your target role, asks relevant questions, provides real-time feedback on your answers, and gives you a detailed performance report with actionable improvement tips.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is our top priority. We use enterprise-grade encryption (AES-256) for all data at rest and TLS 1.3 for data in transit. We're SOC 2 Type II certified and GDPR compliant. Your resumes and personal information are never shared with third parties.",
  },
];

/* ============================================================================
   REUSABLE BUTTON COMPONENT (inline to match design system)
   ============================================================================ */

interface PricingButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function PricingButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
}: PricingButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer select-none";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-xl hover:scale-[1.02]",
    secondary:
      "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]",
    outline:
      "bg-transparent border border-white/20 text-white hover:border-blue-400/50 hover:bg-blue-500/5 hover:scale-[1.02]",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

/* ============================================================================
   ICON CHECK / X
   ============================================================================ */

function CheckMark() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15">
      <Check size={12} className="text-emerald-400" strokeWidth={3} />
    </span>
  );
}

function XMark() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/5">
      <X size={12} className="text-gray-600" strokeWidth={3} />
    </span>
  );
}

/* ============================================================================
   MAIN PAGE COMPONENT
   ============================================================================ */

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Navbar />

      {/* ================================================================== */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6">
              <Sparkles size={14} className="text-purple-400" />
              No hidden fees · Cancel anytime
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold font-heading mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the plan that fits your career goals. Upgrade, downgrade, or
            cancel at any time — no questions asked.
          </motion.p>

          {/* Monthly / Annual Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span
              className={`text-sm font-medium transition-colors ${
                !annual ? "text-white" : "text-gray-500"
              }`}
            >
              Monthly
            </span>

            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer ${
                annual
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-white/10"
              }`}
              aria-label="Toggle annual pricing"
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: annual ? "30px" : "2px" }}
                transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
              />
            </button>

            <span
              className={`text-sm font-medium transition-colors ${
                annual ? "text-white" : "text-gray-500"
              }`}
            >
              Annual
            </span>

            {annual && (
              <motion.span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
              >
                <Timer size={12} />
                Save 20%
              </motion.span>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRICING CARDS                                                       */}
      {/* ================================================================== */}
      <section className="relative pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative ${
                  tier.popular ? "md:-mt-4 md:mb-[-16px]" : ""
                }`}
              >
                {/* Glowing border effect for Pro */}
                {tier.popular && (
                  <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 opacity-60 blur-[2px] animate-pulse" />
                )}

                <div
                  className={`relative h-full rounded-2xl overflow-hidden ${
                    tier.popular
                      ? "bg-[#0a0f1e]/95 backdrop-blur-xl border border-transparent"
                      : "bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]"
                  }`}
                >
                  {/* Most Popular badge */}
                  {tier.popular && (
                    <div className="relative z-10 flex justify-center pt-4">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-sm font-semibold text-purple-300">
                        <Star size={14} className="fill-purple-400 text-purple-400" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Tier name */}
                    <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-2">
                      {tier.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-5xl font-bold font-heading text-white">
                        ${annual ? tier.priceAnnual : tier.priceMonthly}
                      </span>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </div>

                    {annual && tier.priceMonthly > 0 && (
                      <p className="text-xs text-emerald-400/80 mb-2">
                        Billed ${tier.priceAnnual * 12}/year
                      </p>
                    )}

                    <p className="text-gray-400 text-sm mb-8">
                      {tier.description}
                    </p>

                    {/* CTA Button */}
                    <PricingButton
                      variant={tier.ctaVariant}
                      size="lg"
                      className="w-full mb-8"
                    >
                      {tier.cta}
                      <ArrowRight size={16} />
                    </PricingButton>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                    {/* Features list */}
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-gray-300"
                        >
                          <CheckMark />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURE COMPARISON TABLE                                            */}
      {/* ================================================================== */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background orb */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Compare All{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See exactly what's included in each plan so you can make the best
              decision for your career.
            </p>
          </motion.div>

          {/* Scrollable table container */}
          <motion.div
            ref={tableRef}
            className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-5 px-6 text-sm font-semibold text-gray-400 w-[40%]">
                    Feature
                  </th>
                  <th className="text-center py-5 px-4 text-sm font-semibold text-gray-400 w-[20%]">
                    Free
                  </th>
                  <th className="text-center py-5 px-4 text-sm font-semibold text-purple-400 w-[20%]">
                    Pro
                  </th>
                  <th className="text-center py-5 px-4 text-sm font-semibold text-cyan-400 w-[20%]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
                      i % 2 === 0 ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{row.icon}</span>
                        <span className="text-sm text-gray-300">
                          {row.feature}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.free ? <CheckMark /> : <XMark />}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.pro ? <CheckMark /> : <XMark />}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.enterprise ? <CheckMark /> : <XMark />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TRUST SECTION                                                       */}
      {/* ================================================================== */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar stack */}
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-3">
                {[
                  "bg-gradient-to-br from-blue-400 to-blue-600",
                  "bg-gradient-to-br from-purple-400 to-purple-600",
                  "bg-gradient-to-br from-cyan-400 to-cyan-600",
                  "bg-gradient-to-br from-emerald-400 to-emerald-600",
                  "bg-gradient-to-br from-amber-400 to-amber-600",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${bg} border-2 border-[#030712] flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {["JD", "AK", "MR", "SL", "TC"][i]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#030712] flex items-center justify-center text-gray-400 text-xs font-bold">
                  +500K
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Join{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                500,000+
              </span>{" "}
              professionals
            </h2>

            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              who have landed their dream jobs with CareerOS AI.
            </p>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-10">
              4.9/5 average rating from 12,000+ reviews
            </p>

            {/* Company logos as text */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                "Google",
                "Microsoft",
                "Amazon",
                "Meta",
                "Apple",
                "Netflix",
                "Spotify",
                "Stripe",
              ].map((company) => (
                <span
                  key={company}
                  className="text-lg font-semibold text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ SECTION                                                         */}
      {/* ================================================================== */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-gray-400">
              Everything you need to know about our pricing and plans.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                >
                  <span className="text-white font-medium pr-4 group-hover:text-blue-300 transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      size={20}
                      className="text-gray-500 group-hover:text-blue-400 transition-colors"
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" as const }}
                    >
                      <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/[0.04] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FINAL CTA SECTION                                                   */}
      {/* ================================================================== */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 blur-[120px]" />
        </div>

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-8">
            <Rocket size={28} className="text-purple-400" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Ready to Land Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dream Job
            </span>
            ?
          </h2>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Start free today. No credit card required. Join half a million
            professionals who've transformed their careers with CareerOS AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PricingButton variant="primary" size="lg">
              Get Started Free
              <ArrowRight size={18} />
            </PricingButton>
            <PricingButton variant="outline" size="lg">
              <MessageSquare size={18} />
              Talk to Sales
            </PricingButton>
          </div>

          <p className="text-xs text-gray-600 mt-6">
            Free plan available forever · No credit card required · Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER                                                              */}
      {/* ================================================================== */}
      <Footer />
    </>
  );
}
