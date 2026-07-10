"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with your job search.",
    icon: Zap,
    gradient: "",
    features: [
      "1 Resume per month",
      "Basic ATS optimization",
      "1 Cover Letter",
      "Basic profile tips",
      "Community support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 19,
    period: "/month",
    description: "For serious job seekers who want the best results.",
    icon: Sparkles,
    gradient: "from-[#D4AF37] to-[#B8941E]",
    features: [
      "Unlimited resumes",
      "Advanced ATS optimization",
      "Unlimited cover letters",
      "Profile optimization",
      "Interview coach (10 sessions/mo)",
      "Job application tracker",
      "Career analytics dashboard",
      "Priority support",
    ],
    cta: "Start Free Trial",
    variant: "primary" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 49,
    period: "/month",
    description: "For teams and career coaches managing multiple clients.",
    icon: Crown,
    gradient: "from-[#00F0FF] to-[#06B6D4]",
    features: [
      "Everything in Pro",
      "Unlimited interview sessions",
      "Team management (up to 10)",
      "White-label resumes",
      "API access",
      "Custom branding",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    variant: "secondary" as const,
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-black">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00F0FF]/[0.03] rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-[#F6E27A] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple,{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#00F0FF] bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            No hidden fees. No surprises. Choose the plan that fits your job search needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <Badge variant="info" className="!bg-[#D4AF37]/20 !text-[#F6E27A] !border-[#D4AF37]/30">⭐ Most Popular</Badge>
                </div>
              )}

              <Card
                hover={true}
                className={`h-full ${
                  plan.popular
                    ? "border-[#D4AF37]/20 bg-white/[0.04] shadow-lg shadow-[#D4AF37]/5"
                    : ""
                }`}
              >
                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    {plan.gradient && (
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <plan.icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant={plan.variant}
                  size="lg"
                  className="w-full mb-8"
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.p
          className="text-center text-sm text-gray-600 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          🔒 14-day money-back guarantee · No credit card required for Free plan · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
