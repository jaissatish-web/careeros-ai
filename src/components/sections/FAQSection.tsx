"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Card from "../ui/Card";

const faqs = [
  {
    question: "How does the AI resume builder work?",
    answer:
      "Our AI resume builder analyzes your experience, skills, and target job descriptions to create a perfectly tailored resume. It optimizes for ATS systems, suggests powerful action verbs, and formats everything professionally. Simply input your details and let our AI do the heavy lifting.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We use enterprise-grade encryption (AES-256) to protect all your data. Your resumes, personal information, and job search data are never shared with third parties. You can delete your data at any time with a single click. We're fully GDPR and CCPA compliant.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! You can cancel your subscription at any time with no questions asked. If you cancel within the first 14 days, you'll receive a full refund. After cancellation, you'll continue to have access to your plan features until the end of your billing period.",
  },
  {
    question: "How accurate is the ATS optimization?",
    answer:
      "Our ATS optimization engine is trained on data from over 1 million successful job applications. It achieves a 98% ATS compatibility rate across major systems including Workday, Greenhouse, Lever, and Taleo. We continuously update our algorithms as ATS systems evolve.",
  },
  {
    question: "Do you offer team or enterprise plans?",
    answer:
      "Yes! Our Enterprise plan is designed for teams, career coaches, and staffing agencies. It includes team management, white-label options, API access, and a dedicated account manager. Contact us for custom pricing if you need more than 10 seats.",
  },
  {
    question: "What AI models power CareerOS?",
    answer:
      "CareerOS is powered by the latest GPT-4o and Claude models, fine-tuned specifically for career-related tasks. Our proprietary AI has been trained on millions of successful resumes, cover letters, and interview responses to provide the most relevant and effective guidance.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <motion.button
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
        onClick={onClick}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <span
          className={`text-base font-medium pr-4 transition-colors duration-200 ${
            isOpen ? "text-white" : "text-gray-400 group-hover:text-gray-200"
          }`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" as const }}
          className="shrink-0"
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors ${
              isOpen ? "text-[#D4AF37]" : "text-gray-600"
            }`}
          />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" as const }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-gray-500 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32 bg-black">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#D4AF37]/[0.02] rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-medium text-[#F6E27A] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#00F0FF] bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Everything you need to know about CareerOS. Can't find what you're looking for?
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support →
            </motion.a>
          </motion.div>

          {/* Right: FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card hover={false}>
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
