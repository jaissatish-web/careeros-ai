"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { scoreResumeAgainstJob } from "@/lib/resume-parser";
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
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

/* ─── constants ─── */

const TONES = ["Professional", "Enthusiastic", "Confident", "Warm"] as const;
const LENGTHS = ["Short", "Medium", "Long"] as const;
type Tone = (typeof TONES)[number];
type Length = (typeof LENGTHS)[number];

const TEMPLATES = [
  { id: "classic", name: "Classic", badge: "Traditional", badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/30", accentColor: "from-gray-400 to-gray-600", description: "Timeless format trusted by recruiters" },
  { id: "modern", name: "Modern", badge: "Popular", badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", accentColor: "from-blue-500 to-cyan-400", description: "Clean layout with bold accents" },
  { id: "executive", name: "Executive", badge: "Premium", badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30", accentColor: "from-purple-500 to-pink-500", description: "Sophisticated style for senior roles" },
  { id: "minimal", name: "Minimal", badge: "Clean", badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", accentColor: "from-emerald-500 to-teal-400", description: "Simple, focused, and elegant" },
];

/* ─── keyword extraction (same logic as ats-scorer) ─── */

const TECHNICAL_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb',
  'postgresql', 'redis', 'graphql', 'rest', 'api', 'microservices', 'ci/cd',
  'git', 'agile', 'scrum', 'html', 'css', 'sass', 'tailwind', 'next.js',
  'express', 'django', 'flask', 'spring', 'laravel', 'terraform', 'jenkins',
  'linux', 'machine learning', 'deep learning', 'ai', 'data science',
  'figma', 'sketch', 'jira', 'confluence', 'security', 'testing', 'devops',
  'project management', 'leadership', 'communication', 'problem solving',
  'analytical', 'teamwork', 'collaboration', 'stakeholder management',
];

function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const found: string[] = [];

  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must',
    'work', 'worked', 'working', 'year', 'years', 'month', 'months',
    'experience', 'required', 'skills', 'ability', 'team', 'role', 'position',
    'job', 'company', 'responsible', 'responsibilities', 'requirements',
    'qualifications', 'preferred', 'strong', 'excellent', 'good', 'great',
    'opportunity', 'join', 'us', 'our', 'we', 'you', 'your', 'will',
  ]);

  const words = normalized.match(/\b[a-z][a-z0-9+#.]+/g) || [];
  const wordFreq: Record<string, number> = {};

  for (const word of words) {
    if (word.length < 3 || commonWords.has(word)) continue;
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }

  const sorted = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);

  for (const kw of TECHNICAL_KEYWORDS) {
    if (normalized.includes(kw) && !found.includes(kw)) {
      found.push(kw);
    }
  }

  for (const word of sorted) {
    if (!found.includes(word)) found.push(word);
  }

  return found.slice(0, 40);
}

/* ─── extract role and company from job description ─── */

function extractRoleAndCompany(jobDesc: string): { role: string; company: string } {
  const lines = jobDesc.split('\n').filter(l => l.trim().length > 0);

  let role = "the position";
  let company = "your company";

  // Try to find role from first few lines
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.trim();
    // Look for patterns like "Senior Software Engineer" or "at Google"
    if (cleaned.length > 3 && cleaned.length < 100) {
      if (!role || role === "the position") {
        // Remove common prefixes
        const withoutPrefix = cleaned
          .replace(/^(we are (looking|seeking|searching) for)\s+/i, '')
          .replace(/^(a |an )/i, '')
          .replace(/[:\-–—]\s*.*$/, '')
          .trim();
        if (withoutPrefix.length > 3 && withoutPrefix.length < 80) {
          role = withoutPrefix;
        }
      }
    }
  }

  // Look for company name patterns
  const companyPatterns = [
    /(?:at|@)\s+([A-Z][\w\s&.]+?)(?:\s+(?:is|are|we|as|in|,|\.))/,
    /(?:join|joined)\s+([A-Z][\w\s&.]+?)(?:\s+(?:as|in|,|\.|\-))/,
    /([A-Z][\w\s&.]+?)\s+(?:is|are)\s+(?:looking|seeking|searching|hiring)/,
  ];

  for (const pattern of companyPatterns) {
    const match = jobDesc.match(pattern);
    if (match && match[1]) {
      company = match[1].trim();
      break;
    }
  }

  // Extract from "about [Company]" patterns
  const aboutMatch = jobDesc.match(/about\s+([A-Z][\w\s&.]+?)(?:\s*[:\-])/i);
  if (aboutMatch && aboutMatch[1]) {
    company = aboutMatch[1].trim();
  }

  return { role, company };
}

