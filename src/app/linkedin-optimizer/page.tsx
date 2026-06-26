"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  FileText,
  Award,
  BarChart3,
  Star,
  ChevronRight,
  Brain,
  Shield,
  Rocket,
  Copy,
  Check,
  RefreshCw,
  Search,
  Lightbulb,
  Link2,
  Clipboard,
  XCircle,
  Info,
} from "lucide-react";
import { scoreResumeAgainstJob } from "@/lib/resume-parser";
import type { ATSScore } from "@/lib/resume-parser";

/* ==========================================================================
   Types
   ========================================================================== */

interface HeadlineSuggestion {
  text: string;
  keywords: string[];
  impactScore: number;
}

interface AboutSection {
  content: string;
  highlights: string[];
}

interface AnalysisResult {
  atsScore: ATSScore;
  profileStrength: number;
  headlines: HeadlineSuggestion[];
  aboutSection: AboutSection;
  matchedKeywords: string[];
  missingKeywords: string[];
  completenessBreakdown: { label: string; score: number; maxScore: number }[];
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

function extractNameFromProfile(profileText: string): string {
  const lines = profileText.trim().split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 60 && !firstLine.includes("@") && !firstLine.includes("http")) {
      return firstLine;
    }
  }
  return "Professional";
}

function extractCurrentHeadline(profileText: string): string {
  const lines = profileText.trim().split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 1) {
    const secondLine = lines[1].trim();
    if (secondLine.length < 120) return secondLine;
  }
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 120 && !firstLine.includes("@")) return firstLine;
  }
  return "";
}

