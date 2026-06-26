"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  FileText,
  Sparkles,
  Download,
  File,
  Copy,
  Check,
  Search,
  Palette,
  Zap,
  Layers,
  Target,
  BookOpen,
  Briefcase,
  Brain,
  TrendingUp,
  ChevronDown,
  Loader2,
} from "lucide-react";

/* ─── constants ─── */

const TONES = ["Professional", "Enthusiastic", "Confident", "Warm"] as const;
const LENGTHS = ["Short", "Medium", "Long"] as const;
type Tone = (typeof TONES)[number];
type Length = (typeof LENGTHS)[number];

const SAMPLE_ROLES = [
  {
    role: "Software Engineer",
    company: "Google",
    icon: <Brain className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at Google. With over 5 years of experience building scalable distributed systems and a deep passion for solving complex technical challenges, I am excited about the opportunity to contribute to Google's mission of organizing the world's information.

In my current role at Tech Corp, I led the migration of a monolithic architecture to microservices, resulting in a 40% improvement in system reliability and a 60% reduction in deployment time. I have extensive experience with Python, Go, and Kubernetes, and I thrive in collaborative environments that value innovation and engineering excellence.

What excites me most about this role is the opportunity to work on products that impact billions of users worldwide. my experience optimizing high-throughput data pipelines and my background in machine learning make me uniquely suited to contribute to your team from day one.

I would welcome the opportunity to discuss how my technical expertise and passion for building exceptional products can contribute to Google's continued success.

Sincerely,
Alex Johnson`,
  },
  {
    role: "Product Manager",
    company: "Meta",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    content: `Dear Hiring Manager,

I am thrilled to apply for the Product Manager position at Meta. With a proven track record of launching products that have reached over 10 million users and generated $50M+ in revenue, I am eager to bring my strategic vision and user-centric approach to the team building the next generation of social experiences.

At my current company, I spearheaded the development of a new marketplace feature that increased user engagement by 35% and reduced churn by 20%. I excel at synthesizing user research, data analytics, and business strategy into compelling product roadmaps that align cross-functional teams around shared goals.

Meta's commitment to connecting people through innovative technology deeply resonates with my professional values. I am particularly drawn to the opportunity to shape products that foster meaningful connections while navigating the complex landscape of privacy and user trust.

I am excited about the possibility of contributing to Meta's mission and would love to discuss how my experience can drive impactful outcomes for your team.

Best regards,
Sarah Chen`,
  },
  {
    role: "Data Scientist",
    company: "Netflix",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-red-500 to-orange-500",
    content: `Dear Hiring Manager,

I am excited to apply for the Data Scientist position at Netflix. With a Ph.D. in Machine Learning and three years of experience building recommendation systems that improved user retention by 25%, I am passionate about leveraging data to create exceptional user experiences.

At my current role, I developed a deep learning model for content personalization that achieved a 30% improvement in click-through rates. My expertise spans Python, TensorFlow, PyTorch, and SQL, with particular strength in NLP and computer vision applications.

Netflix's data-driven approach to content creation and personalization is truly inspiring. The opportunity to work with one of the world's richest entertainment datasets and contribute to algorithms that shape how millions discover content is exactly the challenge I am seeking.

I would be thrilled to bring my analytical rigor and creative problem-solving skills to Netflix's world-class data science team.

Warm regards,
Dr. Michael Rivera`,
  },
];

const FEATURES = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Job Description Analysis",
    description:
      "AI parses job postings to identify key requirements, skills, and keywords that matter most.",
    color: "text-blue-400",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Writing",
    description:
      "Advanced GPT models craft personalized, compelling cover letters tailored to each role.",
    color: "text-purple-400",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Tone Customization",
    description:
      "Choose from Professional, Enthusiastic, Confident, or Warm tones to match your personality.",
    color: "text-cyan-400",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "One-Click Export",
    description:
      "Download your cover letter as PDF, DOCX, or copy to clipboard instantly.",
    color: "text-green-400",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Multiple Templates",
    description:
      "Select from a variety of professionally designed formats for different industries.",
    color: "text-orange-400",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Keyword Optimization",
    description:
      "Automatically integrates ATS-friendly keywords to pass applicant tracking systems.",
    color: "text-red-400",
  },
];

const REVEAL = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ─── animated typing text ─── */

function TypingText({
  text,
  speed = 8,
  startTyping,
}: {
  text: string;
  speed?: number;
  startTyping: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!startTyping) {
      setDisplayed("");
      idx.current = 0;
      return;
    }
    if (idx.current >= text.length) return;
    const id = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, startTyping]);

  return (
    <pre className="whitespace-pre-wrap font-body text-sm md:text-base leading-relaxed text-gray-300 min-h-[200px]">
      {displayed}
      {startTyping && displayed.length < text.length && (
        <span className="inline-block w-0.5 h-5 bg-blue-400 ml-0.5 animate-typing-blink align-middle" />
      )}
    </pre>
  );
}

/* ─── main page ─── */

export default function CoverLetterPage() {
  /* ── state ── */
  const [jobDesc, setJobDesc] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSample, setActiveSample] = useState<number | null>(null);

  /* refs for scroll-to */
  const generatorRef = useRef<HTMLDivElement>(null);

  /* ── derived ── */
  const extractedRequirements = analyzed
    ? [
        "3+ years of relevant industry experience",
        "Strong communication and collaboration skills",
        "Proficiency with modern tools and frameworks",
        "Problem-solving and analytical thinking",
        "Experience in cross-functional team environments",
      ]
    : [];

  const coverLetterText = `Dear Hiring Manager,

I am writing to express my enthusiasm for the ${analyzed ? "position" : "role"} at your esteemed organization. ${tone === "Enthusiastic" ? "I am absolutely thrilled about this opportunity!" : tone === "Confident" ? "I am confident that my skills make me an ideal candidate." : tone === "Warm" ? "It brings me great joy to apply for this position." : "I am writing to formally apply for this position."}

${length !== "Short" ? `Throughout my career, I have consistently delivered results by combining technical expertise with a genuine passion for excellence. I have successfully led initiatives that drove measurable business impact, and I thrive in environments that value innovation and collaboration.\n\n` : ""}My background aligns closely with the ${(length === "Long" ? "comprehensive " : "")}requirements outlined in your job description. I bring a unique combination of ${(length === "Long" ? "technical proficiency, strategic thinking, and " : "")}interpersonal skills that enable me to contribute effectively from day one.

${length === "Long" ? "What distinguishes my approach is my commitment to continuous learning and my ability to adapt quickly to evolving challenges. I have a track record of identifying opportunities for improvement and implementing solutions that drive meaningful results.\n\n" : ""}I would welcome the opportunity to discuss how my ${(length === "Long" ? "extensive " : "")}experience and ${(length === "Long" ? "dedication to excellence " : "skills ")}can contribute to your team's continued success.

${tone === "Warm" ? "With warm regards" : tone === "Enthusiastic" ? "With great excitement" : "Sincerely"},
[Your Name]`;

  /* ── handlers ── */
  const handleAnalyze = useCallback(() => {
    if (!jobDesc.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1800);
  }, [jobDesc]);

  const handleGenerate = useCallback(() => {
    setGenerated(false);
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(coverLetterText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [coverLetterText]);

  const scrollToGenerator = useCallback(() => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ── render ── */
  return (
    <div className="relative min-h-screen bg-space-black-950 text-white overflow-hidden">
      {/* ── background orbs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="gradient-orb gradient-orb-blue w-[600px] h-[600px] -top-48 -left-48 animate-orb-float-1 opacity-30" />
        <div
          className="gradient-orb gradient-orb-purple w-[500px] h-[500px] top-1/3 -right-48 animate-orb-float-2 opacity-25"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="gradient-orb gradient-orb-cyan w-[400px] h-[400px] bottom-0 left-1/3 animate-orb-float-3 opacity-20"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Navbar />

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
              <BookOpen className="w-4 h-4 text-blue-400" />
              AI-Powered Cover Letters
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Cover Letters That{" "}
            <span className="text-gradient-animated">
              Get You Interviews
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Paste any job description and let our AI craft a personalized,
            ATS-optimized cover letter in seconds. Customize tone, length, and
            export with one click.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="primary" size="lg" onClick={scrollToGenerator}>
              <Sparkles className="w-5 h-5" />
              Generate Your Letter
            </Button>
            <Button variant="outline" size="lg">
              See Examples
              <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — JOB DESCRIPTION ANALYZER
      ═══════════════════════════════════════════ */}
      <section
        ref={generatorRef}
        className="relative py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={REVEAL}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Job Description{" "}
              <span className="text-gradient">Analyzer</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Paste the job posting below. Our AI will extract key
              requirements, skills, and keywords.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* textarea */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={REVEAL}
              custom={1}
            >
              <Card className="h-full flex flex-col" hover={false}>
                <label className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Job Description
                </label>
                <textarea
                  className="flex-1 min-h-[250px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  placeholder="Paste the full job description here...&#10;&#10;e.g. We are looking for a Senior Software Engineer with 5+ years of experience in..."
                  value={jobDesc}
                  onChange={(e) => {
                    setJobDesc(e.target.value);
                    if (analyzed) setAnalyzed(false);
                  }}
                />
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  onClick={handleAnalyze}
                  disabled={!jobDesc.trim() || analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze Requirements
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>

            {/* extracted requirements */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={REVEAL}
              custom={2}
            >
              <Card className="h-full" hover={false}>
                <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Extracted Requirements
                </h3>

                <AnimatePresence mode="wait">
                  {!analyzed ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[250px] text-gray-600"
                    >
                      <Search className="w-10 h-10 mb-3 opacity-40" />
                      <p className="text-sm">
                        Paste a job description to see extracted requirements
                      </p>
                    </motion.div>
                  ) : (
                    <motion.ul
                      key="list"
                      className="space-y-3"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                    >
                      {extractedRequirements.map((req, i) => (
                        <motion.li
                          key={req}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.4 },
                            },
                          }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
                        >
                          <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-300">{req}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — AI-GENERATED COVER LETTER
      ═══════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={REVEAL}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              AI-Generated{" "}
              <span className="text-gradient">Cover Letter</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Your personalized cover letter, crafted instantly by AI with
              configurable tone and length.
            </p>
          </motion.div>

          {/* ── Customization Controls ── */}
          <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={REVEAL}
            custom={1}
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="grid md:grid-cols-[auto_1fr] gap-8">
                {/* Tone selector */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Tone
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                          tone === t
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20"
                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length selector */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Length
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLength(l)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                          length === l
                            ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20"
                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Cover Letter Card ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={REVEAL}
            custom={2}
          >
            <Card className="relative" hover={false}>
              {/* decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Generated Cover Letter — {tone} · {length}
                </h3>

                {/* ── Export buttons ── */}
                <div className="flex items-center gap-2">
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all text-nowrap"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    title="Export PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all text-nowrap"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    title="Export DOCX"
                  >
                    <File className="w-3.5 h-3.5" />
                    DOCX
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all text-nowrap"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* letter body */}
              <div className="relative rounded-xl bg-white/[0.02] border border-white/[0.04] p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {generating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                      <p className="text-sm text-gray-500">
                        Crafting your personalized cover letter…
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TypingText
                        text={coverLetterText}
                        speed={4}
                        startTyping={generated}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Generate button */}
              <div className="mt-6 flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — FEATURES
      ═══════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={REVEAL}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Everything You Need to{" "}
              <span className="text-gradient">Stand Out</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Powerful features that make your cover letter impossible to
              ignore.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={i + 1}
              >
                <Card className="h-full flex flex-col">
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4 ${f.color}`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {f.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — SAMPLE COVER LETTERS
      ═══════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={REVEAL}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Sample Cover{" "}
              <span className="text-gradient">Letters</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See what our AI generates for different roles. Click to read the
              full letter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_ROLES.map((sample, i) => (
              <motion.div
                key={sample.role}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={i + 1}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sample.color} flex items-center justify-center text-white`}
                    >
                      {sample.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold leading-tight">
                        {sample.role}
                      </h3>
                      <p className="text-xs text-gray-500">{sample.company}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-4 flex-1 mb-4">
                    {sample.content.slice(0, 200)}…
                  </p>

                  <button
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer text-left flex items-center gap-1 mt-auto"
                    onClick={() =>
                      setActiveSample(activeSample === i ? null : i)
                    }
                  >
                    <BookOpen className="w-4 h-4" />
                    {activeSample === i ? "Close" : "Read full letter"}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${activeSample === i ? "rotate-180" : ""}`}
                    />
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* expanded sample */}
          <AnimatePresence>
            {activeSample !== null && (
              <motion.div
                key="sample-expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" as const }}
                className="overflow-hidden"
              >
                <Card className="mt-6 !bg-white/[0.03]" hover={false}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${SAMPLE_ROLES[activeSample].color} flex items-center justify-center text-white`}
                    >
                      {SAMPLE_ROLES[activeSample].icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {SAMPLE_ROLES[activeSample].role} at{" "}
                        {SAMPLE_ROLES[activeSample].company}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Full AI-generated cover letter
                      </p>
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-gray-300">
                    {SAMPLE_ROLES[activeSample].content}
                  </pre>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — CTA
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            {/* card background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="relative border border-white/10 rounded-3xl p-10 md:p-16 text-center">
              {/* orbs */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
                  Ready to Write Your{" "}
                  <span className="text-gradient-animated">
                    Dream Cover Letter?
                  </span>
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto mb-8 text-lg">
                  Join 50,000+ job seekers who landed interviews with
                  AI-powered cover letters. It's free to start.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="primary" size="lg" as-child>
                    <Link href="#">
                      <Sparkles className="w-5 h-5" />
                      Start Generating — It's Free
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Briefcase className="w-5 h-5" />
                    View Pricing
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