/* ─── extract user info from resume ─── */

function extractResumeInfo(resumeText: string): {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experienceSummary: string[];
} {
  const info = {
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: [] as string[],
    experienceSummary: [] as string[],
  };

  // Extract email
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) info.email = emailMatch[0];

  // Extract phone
  const phoneMatch = resumeText.match(/\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4}/);
  if (phoneMatch) info.phone = phoneMatch[0];

  // Extract name (first line that looks like a name)
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.replace(/[^a\s.'-]/gi, '').trim();
    if (cleaned.length >= 2 && cleaned.length <= 50 && /\s/.test(cleaned) && !cleaned.includes('@')) {
      const words = cleaned.split(/\s+/);
      if (words.length >= 1 && words.length <= 4 && words.every(w => /^[A-Z][a-z]*$/.test(w))) {
        info.name = cleaned;
        break;
      }
    }
  }

  // Extract location patterns
  const locationMatch = resumeText.match(/(?:located?\s+(?:in|at)\s+|based\s+in\s+|address[:\s]+)([A-Z][\w\s,]+)/i);
  if (locationMatch) info.location = locationMatch[1].trim();

  // Extract skills section
  const skillsSection = resumeText.match(/(?:skills|technologies|competencies|proficiencies)[:\s]*\n([\s\S]*?)(?:\n\n|\n[A-Z][a-z]+\s[:\s]*\n|$)/i);
  if (skillsSection) {
    const skillsText = skillsSection[1];
    info.skills = skillsText
      .split(/[,•·\-\n|]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 40)
      .slice(0, 15);
  }

  // Also extract from keywords
  if (info.skills.length === 0) {
    const allKeywords = extractKeywords(resumeText);
    info.skills = allKeywords.slice(0, 10);
  }

  // Extract experience summaries
  const experienceSection = resumeText.match(/(?:experience|employment|work\s+history)[:\s]*\n([\s\S]*?)(?:\n\n(?:education|skills|projects|certifications)|$)/i);
  if (experienceSection) {
    const expLines = experienceSection[1].split('\n').map(l => l.trim()).filter(l => l.length > 10);
    info.experienceSummary = expLines.slice(0, 4);
  }

  return info;
}

/* ─── cover letter generation engine ─── */

