"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Card from "../ui/Card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Product Manager",
    company: "Google",
    initials: "SC",
    color: "from-blue-500 to-cyan-500",
    quote:
      "CareerOS completely transformed my job search. The AI resume builder helped me land 3 interviews in the first week.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    company: "Meta",
    initials: "MJ",
    color: "from-purple-500 to-pink-500",
    quote:
      "I was skeptical about AI tools, but the interview coach feature blew me away. It simulated real interview scenarios and gave me actionable feedback. I aced my Meta interview thanks to this!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Apple",
    initials: "ER",
    color: "from-emerald-500 to-teal-500",
    quote:
      "The cover letter generator saved me hours of work. Each letter felt personalized and genuine. I got callbacks from every company I applied to. This tool is worth every penny.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "Netflix",
    initials: "DK",
    color: "from-amber-500 to-orange-500",
    quote:
      "The job tracker alone is worth the subscription. It kept my entire search organized and the analytics helped me understand what was working. Landed my dream role at Netflix in 6 weeks.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Marketing Director",
    company: "Spotify",
    initials: "AP",
    color: "from-rose-500 to-red-500",
    quote:
      "As someone transitioning careers, I needed all the help I could get. CareerOS guided me through every step — from rewriting my resume to preparing for interviews. Absolutely incredible.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const t = testimonials[current];

  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/[0.03] rounded-full blur-3xl" />

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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#00F0FF] bg-clip-text text-transparent">
              Professionals Worldwide
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            See what our users have to say about their career transformation journey.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" as const }}
                className="absolute inset-0"
              >
                <Card hover={false} className="text-center">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-[#D4AF37]/20 mx-auto mb-4" />

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]"
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                    >
                      {t.initials}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">{t.name}</p>
                      <p className="text-sm text-gray-500">
                        {t.role} at {t.company}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-[#D4AF37]"
                      : "w-2 bg-white/20 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>

            <motion.button
              className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
              onClick={() => navigate(1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