function extractSkillsFromProfile(profileText: string): string[] {
  const skillPatterns = [
    /skills?[:\s]*(.+)/i,
    /technologies?[:\s]*(.+)/i,
    /tech stack[:\s]*(.+)/i,
    /proficient in[:\s]*(.+)/i,
  ];
  const skills: string[] = [];
  for (const pattern of skillPatterns) {
    const match = profileText.match(pattern);
    if (match) {
      const items = match[1].split(/[,;|•·]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
      skills.push(...items);
    }
  }
  return [...new Set(skills)].slice(0, 15);
}

function generateHeadlineSuggestions(
  profileText: string,
  jobDescription: string,
  matchedKeywords: string[]
): HeadlineSuggestion[] {
  const name = extractNameFromProfile(profileText);
  const currentHeadline = extractCurrentHeadline(profileText);
  const profileSkills = extractSkillsFromProfile(profileText);

  const jobLower = jobDescription.toLowerCase();
  const profileLower = profileText.toLowerCase();

  // Extract role/title from job description
  const rolePatterns = [
    /(?:senior|lead|principal|staff|junior|mid[- ]?level)?\s*(?:full[- ]?stack|front[- ]?end|back[- ]?end|software|data|product|project|devops|cloud|machine learning|ai)?\s*(?:engineer|developer|manager|architect|analyst|designer|consultant|specialist|director)/gi,
  ];
  const jobRoles: string[] = [];
  for (const pattern of rolePatterns) {
    const matches = jobDescription.match(pattern);
    if (matches) {
      jobRoles.push(...matches.map((m) => m.trim()));
    }
  }

  // Extract company type from job description
  const isStartup = /startup|early[- ]?stage|series [a-c]|founded/i.test(jobLower);
  const isEnterprise = /enterprise|fortune 500|large[- ]?scale|global/i.test(jobLower);

  // Get top keywords from job that are in profile
  const topKeywords = matchedKeywords.slice(0, 8);
  const techKeywords = topKeywords.filter((kw) =>
    /react|node|python|java|aws|azure|gcp|docker|kubernetes|sql|typescript|javascript|angular|vue|next|graphql|rest|api|terraform|ci\/cd|git|agile|scrum|machine learning|ai|data|figma|linux|redis|mongodb|postgresql|django|flask|spring/i.test(kw)
  );
  const softKeywords = topKeywords.filter((kw) =>
    /leadership|communication|teamwork|problem solving|analytical|collaboration|mentoring|strategic|management/i.test(kw)
  );

  // Extract years of experience
  const expMatch = profileLower.match(/(\d+)\+?\s*years?/i);
  const yearsExp = expMatch ? expMatch[1] : null;

  // Extract achievements/metrics
  const metrics = profileText.match(/\d+[\d,]*\.?\d*\s*[$%]\+|\+\d+%|\d+%|\$\d+/g) || [];

  const suggestions: HeadlineSuggestion[] = [];

  // Suggestion 1: Role + Tech Stack + Impact
  const primaryRole = jobRoles[0] || "Software Engineer";
  const techStack = techKeywords.slice(0, 4).map((k) => k.charAt(0).toUpperCase() + k.slice(1));
  if (techStack.length >= 2) {
    const techStr = techStack.join(" • ");
    const expStr = yearsExp ? `${yearsExp}+ yrs | ` : "";
    suggestions.push({
      text: `${primaryRole} | ${expStr}${techStack.slice(0, 3).join(" • ")} | ${isStartup ? "Scaling products from 0→1" : "Building solutions at scale"}`,
      keywords: techStack.slice(0, 3),
      impactScore: 92,
    });
  }

  // Suggestion 2: Value proposition focused
  const valueProps: string[] = [];
  if (metrics.length > 0) valueProps.push("Proven impact");
  if (profileSkills.length > 5) valueProps.push("Full-stack expertise");
  if (yearsExp && parseInt(yearsExp) >= 5) valueProps.push(`${yearsExp}+ years exp.`);
  if (isStartup) valueProps.push("Startup veteran");
  if (isEnterprise) valueProps.push("Enterprise scale");

  if (techKeywords.length > 0) {
    suggestions.push({
      text: `${primaryRole} ${valueProps.length > 0 ? "| " + valueProps.slice(0, 2).join(" | ") : ""} | ${techKeywords.slice(0, 4).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" · ")}`,
      keywords: techKeywords.slice(0, 4),
      impactScore: 88,
    });
  }

  // Suggestion 3: Leadership + Technical
  if (softKeywords.length > 0 || /lead|manage|team/i.test(profileLower)) {
    const leadershipTerms = softKeywords.length > 0 ? softKeywords[0].charAt(0).toUpperCase() + softKeywords[0].slice(1) : "Team leadership";
    suggestions.push({
      text: `${primaryRole} | ${leadershipTerms} | ${techKeywords.slice(0, 3).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" • ")} | ${metrics.length > 0 ? "Data-driven results" : "Delivering excellence"}`,
      keywords: [...softKeywords.slice(0, 2), ...techKeywords.slice(0, 3)],
      impactScore: 85,
    });
  }

  // Suggestion 4: Problem-solver angle
  if (techKeywords.length >= 2) {
    suggestions.push({
      text: `${techKeywords[0].charAt(0).toUpperCase() + techKeywords[0].slice(1)} Specialist | ${primaryRole} | Solving complex problems with ${techKeywords.slice(1, 3).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" & ")}`,
      keywords: techKeywords.slice(0, 3),
      impactScore: 82,
    });
  }

  // Suggestion 5: Comprehensive keyword-rich
  const allTopTech = techKeywords.slice(0, 5);
  if (allTopTech.length >= 3) {
    suggestions.push({
      text: `${primaryRole} | ${allTopTech.slice(0, 4).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" • ")} | ${isStartup ? "High-growth environments" : isEnterprise ? "Enterprise solutions" : "Scalable systems"} | ${yearsExp ? `${yearsExp}+ years` : "Experienced"}`,
      keywords: allTopTech.slice(0, 4),
      impactScore: 90,
    });
  }

  // Ensure we have at least 3 suggestions
  if (suggestions.length < 3) {
    suggestions.push({
      text: `${primaryRole} | ${matchedKeywords.slice(0, 4).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" • ")} | Open to opportunities`,
      keywords: matchedKeywords.slice(0, 4),
      impactScore: 75,
    });
  }

  return suggestions.slice(0, 5);
}

function generateAboutSection(
  profileText: string,
  jobDescription: string,
  matchedKeywords: string[]
): AboutSection {
  const name = extractNameFromProfile(profileText);
  const profileLower = profileText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract years of experience
  const expMatch = profileLower.match(/(\d+)\+?\s*years?/i);
  const yearsExp = expMatch ? expMatch[1] : null;

  // Extract role
  const roleMatch = profileText.match(/(?:senior|lead|principal|staff|junior)?\s*(?:full[- ]??stack|front[- ]?end|back[- ]?end|software|data|product|devops|cloud)?\s*(?:engineer|developer|manager|architect|analyst|designer|consultant)/i);
  const role = roleMatch ? roleMatch[0].trim() : "Professional";

  // Extract companies
  const companies: string[] = [];
  const companyPatterns = [
    /(?:at|@)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s*[,\|\-]|\s*$|\n)/m,
    /(?:worked? (?:at|for))\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s*[,\|\-]|\s*$|\n)/i,
  ];
  for (const pattern of companyPatterns) {
    const match = profileText.match(pattern);
    if (match && match[1].trim().length < 40) {
      companies.push(match[1].trim());
    }
  }

  // Extract education
  const eduMatch = profileText.match(/(?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?)[^\n,]*/i);
  const education = eduMatch ? eduMatch[0].trim() : "";

  // Extract metrics/achievements
  const metrics = profileText.match(/\d[\d,]*\.?\d*\s*[$%]\+|\+\d+%|\d+%|\$\d[\d,]*/g) || [];

  // Top keywords for the about section
  const topKeywords = matchedKeywords.slice(0, 6);
  const techKeywords = topKeywords.filter((kw) =>
    /react|node|python|java|aws|azure|docker|kubernetes|typescript|javascript|angular|vue|next|graphql|terraform|ci\/cd|redis|mongodb|postgresql|django|flask|spring/i.test(kw)
  );

  // Build the about section
  const highlights: string[] = [];
  const paragraphs: string[] = [];

  // Opening paragraph
  let opening = "";
  if (yearsExp) {
    opening = `🚀 ${role} with ${yearsExp}+ years of experience `;
  } else {
    opening = `🚀 ${role} with extensive experience `;
  }
  if (techKeywords.length > 0) {
    opening += `specializing in ${techKeywords.slice(0, 3).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(", ")}`;
  }
  opening += ".";
  if (companies.length > 0) {
    opening += ` Previously at ${companies.slice(0, 2).join(" and ")}.`;
  }
  paragraphs.push(opening);
  highlights.push("Strong opening with experience and specialization");

  // Achievement paragraph
  if (metrics.length > 0 || /increas|reduc|improv|optim|launch|ship|build|led|manag/i.test(profileLower)) {
    let achievement = "💡 ";
    const achievements: string[] = [];
    if (/led|manag/i.test(profileLower)) achievements.push("Led cross-functional teams to deliver high-impact projects");
    if (/increas/i.test(profileLower)) achievements.push("Drove measurable growth across key business metrics");
    if (/reduc|optim/i.test(profileLower)) achievements.push("Optimized systems for performance and cost efficiency");
    if (/launch|ship|build/i.test(profileLower)) achievements.push("Shipped products used by thousands of users");
    if (achievements.length === 0) achievements.push("Delivered high-quality solutions that drive business results");
    achievement += achievements.slice(0, 3).join(". ") + ".";
    paragraphs.push(achievement);
    highlights.push("Quantifiable achievements highlighted");
  }

  // Skills paragraph
  if (topKeywords.length > 0) {
    const skillsParagraph = `🎯 Core expertise: ${topKeywords.slice(0, 6).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(" • ")}. Passionate about building scalable, maintainable solutions and mentoring the next generation of professionals.`;
    paragraphs.push(skillsParagraph);
    highlights.push("Key skills prominently featured");
  }

  // Closing
  paragraphs.push(`📩 Let's connect — always excited to discuss innovative projects, collaboration opportunities, and how I can bring value to your team.\n\n#OpenToWork ${topKeywords.slice(0, 4).map((k) => "#" + k.charAt(0).toUpperCase() + k.slice(1).replace(/[\s\/]/g, "")).join(" ")}`);
  highlights.push("Clear call-to-action with relevant hashtags");

  return {
    content: paragraphs.join("\n\n"),
    highlights,
  };
}