function generateCoverLetter(
  jobDesc: string,
  resumeText: string,
  tone: Tone,
  length: Length,
  templateId: string,
): string {
  const jobKeywords = extractKeywords(jobDesc);
  const { role, company } = extractRoleAndCompany(jobDesc);
  const resumeInfo = extractResumeInfo(resumeText);

  // Determine which keywords appear in resume
  const resumeLower = resumeText.toLowerCase();
  const matchedKeywords = jobKeywords.filter(kw => resumeLower.includes(kw.toLowerCase()));
  const topKeywords = jobKeywords.slice(0, 8);
  const keywordsInLetter = topKeywords.filter(kw => resumeLower.includes(kw.toLowerCase()));

  // Tone-specific openings
  const openings: Record<Tone, string[]> = {
    Professional: [
      `Dear Hiring Manager,\n\nI am writing to express my interest in the ${role} position at ${company}. With a strong foundation in ${keywordsInLetter[0] || 'the relevant field'} and a proven track record of delivering results, I am well-prepared to contribute meaningfully to your team.`,
      `Dear Hiring Manager,\n\nI would like to formally apply for the ${role} role at ${company}. My background in ${keywordsInLetter.slice(0, 2).join(' and ') || 'this field'} aligns closely with the requirements outlined in your job description.`,
    ],
    Enthusiastic: [
      `Dear Hiring Manager,\n\nI am absolutely thrilled to apply for the ${role} position at ${company}! The opportunity to work with a team that values ${keywordsInLetter[0] || 'innovation'} is exactly what I have been looking for, and I cannot wait to bring my enthusiasm and ${keywordsInLetter.length > 1 ? keywordsInLetter[1] : 'expertise'} to your organization.`,
      `Dear Hiring Manager,\n\nWhat an incredible opportunity! I am excited to submit my application for the ${role} role at ${company}. The chance to contribute to ${keywordsInLetter.slice(0, 2).join(' and ')} initiatives at a company of your caliber fills me with genuine excitement.`,
    ],
    Confident: [
      `Dear Hiring Manager,\n\nI am the ideal candidate for the ${role} position at ${company}. My deep expertise in ${keywordsInLetter.slice(0, 2).join(' and ') || 'this domain'}, combined with a history of measurable impact, positions me to deliver value from day one.`,
      `Dear Hiring Manager,\n\nI am confident that my skills in ${keywordsInLetter.slice(0, 3).join(', ') || 'the required competencies'} make me an exceptional fit for the ${role} role at ${company}. I thrive in exactly the kind of environment your team cultivates.`,
    ],
    Warm: [
      `Dear Hiring Manager,\n\nIt brings me great pleasure to apply for the ${role} position at ${company}. I have long admired your organization's commitment to excellence, and I would be honored to contribute my background in ${keywordsInLetter[0] || 'this field'} to such a wonderful team.`,
      `Dear Hiring Manager,\n\nI am reaching out with genuine enthusiasm about the ${role} opportunity at ${company}. Your team's focus on ${keywordsInLetter.slice(0, 2).join(' and ') || 'meaningful work'} resonates deeply with my professional values.`,
    ],
  };

  // Body paragraphs based on length
  const opening = openings[tone][Math.floor(Math.random() * openings[tone].length)];

  let bodyParagraphs = "";

  if (length !== "Short") {
    bodyParagraphs = `\n\n`;
  } else {
    bodyParagraphs = `\n\n`;
  }

  // Build experience paragraph
  if (length === "Short") {
    bodyParagraphs += `My experience with ${matchedKeywords.slice(0, 3).join(', ') || 'relevant technologies'} directly addresses the core requirements of this role. I have consistently demonstrated success in delivering high-quality results under deadline-driven conditions.`;
  } else {
    bodyParagraphs += `Throughout my career, I have developed deep expertise that directly aligns with the requirements of this position. My experience spans ${matchedKeywords.slice(0, 4).join(', ') || 'key areas relevant to this role'}, and I have consistently delivered measurable results in fast-paced environments.\n`;

    if (resumeInfo.experienceSummary.length > 0) {
      bodyParagraphs += `\n${resumeInfo.experienceSummary[0]}`;
    }
  }

  // Add skills matching paragraph for Medium and Long
  if (length !== "Short" && keywordsInLetter.length > 0) {
    bodyParagraphs += `\n\n${length === "Long" ? `What sets me apart is my unique combination of technical skills and collaborative approach. I am particularly proficient in ${keywordsInLetter.slice(0, 5).join(', ')}, which I understand are central to success in the ${role} role. ` : ''}I am particularly drawn to the emphasis on ${topKeywords.filter(k => !keywordsInLetter.includes(k)).slice(0, 2).join(' and ') || 'innovation'} mentioned in your job description—qualities that mirror my professional philosophy.`;
  }

  // Additional paragraph for Long length
  if (length === "Long") {
    bodyParagraphs += `\n\nBeyond technical capabilities, I bring strong communication, problem-solving, and leadership skills that enable me to foster productive cross-functional collaboration. I am committed to continuous learning and have stayed current with emerging trends and best practices in the field. My approach combines strategic thinking with hands-on execution, ensuring that I contribute to both big-picture vision and day-to-day excellence.`;
  }

  // Add achievements if available
  if (length !== "Short" && resumeInfo.experienceSummary.length > 1) {
    bodyParagraphs += `\n\nKey highlights from my background include:\n`;
    resumeInfo.experienceSummary.slice(0, 3).forEach(exp => {
      bodyParagraphs += `\n${exp.startsWith('•') || exp.startsWith('-') ? '' : '• '}${exp}`;
    });
  }

  // Closing paragraphs based on tone
  const closings: Record<Tone, string> = {
    Professional: `\n\nI would welcome the opportunity to discuss how my qualifications and experience can contribute to ${company}'s continued success. Thank you for considering my application.`,
    Enthusiastic: `\n\nI would love the chance to discuss how my passion and skills can drive real impact at ${company}. I am incredibly excited about the possibility of joining your team and contributing to something truly special.`,
    Confident: `\n\nI am confident that I can hit the ground running and deliver immediate value to your team. I look forward to the opportunity to discuss how my expertise aligns with ${company}'s goals.`,
    Warm: `\n\nI would be truly grateful for the opportunity to discuss how my background and values align with ${company}. I look forward to the possibility of becoming part of your wonderful team.`,
  };

  bodyParagraphs += closings[tone];

  // Sign-off closings
  const signoffs: Record<Tone, string> = {
    Professional: "\n\nSincerely,",
    Enthusiastic: "\n\nWith great excitement,",
    Confident: "\n\nBest regards,",
    Warm: "\n\nWith warm regards,",
  };

  bodyParagraphs += signoffs[tone];

  // Signature
  if (resumeInfo.name) {
    bodyParagraphs += `\n${resumeInfo.name}`;
    if (resumeInfo.email) bodyParagraphs += `\n${resumeInfo.email}`;
    if (resumeInfo.phone) bodyParagraphs += `\n${resumeInfo.phone}`;
    if (resumeInfo.location) bodyParagraphs += `\n${resumeInfo.location}`;
  } else {
    bodyParagraphs += `\n[Your Name]`;
    if (resumeInfo.email) bodyParagraphs += `\n${resumeInfo.email}`;
    if (resumeInfo.phone) bodyParagraphs += `\n${resumeInfo.phone}`;
    if (resumeInfo.location) bodyParagraphs += `\n${resumeInfo.location}`;
  }

  return opening + bodyParagraphs;
}

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