function calculateProfileStrength(
  profileText: string,
  atsScore: ATSScore
): { total: number; breakdown: { label: string; score: number; maxScore: number }[] } {
  const breakdown: { label: string; score: number; maxScore: number }[] = [];
  const profileLower = profileText.toLowerCase();

  // Headline quality (max 15)
  const headlineScore = Math.min(15, (() => {
    let s = 5;
    if (profileText.length > 20) s += 2;
    if (/\|/.test(profileText)) s += 2;
    if (/\b(senior|lead|principal|staff|architect|manager)\b/i.test(profileLower)) s += 2;
    if (/\b(react|node|python|aws|java|typescript)\b/i.test(profileLower)) s += 2;
    if (/\b(building|creating|leading|driving|scaling)\b/i.test(profileLower)) s += 2;
    return s;
  })());
  breakdown.push({ label: "Headline", score: headlineScore, maxScore: 15 });

  // About/Summary quality (max 20)
  const aboutScore = Math.min(20, (() => {
    let s = 5;
    const aboutMatch = profileText.match(/(?:summary|about|profile)[:\s]*(.{10,})/i);
    const aboutText = aboutMatch ? aboutMatch[1] : profileText;
    if (aboutText.length > 100) s += 3;
    if (aboutText.length > 250) s += 3;
    if (/\d/.test(aboutText)) s += 3;
    if (/[🚀💡🎯🔥✨]/.test(aboutText)) s += 2;
    if (/\b(years?|experience|specializ|expertise|passion)\b/i.test(aboutText)) s += 2;
    if (/#\w+/.test(aboutText)) s += 2;
    return s;
  })());
  breakdown.push({ label: "About Section", score: aboutScore, maxScore: 20 });

  // Experience detail (max 25)
  const expScore = Math.min(25, (() => {
    let s = 5;
    if (/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\.?\s*\d{4}/i.test(profileText)) s += 5;
    if (/[•\-*]\s/.test(profileText)) s += 5;
    if (/\d+[\d,]*\.?\d*\s*[$%+]|\d+%/.test(profileText)) s += 5;
    if (/\b(led|managed|developed|created|implemented|designed|built|increased|reduced|improved|optimized)\b/i.test(profileLower)) s += 5;
    return s;
  })());
  breakdown.push({ label: "Experience", score: expScore, maxScore: 25 });

  // Skills section (max 20)
  const skillsScore = Math.min(20, (() => {
    let s = 5;
    const skills = extractSkillsFromProfile(profileText);
    if (skills.length >= 3) s += 5;
    if (skills.length >= 7) s += 5;
    if (skills.length >= 10) s += 5;
    return s;
  })());
  breakdown.push({ label: "Skills", score: skillsScore, maxScore: 20 });

  // Contact info (max 10)
  const contactScore = Math.min(10, (() => {
    let s = 0;
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(profileText)) s += 3;
    if (/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(profileText)) s += 2;
    if (/linkedin\.com/i.test(profileLower)) s += 3;
    if (/github\.com/i.test(profileLower)) s += 2;
    return s;
  })());
  breakdown.push({ label: "Contact Info", score: contactScore, maxScore: 10 });

  // ATS compatibility (max 10)
  const atsCompatScore = Math.min(10, Math.round(atsScore.overallScore / 10));
  breakdown.push({ label: "ATS Compatibility", score: atsCompatScore, maxScore: 10 });

  const total = breakdown.reduce((sum, item) => sum + item.score, 0);
  return { total, breakdown };
}

/* ==========================================================================
   Copy Button Component
   ========================================================================== */

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <motion.button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.15] text-gray-300 hover:text-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
}

/* ==========================================================================
   Animated Score Ring
   ========================================================================== */

function ScoreRing({ score, size = 180, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 80) return { stroke: "#22c55e", text: "text-green-400", bg: "rgba(34,197,94,0.1)", label: "Excellent" };
    if (v >= 60) return { stroke: "#eab308", text: "text-yellow-400", bg: "rgba(234,179,8,0.1)", label: "Good" };
    if (v >= 40) return { stroke: "#f97316", text: "text-orange-400", bg: "rgba(249,115,22,0.1)", label: "Fair" };
    return { stroke: "#ef4444", text: "text-red-400", bg: "rgba(239,68,68,0.1)", label: "Needs Work" };
  };

  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={10}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-gray-500 mt-0.5">/ 100</span>
        {label && (
          <span
            className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${color.text}`}
            style={{ background: color.bg }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Loading Spinner
   ========================================================================== */

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-gray-400 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing your profile against the job description...
      </motion.p>
    </div>
  );
}

/* ==========================================================================
   Main Page Component
   ========================================================================== */

export default function LinkedInOptimizerPage() {
  const [profileText, setProfileText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"headlines" | "about" | "keywords" | "comparison">("headlines");

  const handleAnalyze = useCallback(async () => {
    if (!profileText.trim()) {
      setError("Please paste your LinkedIn profile text.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste a target job description.");
      return;
    }
    if (profileText.trim().length < 50) {
      setError("Your profile text is too short. Please include more details (headline, about, experience).");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate a brief processing delay for UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Run the real ATS scoring
      const atsScore = scoreResumeAgainstJob(profileText, jobDescription);

      // Generate headline suggestions
      const headlines = generateHeadlineSuggestions(
        profileText,
        jobDescription,
        atsScore.keywordMatch.matched
      );

      // Generate about section
      const aboutSection = generateAboutSection(
        profileText,
        jobDescription,
        atsScore.keywordMatch.matched
      );

      // Calculate profile strength
      const { total: profileStrength, breakdown: completenessBreakdown } = calculateProfileStrength(
        profileText,
        atsScore
      );

      setAnalysisResult({
        atsScore,
        profileStrength,
        headlines,
        aboutSection,
        matchedKeywords: atsScore.keywordMatch.matched,
        missingKeywords: atsScore.keywordMatch.missing,
        completenessBreakdown,
      });
    } catch (err) {
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : "Unknown error occurred. Please try again."}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [profileText, jobDescription]);

  const handleReset = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  const profileStrengthLabel = useMemo(() => {
    if (!analysisResult) return "";
    const s = analysisResult.profileStrength;
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Needs Work";
  }, [analysisResult]);

  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-x-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/[0.07] blur-[120px] -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/[0.07] blur-[120px] top-1/3 -right-40" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-600/[0.05] blur-[100px] bottom-20 left-1/4" />
      </div>

      {/* ================================================================== */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <section className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6">
              <Share2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">AI-Powered LinkedIn Optimization</span>
              <Star className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Optimize Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                LinkedIn Profile
              </span>{" "}
              for Any Job
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Paste your profile and a target job description. Get an instant ATS score, AI-generated
              headline suggestions, an optimized About section, and keyword insights — all in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INPUT SECTION                                                      */}
      {/* ================================================================== */}
      <section className="relative z-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Profile Input */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">Your LinkedIn Profile</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {profileText.length} chars
                  </span>
                </div>
                <textarea
                  value={profileText}
                  onChange={(e) => {
                    setProfileText(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={`Paste your LinkedIn profile here...\n\nInclude:\n• Headline\n• About / Summary\n• Experience (with dates & bullet points)\n• Skills\n• Education\n• Certifications\n\nTip: Copy directly from your LinkedIn profile for best results.`}
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none text-sm leading-relaxed"
                />
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Info className="w-3.5 h-3.5" />
                  <span>Paste your full profile text — headline, about, experience, skills</span>
                </div>
              </div>
            </div>

            {/* Job Description Input */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">Target Job Description</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {jobDescription.length} chars
                  </span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={`Paste the job description you're targeting...\n\nInclude:\n• Job title & role\n• Required skills & qualifications\n• Responsibilities\n• Preferred qualifications\n• Technologies & tools mentioned`}
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none text-sm leading-relaxed"
                />
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Target className="w-3.5 h-3.5" />
                  <span>The job you want to optimize your profile for</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/20 flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: isAnalyzing ? 1 : 1.02 }}
                whileTap={{ scale: isAnalyzing ? 1 : 0.98 }}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Profile
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {analysisResult && (
                <motion.button
                  onClick={handleReset}
                  className="px-6 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* LOADING STATE                                                      */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.section
            className="relative z-10 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
                <LoadingSpinner />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* RESULTS SECTION                                                    */}
      {/* ================================================================== */}
      <AnimatePresence>
        {analysisResult && !isAnalyzing && (
          <motion.section
            className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-6xl mx-auto">

              {/* ================================================================ */}
              {/* SCORE OVERVIEW CARDS                                             */}
              {/* ================================================================ */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* ATS Score */}
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-3">ATS Score</span>
                  <ScoreRing score={analysisResult.atsScore.overallScore} size={120} />
                </motion.div>

                {/* Profile Strength */}
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-3">Profile Strength</span>
                  <ScoreRing score={analysisResult.profileStrength} size={120} label={profileStrengthLabel} />
                </motion.div>

                {/* Keyword Match */}
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-3">Keyword Match</span>
                  <ScoreRing score={analysisResult.atsScore.keywordMatch.percentage} size={120} />
                  <span className="text-xs text-gray-500 mt-2">
                    {analysisResult.matchedKeywords.length} / {analysisResult.matchedKeywords.length + analysisResult.missingKeywords.length} matched
                  </span>
                </motion.div>

                {/* Formatting Score */}
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-3">Formatting</span>
                  <ScoreRing score={analysisResult.atsScore.formatting.score} size={120} />
                </motion.div>
              </div>

              {/* ================================================================ */}
              {/* PROFILE COMPLETENESS BREAKDOWN                                  */}
              {/* ================================================================ */}
              <motion.div
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  Profile Completeness Breakdown
                </h3>
                <div className="space-y-4">
                  {analysisResult.completenessBreakdown.map((item, idx) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-gray-500">
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ================================================================ */}
              {/* SECTION SCORES                                                   */}
              {/* ================================================================ */}
              <motion.div
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Section Analysis
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysisResult.atsScore.sections.map((section, idx) => (
                    <motion.div
                      key={section.name}
                      className={`p-4 rounded-xl border ${
                        section.present
                          ? "bg-green-500/[0.05] border-green-500/15"
                          : "bg-red-500/[0.05] border-red-500/15"
                      }`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {section.present ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm font-medium text-white">{section.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              section.quality >= 70
                                ? "bg-green-500"
                                : section.quality >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${section.quality}%` }}
                            transition={{ duration: 0.8, delay: 0.8 + idx * 0.05 }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{section.quality}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{section.feedback}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ================================================================ */}
              {/* SUGGESTIONS & STRENGTHS                                          */}
              {/* ================================================================ */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Strengths */}
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-400" />
                    Strengths
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.atsScore.strengths.map((strength, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-3 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.05 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.atsScore.suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-3 text-sm"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.05 }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            suggestion.priority === "high"
                              ? "bg-red-400"
                              : suggestion.priority === "medium"
                              ? "bg-yellow-400"
                              : "bg-blue-400"
                          }`}
                        />
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wider">
                            {suggestion.section}
                          </span>
                          <p className="text-gray-300 mt-0.5">{suggestion.suggestion}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ================================================================ */}
              {/* TABS NAVIGATION                                                  */}
              {/* ================================================================ */}
              <motion.div
                className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { id: "headlines" as const, label: "Headlines", icon: Zap },
                  { id: "about" as const, label: "About Section", icon: FileText },
                  { id: "keywords" as const, label: "Keywords", icon: Target },
                  { id: "comparison" as const, label: "Before/After", icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-white/[0.08] text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </motion.div>

              {/* ================================================================ */}
              {/* TAB CONTENT                                                      */}
              {/* ================================================================ */}
              <AnimatePresence mode="wait">
                {/* HEADLINES TAB */}
                {activeTab === "headlines" && (
                  <motion.div
                    key="headlines"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-400" />
                            AI-Generated Headlines
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Keyword-optimized headlines based on your target job description
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {analysisResult.headlines.map((headline, idx) => (
                          <motion.div
                            key={idx}
                            className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                    Option {idx + 1}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-green-400" />
                                    Impact: {headline.impactScore}%
                                  </span>
                                </div>
                                <p className="text-sm text-gray-200 leading-relaxed font-medium">
                                  {headline.text}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {headline.keywords.map((kw) => (
                                    <span
                                      key={kw}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <CopyButton text={headline.text} label="Copy" />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-blue-500/[0.05] border border-blue-500/15">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-400 leading-relaxed">
                            <strong className="text-gray-300">Pro tip:</strong> LinkedIn headlines support up to 220 characters.
                            The best headlines include your role, key skills, and a value proposition.
                            Use the pipe symbol (|) to separate sections for readability.
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ABOUT SECTION TAB */}
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            Optimized About Section
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            A compelling, keyword-rich About section tailored to your target role
                          </p>
                        </div>
                        <CopyButton text={analysisResult.aboutSection.content} label="Copy All" />
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/[0.04] to-blue-500/[0.04] border border-purple-500/15">
                        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                          {analysisResult.aboutSection.content}
                        </div>
                      </div>

                      <div className="mt-5 grid sm:grid-cols-3 gap-3">
                        {analysisResult.aboutSection.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-3 rounded-lg bg-green-500/[0.05] border border-green-500/10"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-xs text-gray-300">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 p-4 rounded-xl bg-yellow-500/[0.05] border border-yellow-500/15">
                        <div className="flex items-start gap-3">
                          <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-400 leading-relaxed">
                            <strong className="text-gray-300">Customization tip:</strong> Personalize this About section
                            with your specific achievements, metrics, and experiences. The AI has created a strong
                            framework — add your unique numbers and stories to make it truly yours.
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* KEYWORDS TAB */}
                {activeTab === "keywords" && (
                  <motion.div
                    key="keywords"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Matched Keywords */}
                      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <h3 className="text-sm font-semibold text-white">Matched Keywords</h3>
                          <span className="text-xs text-gray-500 ml-auto">
                            {analysisResult.matchedKeywords.length} found
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matchedKeywords.length > 0 ? (
                            analysisResult.matchedKeywords.map((kw) => (
                              <motion.span
                                key={kw}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/[0.1] text-green-300 border border-green-500/20"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {kw}
                              </motion.span>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No keywords matched. Try adding more relevant skills to your profile.</p>
                          )}
                        </div>
                      </div>

                      {/* Missing Keywords */}
                      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <h3 className="text-sm font-semibold text-white">Missing Keywords</h3>
                          <span className="text-xs text-gray-500 ml-auto">
                            {analysisResult.missingKeywords.length} missing
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingKeywords.length > 0 ? (
                            analysisResult.missingKeywords.map((kw) => (
                              <motion.span
                                key={kw}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/[0.1] text-red-300 border border-red-500/20"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {kw}
                              </motion.span>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Great job! All keywords from the job description are present in your profile.</p>
                          )}
                        </div>
                        {analysisResult.missingKeywords.length > 0 && (
                          <div className="mt-4 p-3 rounded-lg bg-yellow-500/[0.05] border border-yellow-500/10">
                            <p className="text-xs text-gray-400">
                              <strong className="text-yellow-300">Action:</strong> Add these missing keywords to your
                              headline, About section, and skills to improve your ATS score.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills Recommendation */}
                    <motion.div
                      className="mt-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        Recommended Skills to Add
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Based on the job description, these skills would strengthen your profile:
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {analysisResult.missingKeywords.slice(0, 12).map((kw, idx) => (
                          <motion.div
                            key={kw}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/20 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.04 }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                              <Plus className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-200 font-medium">{kw}</span>
                              <p className="text-[10px] text-gray-500 mt-0.5">High demand in job posting</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* COMPARISON TAB */}
                {activeTab === "comparison" && (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Before */}
                      <div className="bg-white/[0.03] backdrop-blur-xl border border-red-500/15 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Before</span>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">Headline</span>
                            <p className="text-sm text-gray-400 leading-relaxed bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                              {extractCurrentHeadline(profileText) || "(No clear headline detected)"}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">About / Summary</span>
                            <p className="text-sm text-gray-500 leading-relaxed bg-white/[0.02] rounded-lg p-3 border border-white/[0.04] line-clamp-4">
                              {profileText.substring(0, 300)}...
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                              {extractSkillsFromProfile(profileText).slice(0, 6).map((s) => (
                                <span key={s} className="px-2 py-1 rounded-md text-[10px] bg-white/[0.04] text-gray-500 border border-white/[0.06]">
                                  {s}
                                </span>
                              ))}
                              {extractSkillsFromProfile(profileText).length === 0 && (
                                <span className="text-xs text-gray-600">No skills detected</span>
                              )}
                            </div>
                          </div>
                          <div className="pt-4 border-t border-white/[0.06]">
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>
                                Profile Strength: <strong className="text-red-300">{analysisResult.profileStrength}/100</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-red-400/70 text-xs mt-1">
                              <Target className="w-3 h-3" />
                              <span>ATS Score: {analysisResult.atsScore.overallScore}/100</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* After */}
                      <div className="bg-white/[0.03] backdrop-blur-xl border border-green-500/15 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.03] blur-[60px] rounded-full" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-5">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">After</span>
                            <Sparkles className="w-4 h-4 text-green-400" />
                          </div>

                          <div className="space-y-5">
                            <div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">Headline</span>
                              <div className="bg-green-500/[0.05] rounded-lg p-3 border border-green-500/15">
                                <p className="text-sm text-gray-200 leading-relaxed">
                                  {analysisResult.headlines[0]?.text || "No headline generated"}
                                </p>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">About / Summary</span>
                              <div className="bg-green-500/[0.05] rounded-lg p-3 border border-green-500/15 max-h-32 overflow-y-auto">
                                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-xs">
                                  {analysisResult.aboutSection.content.substring(0, 400)}...
                                </p>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-2">Skills</span>
                              <div className="flex flex-wrap gap-1.5">
                                {analysisResult.matchedKeywords.slice(0, 8).map((s) => (
                                  <span key={s} className="px-2 py-1 rounded-md text-[10px] bg-green-500/[0.1] text-green-300 border border-green-500/20">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-4 border-t border-white/[0.06]">
                              <div className="flex items-center gap-2 text-green-400 text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  Estimated Strength: <strong className="text-green-300">
                                    {Math.min(100, analysisResult.profileStrength + 25)}/100
                                  </strong>
                                </span>
                                <TrendingUp className="w-4 h-4 ml-1" />
                              </div>
                              <div className="flex items-center gap-2 text-green-400/70 text-xs mt-1">
                                <Target className="w-3 h-3" />
                                <span>Est. ATS Score: {Math.min(100, analysisResult.atsScore.overallScore + 20)}/100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Summary */}
                    <motion.div
                      className="mt-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-400" />
                        Expected Improvements
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: "Profile Views", value: "3x more", icon: Eye },
                          { label: "Recruiter InMails", value: "5x more", icon: Share2 },
                          { label: "ATS Score", value: `+${Math.min(25, 100 - analysisResult.atsScore.overallScore)} pts`, icon: TrendingUp },
                          { label: "Keyword Match", value: `+${Math.min(30, 100 - analysisResult.atsScore.keywordMatch.percentage)}%`, icon: Target },
                        ].map((item, idx) => (
                          <motion.div
                            key={item.label}
                            className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + idx * 0.08 }}
                          >
                            <item.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                              {item.value}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ================================================================ */}
              {/* FORMATTING DETAILS                                                */}
              {/* ================================================================ */}
              <motion.div
                className="mt-8 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-orange-400" />
                  Formatting Analysis
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Consistent Dates",
                      present: analysisResult.atsScore.formatting.hasConsistentDates,
                      tip: "Use a consistent date format (e.g., Jan 2022 – Present)",
                    },
                    {
                      label: "Bullet Points",
                      present: analysisResult.atsScore.formatting.hasBulletPoints,
                      tip: "Use bullet points to describe responsibilities",
                    },
                    {
                      label: "Quantified Metrics",
                      present: analysisResult.atsScore.formatting.hasQuantifiableMetrics,
                      tip: "Include numbers (e.g., 'increased revenue by 25%')",
                    },
                    {
                      label: "Section Headings",
                      present: analysisResult.atsScore.formatting.hasProperHeadings,
                      tip: "Use standard headings like 'Experience', 'Education'",
                    },
                  ].map((item, idx) => (
                    <div
                      key={item.label}
                      className={`p-4 rounded-xl border ${
                        item.present
                          ? "bg-green-500/[0.05] border-green-500/15"
                          : "bg-orange-500/[0.05] border-orange-500/15"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {item.present ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                        )}
                        <span className="text-sm font-medium text-white">{item.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ================================================================ */}
              {/* FINAL CTA                                                         */}
              {/* ================================================================ */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-500/[0.08] via-purple-500/[0.08] to-cyan-500/[0.08] border border-white/[0.08]">
                  <div className="text-left">
                    <h4 className="text-base font-semibold text-white">Ready to implement these changes?</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Copy the optimized content above and update your LinkedIn profile.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => {
                      setAnalysisResult(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Analyze Another Profile
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* FOOTER SPACER                                                       */}
      {/* ================================================================== */}
      <div className="relative z-10 h-20" />
    </div>
  );
}

/* ==========================================================================
   Plus Icon (inline to avoid extra imports)
   ========================================================================== */

function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ==========================================================================
   Eye Icon (re-export for use above)
   ========================================================================== */

function Eye({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