/* ─── score gauge component ─── */

function ScoreGauge({ score }: { score: number }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorClass =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-blue-400"
      : score >= 40
      ? "text-amber-400"
      : "text-red-400";

  const gradientId = `gauge-${score}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={score >= 60 ? "#3b82f6" : "#f59e0b"} />
            <stop offset="100%" stopColor={score >= 80 ? "#10b981" : score >= 60 ? "#8b5cf6" : "#ef4444"} />
          </linearGradient>
        </defs>
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={`url(#${gradientId})`}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Match</span>
      </div>
    </div>
  );
}

/* ─── REVEAL animation ─── */

const REVEAL = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ─── main page ─── */

export default function CoverLetterPage() {
  /* ── state ── */
  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [jobKeywords, setJobKeywords] = useState<string[]>([]);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  /* ── Generated cover letter text (reactive) ── */
  const generatedText = useMemo(() => {
    if (!generated || !jobDesc.trim()) return "";
    return coverLetter;
  }, [generated, coverLetter, jobDesc]);

  /* ── handlers ── */

  const handleGenerate = useCallback(() => {
    if (!jobDesc.trim()) return;

    setHasGenerated(true);
    setGenerated(false);
    setGenerating(true);
    setMatchScore(null);
    setCoverLetter("");

    // Extract keywords from job description
    const keywords = extractKeywords(jobDesc);
    setJobKeywords(keywords);

    // Calculate match score using the ATS scorer
    const atsScore = scoreResumeAgainstJob(resumeText, jobDesc);
    setMatchScore(atsScore.overallScore);

    // Determine matched/missing keywords
    const resumeLower = resumeText.toLowerCase();
    const matched = keywords.filter(kw => resumeLower.includes(kw.toLowerCase()));
    const missing = keywords.filter(kw => !resumeLower.includes(kw.toLowerCase()));
    setMatchedKeywords(matched);
    setMissingKeywords(missing);

    // Simulate generation delay
    setTimeout(() => {
      const letter = generateCoverLetter(
        jobDesc,
        resumeText,
        tone,
        length,
        selectedTemplate,
      );
      setCoverLetter(letter);
      setGenerated(true);
      setGenerating(false);
    }, 1500 + Math.random() * 1000);
  }, [jobDesc, resumeText, tone, length, selectedTemplate]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [coverLetter]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [coverLetter]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  /* ── Live keyword extraction on input ── */
  useEffect(() => {
    if (jobDesc.trim().length > 20) {
      const keywords = extractKeywords(jobDesc);
      setJobKeywords(keywords);
    } else {
      setJobKeywords([]);
    }
  }, [jobDesc]);

  /* ── Compute live match score indicator ── */
  const liveMatchPreview = useMemo(() => {
    if (!jobDesc.trim() || !resumeText.trim()) return null;
    const score = scoreResumeAgainstJob(resumeText, jobDesc);
    return score.overallScore;
  }, [jobDesc, resumeText]);

  /* ── Highlight keywords in cover letter text ── */
  const highlightLetter = useMemo(() => {
    if (!coverLetter || !jobKeywords.length) return coverLetter;

    let highlighted = coverLetter;
    const sortedKeywords = [...jobKeywords].sort((a, b) => b.length - a.length);

    return highlighted;
  }, [coverLetter, jobKeywords]);

  /* ── Render ── */
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
            Paste your job description and resume. Our AI extracts keywords,
            generates a personalized cover letter, and shows how well it matches.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a href="#generator">
              <Button variant="primary" size="lg">
                <Sparkles className="w-5 h-5" />
                Generate Your Letter
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — GENERATOR
      ═══════════════════════════════════════════ */}
      <section id="generator" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={REVEAL}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Create Your{" "}
              <span className="text-gradient">Cover Letter</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Fill in the fields below, select your preferences, and generate a
              personalized cover letter optimized for the job.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ── LEFT COLUMN — INPUTS ── */}
            <div className="space-y-6">
              {/* Job Description */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={1}
              >
                <Card hover={false}>
                  <label className="text-sm font-semibold text-gray-300 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Job Description
                    <span className="text-red-400 text-xs">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Paste the full job description including requirements and responsibilities.
                  </p>
                  <textarea
                    className="w-full min-h-[220px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    placeholder={`We are looking for a Senior Software Engineer to join our team at Google.\n\nRequirements:\n- 5+ years of experience with Python, TypeScript, and cloud platforms (AWS/GCP)\n- Strong background in distributed systems and microservices\n- Experience with Kubernetes, Docker, CI/CD pipelines\n- Excellent communication and problem-solving skills\n- Bachelor's degree in Computer Science or related field\n\nPreferred:\n- Experience with machine learning frameworks (TensorFlow/PyTorch)\n- Knowledge of Go or Rust`}
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                  {/* Keyword extraction display */}
                  <AnimatePresence>
                    {jobKeywords.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/[0.06]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Search className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs font-medium text-gray-400">
                            Extracted Keywords ({jobKeywords.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {jobKeywords.slice(0, 15).map((kw) => {
                            const isMatched = resumeText.toLowerCase().includes(kw.toLowerCase());
                            return (
                              <span
                                key={kw}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                                  isMatched
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                    : "bg-blue-500/10 text-blue-400/80 border border-blue-500/15"
                                }`}
                              >
                                {kw}
                                {isMatched && <CheckCircle2 className="w-3 h-3 inline ml-0.5 -mt-0.5" />}
                              </span>
                            );
                          })}
                          {jobKeywords.length > 15 && (
                            <span className="px-2 py-0.5 text-[11px] text-gray-500">
                              +{jobKeywords.length - 15} more
                            </span>
                          )}
                        </div>
                        {resumeText.trim() && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <div className="h-1.5 flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                                style={{
                                  width: `${liveMatchPreview ?? 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-medium text-gray-400">
                              {liveMatchPreview ?? 0}% match
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Resume / Skills */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={2}
              >
                <Card hover={false}>
                  <label className="text-sm font-semibold text-gray-300 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    Resume or Skills
                    <span className="text-amber-400 text-xs">(Optional)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Paste your resume, or list your key skills and experience.
                  </p>
                  <textarea
                    className="w-full min-h-[160px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    placeholder={`Quick Summary:\n• 5 years of full-stack development experience\n• Proficient in TypeScript, React, Node.js, AWS\n• Built microservices serving 10M+ users\n• Led cross-functional teams of 8 engineers\n\nOr paste your full resume text here...`}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </Card>
              </motion.div>

              {/* Tone & Length Selectors */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={3}
              >
                <Card hover={false}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Tone */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
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

                    {/* Length */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
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
                </Card>
              </motion.div>

              {/* Template Selector */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={4}
              >
                <Card hover={false}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Template
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl.id)}
                        className={`relative p-3 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                          selectedTemplate === tmpl.id
                            ? "border-blue-500/40 bg-blue-500/10"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className={`w-full h-1 rounded-full bg-gradient-to-r ${tmpl.accentColor} mb-2`} />
                        <span className="text-xs font-semibold text-gray-300">{tmpl.name}</span>
                        {selectedTemplate === tmpl.id && (
                          <CheckCircle2 className="absolute top-2 right-2 w-3.5 h-3.5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Generate Button */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={5}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={!jobDesc.trim() || generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : generated ? (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Regenerate Letter
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
                {!jobDesc.trim() && (
                  <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Paste a job description to get started
                  </p>
                )}
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN — PREVIEW ── */}
            <div className="space-y-6" ref={previewRef}>
              {/* Match Score */}
              <AnimatePresence>
                {matchScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card hover={false}>
                      <div className="flex items-center gap-6">
                        <ScoreGauge score={matchScore} />
                        <div className="flex-1 space-y-2">
                          <h3 className="text-sm font-semibold text-gray-300">Keyword Match Score</h3>
                          <p className="text-xs text-gray-500">
                            {matchScore >= 80
                              ? "Excellent! Your resume strongly matches the job requirements."
                              : matchScore >= 60
                              ? "Good match. Consider adding a few more relevant keywords."
                              : matchScore >= 40
                              ? "Fair match. Try incorporating more skills from the job posting."
                              : "Needs improvement. Your resume is missing many key terms."}
                          </p>
                          <div className="flex gap-2 flex-wrap mt-1">
                            {matchedKeywords.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                {matchedKeywords.length} matched
                              </span>
                            )}
                            {missingKeywords.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px] text-amber-400 font-medium">
                                <Target className="w-3 h-3" />
                                {missingKeywords.length} to add
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contrast: matched vs missing keywords */}
                      {missingKeywords.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                            Keywords not in your resume
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {missingKeywords.slice(0, 10).map((kw) => (
                              <span
                                key={kw}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-500/10 text-red-400/80 border border-red-500/15"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cover Letter Preview */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={2}
              >
                <Card className="relative" hover={false}>
                  {/* decorative top */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50" />

                  {/* Header with actions */}
                  <div className="flex items-center justify-between mb-4 gap-3">
                    <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2 flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      {generated
                        ? `Cover Letter — ${tone} · ${length}`
                        : "Preview"}
                    </h3>

                    <div className="flex items-center gap-1.5">
                      {generated && (
                        <>
                          <motion.button
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleCopy}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleDownload}
                          >
                            <Download className="w-3.5 h-3.5" />
                            .txt
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleRegenerate}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Letter content */}
                  <div className="relative rounded-xl bg-white/[0.02] border border-white/[0.04] p-6 md:p-8 min-h-[400px]">
                    <AnimatePresence mode="wait">
                      {generating ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-32"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                            <Sparkles className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <p className="text-sm text-gray-500 mt-6 text-center">
                            Analyzing job description and crafting your letter...
                          </p>
                          <div className="flex gap-2 mt-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 animate-bounce" style={{ animationDelay: "200ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-bounce" style={{ animationDelay: "400ms" }} />
                          </div>
                        </motion.div>
                      ) : generated ? (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {/* Keywords highlighted inline */}
                          <div className="mb-4 flex flex-wrap gap-1">
                            {jobKeywords
                              .filter(kw =>
                                coverLetter.toLowerCase().includes(kw.toLowerCase())
                              )
                              .slice(0, 8)
                              .map((kw) => (
                                <span
                                  key={kw}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                >
                                  ✓ {kw}
                                </span>
                              ))}
                          </div>
                          <TypingText
                            text={coverLetter}
                            speed={3}
                            startTyping={generated}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-24 text-center"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Your generated cover letter will appear here
                          </p>
                          <p className="text-xs text-gray-700 max-w-xs">
                            Fill in the job description and click &quot;Generate Cover Letter&quot; to create your personalized letter
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer info */}
                  {generated && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-gray-600"
                    >
                      <span>
                        {coverLetter.split(/\s+/).length} words · {coverLetter.length} characters
                      </span>
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — WHAT MAKES A GREAT COVER LETTER
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
              Tips for a{" "}
              <span className="text-gradient">Winning Cover Letter</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our AI follows best practices to ensure your cover letter makes an impact.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-5 h-5" />,
                title: "Tailor Every Letter",
                desc: "Never use a generic template. Each letter should reference specific requirements and keywords from the job posting.",
                color: "text-blue-400",
                bg: "from-blue-500/20 to-blue-600/10",
              },
              {
                icon: <Hash className="w-5 h-5" />,
                title: "Match Keywords",
                desc: "Incorporate key terms from the job description naturally. This helps pass ATS filters and catches recruiters' attention.",
                color: "text-purple-400",
                bg: "from-purple-500/20 to-purple-600/10",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Lead with Impact",
                desc: "Start with enthusiasm and a clear statement of value. Show how your skills translate to their specific needs.",
                color: "text-amber-400",
                bg: "from-amber-500/20 to-amber-600/10",
              },
              {
                icon: <BookOpen className="w-5 h-5" />,
                title: "Tell a Story",
                desc: "Connect your experiences to the role in a narrative way. Make it memorable while staying professional.",
                color: "text-cyan-400",
                bg: "from-cyan-500/20 to-cyan-600/10",
              },
              {
                icon: <Mail className="w-5 h-5" />,
                title: "Strong Opening & Close",
                desc: "Your first and last sentences matter most. Open with energy and close with a clear call to action.",
                color: "text-emerald-400",
                bg: "from-emerald-500/20 to-emerald-600/10",
              },
              {
                icon: <User className="w-5 h-5" />,
                title: "Personalize the Tone",
                desc: "Match the company culture. A startup might want more energy; a law firm needs formality. Adjust accordingly.",
                color: "text-red-400",
                bg: "from-red-500/20 to-red-600/10",
              },
            ].map((tip, i) => (
              <motion.div
                key={tip.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={i + 1}
              >
                <Card className="h-full" hover={false}>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tip.bg} flex items-center justify-center mb-3 ${tip.color}`}
                  >
                    {tip.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-gray-200">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tip.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — SAMPLE COVER LETTERS
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
              Generated{" "}
              <span className="text-gradient">Examples</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See how our AI crafts different styles of cover letters for various roles.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEMPLATES.map((tmpl, i) => (
              <motion.div
                key={tmpl.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={REVEAL}
                custom={i + 1}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-5 h-full hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300">
                  <div className={`w-full h-1 rounded-full bg-gradient-to-r ${tmpl.accentColor} mb-3`} />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-200">{tmpl.name}</h3>
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{tmpl.description}</p>
                  <div className="mt-4 pt-3 border-t border-white/[0.04] space-y-1.5">
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${tmpl.accentColor} opacity-60 w-3/4`} />
                    <div className="h-1 rounded-full bg-white/[0.05] w-full" />
                    <div className="h-1 rounded-full bg-white/[0.05] w-5/6" />
                    <div className="h-1 rounded-full bg-white/[0.05] w-2/3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — CTA
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
                  AI-powered cover letters. It&apos;s free to start.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="primary" size="lg" as-child>
                    <a href="#generator">
                      <Sparkles className="w-5 h-5" />
                      Start Generating — It&apos;s Free
                    </a>
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
