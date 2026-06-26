"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Copy,
  Download,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  RefreshCw,
  Clipboard,
  X,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  FolderOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { parseResume, scoreResumeAgainstJob } from "@/lib/resume-parser";
import type { ResumeData, ATSScore } from "@/lib/resume-parser";

type TabType = "upload" | "ats" | "improvements";

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParse = useCallback(() => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text first");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      try {
        const result = parseResume(resumeText);
        setParsedData(result);
        setIsLoading(false);
      } catch (e) {
        setError("Failed to parse resume. Please check the format.");
        setIsLoading(false);
      }
    }, 500);
  }, [resumeText]);

  const handleScore = useCallback(() => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please paste both your resume and the job description");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      try {
        const result = scoreResumeAgainstJob(resumeText, jobDescription);
        setAtsScore(result);
        setIsLoading(false);
        setActiveTab("ats");
      } catch (e) {
        setError("Failed to score resume. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  }, [resumeText, jobDescription]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();
    
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".pdf")) {
      setError("PDF parsing requires server-side processing. Please copy-paste your resume text instead, or use the sample below.");
    } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      setError("DOCX parsing requires server-side processing. Please copy-paste your resume text instead, or use the sample below.");
    } else {
      setError("Unsupported file format. Please use .txt or paste text directly.");
    }
  }, []);

  const loadSampleResume = () => {
    setResumeText(`John Smith
john.smith@email.com | (555) 123-4567 | San Francisco, CA
linkedin.com/in/johnsmith | github.com/johnsmith

PROFESSIONAL SUMMARY
Senior Software Engineer with 7+ years of experience building scalable web applications. Expert in React, TypeScript, Node.js, and cloud technologies. Led teams of 5-8 engineers and delivered products used by millions of users.

WORK EXPERIENCE

Senior Software Engineer | Google | Jan 2021 - Present
• Led development of a microservices architecture serving 50M+ daily active users
• Reduced API response time by 40% through caching and optimization
• Mentored 4 junior engineers, conducting code reviews and pair programming
• Implemented CI/CD pipelines reducing deployment time by 60%

Software Engineer | Meta | Mar 2018 - Dec 2020
• Built React-based dashboard used by 10,000+ internal users
• Developed RESTful APIs handling 100K+ requests per minute
• Increased test coverage from 45% to 92% across the team
• Collaborated with product and design teams on feature roadmap

Junior Developer | StartupXYZ | Jun 2016 - Feb 2018
• Developed full-stack features using Node.js and React
• Implemented user authentication system serving 500K users
• Optimized database queries reducing load times by 30%

EDUCATION

Bachelor of Science in Computer Science | Stanford University | 2012 - 2016
GPA: 3.8/4.0 | Dean's List

SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java, Go
Frontend: React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, GraphQL, REST APIs
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Terraform
Tools: Git, Jira, Figma, VS Code

CERTIFICATIONS

• AWS Certified Solutions Architect - 2022
• Google Cloud Professional Developer - 2021

PROJECTS

• Open-source contributor to React Testing Library (200+ GitHub stars)
• Built a real-time chat application handling 10K concurrent users
• Developed an automated testing framework adopted by 3 teams`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    if (!parsedData) return;
    const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsed-resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "upload" as TabType, label: "Upload & Parse", icon: Upload },
    { id: "ats" as TabType, label: "ATS Score", icon: BarChart3 },
    { id: "improvements" as TabType, label: "Improvements", icon: TrendingUp },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="gradient-orb gradient-orb-blue w-[600px] h-[600px] -top-40 -left-40 animate-[orb-float-1_8s_ease-in-out_infinite] opacity-30" aria-hidden="true" />
      <div className="gradient-orb gradient-orb-purple w-[500px] h-[500px] top-1/3 -right-40 animate-[orb-float-2_12s_ease-in-out_infinite] opacity-25" aria-hidden="true" />
      <div className="gradient-orb gradient-orb-cyan w-[400px] h-[400px] bottom-20 left-1/4 animate-[orb-float-3_10s_ease-in-out_infinite] opacity-20" aria-hidden="true" />

      <div className="relative z-[1]">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-blue-400 mb-6">
                <FileText className="w-4 h-4" /> AI-Powered Resume Builder
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
                Build ATS-Perfect Resumes{" "}
                <span className="text-gradient-animated">Instantly</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Upload or paste your resume to extract information, score it against job descriptions, and get actionable improvements.
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "glass text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                  <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Upload Area */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" /> Upload Resume
                      </h3>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.pdf,.docx,.doc"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                      >
                        <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 mb-1">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports .txt files (PDF/DOCX paste recommended)
                        </p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button onClick={loadSampleResume} variant="secondary" size="sm">
                          <Clipboard className="w-4 h-4" /> Load Sample Resume
                        </Button>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-400" /> Or Paste Text
                      </h3>
                      
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text here...&#10;&#10;Example:&#10;John Doe&#10;john@email.com | (555) 123-4567&#10;&#10;EXPERIENCE&#10;Senior Developer | Google | 2020-Present&#10;• Built scalable applications..."
                        className="w-full h-64 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {resumeText.length} characters
                      </p>
                    </div>
                  </div>

                  {/* Parse Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleParse}
                      disabled={isLoading || !resumeText.trim()}
                    >
                      {isLoading ? (
                        <><RefreshCw className="w-5 h-5 animate-spin" /> Parsing...</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> Parse Resume</>
                      )}
                    </Button>
                  </div>

                  {/* Parsed Results */}
                  <AnimatePresence>
                    {parsedData && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-heading font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Parsed Results
                          </h3>
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={downloadJSON}>
                              <Download className="w-4 h-4" /> Export JSON
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}>
                              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              {copied ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="glass-card rounded-2xl p-6">
                          <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" /> Contact Information
                          </h4>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parsedData.name && (
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-gray-500 mb-1">Name</p>
                                <p className="text-sm text-white font-medium">{parsedData.name}</p>
                              </div>
                            )}
                            {parsedData.email && (
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-gray-500 mb-1">Email</p>
                                <p className="text-sm text-white font-medium">{parsedData.email}</p>
                              </div>
                            )}
                            {parsedData.phone && (
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-gray-500 mb-1">Phone</p>
                                <p className="text-sm text-white font-medium">{parsedData.phone}</p>
                              </div>
                            )}
                            {parsedData.location && (
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-gray-500 mb-1">Location</p>
                                <p className="text-sm text-white font-medium">{parsedData.location}</p>
                              </div>
                            )}
                            {parsedData.linkedin && (
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                                <p className="text-sm text-white font-medium truncate">{parsedData.linkedin}</p>
                              </div>
                            )}
                            {parsedData.github && (
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-gray-500 mb-1">GitHub</p>
                                <p className="text-sm text-white font-medium truncate">{parsedData.github}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Summary */}
                        {parsedData.summary && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-purple-400" /> Professional Summary
                            </h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{parsedData.summary}</p>
                          </div>
                        )}

                        {/* Experience */}
                        {parsedData.experience.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-blue-400" /> Work Experience ({parsedData.experience.length})
                            </h4>
                            <div className="space-y-4">
                              {parsedData.experience.map((exp, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <p className="text-sm font-semibold text-white">{exp.title}</p>
                                      <p className="text-xs text-blue-400">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                                      {exp.startDate} - {exp.endDate || "Present"}
                                    </span>
                                  </div>
                                  {exp.location && <p className="text-xs text-gray-500 mb-2">📍 {exp.location}</p>}
                                  {exp.bulletPoints.length > 0 && (
                                    <ul className="space-y-1 mt-2">
                                      {exp.bulletPoints.map((bp, j) => (
                                        <li key={j} className="text-xs text-gray-400 flex items-start gap-2">
                                          <span className="text-blue-400 mt-0.5">•</span> {bp}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {parsedData.education.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-emerald-400" /> Education ({parsedData.education.length})
                            </h4>
                            <div className="space-y-3">
                              {parsedData.education.map((edu, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                  <p className="text-sm font-semibold text-white">{edu.degree}</p>
                                  <p className="text-xs text-gray-400">{edu.institution} {edu.field && `• ${edu.field}`}</p>
                                  {(edu.startDate || edu.gpa) && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {edu.startDate} {edu.endDate && `- ${edu.endDate}`} {edu.gpa && `• GPA: ${edu.gpa}`}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {parsedData.skills.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                              <Code className="w-4 h-4 text-cyan-400" /> Skills
                            </h4>
                            <div className="space-y-3">
                              {parsedData.skills.map((cat, i) => (
                                <div key={i}>
                                  <p className="text-xs text-gray-500 mb-2">{cat.category}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {cat.skills.map((skill, j) => (
                                      <span key={j} className="px-2.5 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {parsedData.projects.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                              <FolderOpen className="w-4 h-4 text-amber-400" /> Projects ({parsedData.projects.length})
                            </h4>
                            <div className="space-y-3">
                              {parsedData.projects.map((proj, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                  <p className="text-sm font-semibold text-white">{proj.name}</p>
                                  {proj.description && <p className="text-xs text-gray-400 mt-1">{proj.description}</p>}
                                  {proj.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {proj.technologies.map((tech, j) => (
                                        <span key={j} className="px-2 py-0.5 text-[10px] rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {parsedData.certifications.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                              <Award className="w-4 h-4 text-yellow-400" /> Certifications ({parsedData.certifications.length})
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {parsedData.certifications.map((cert, i) => (
                                <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                  <p className="text-sm text-white font-medium">{cert.name}</p>
                                  <p className="text-xs text-gray-500">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Next Step CTA */}
                        <div className="glass-card rounded-2xl p-6 text-center">
                          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                          <h4 className="text-lg font-heading font-semibold mb-2">Ready to test your ATS score?</h4>
                          <p className="text-sm text-gray-400 mb-4">Paste a job description and see how well your resume matches</p>
                          <Button variant="primary" onClick={() => setActiveTab("ats")}>
                            <ChevronRight className="w-5 h-5" /> Go to ATS Scoring
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === "ats" && (
                <motion.div
                  key="ats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Job Description Input */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" /> Target Job Description
                    </h3>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior Software Engineer to join our team. Requirements:&#10;- 5+ years of experience with React and TypeScript&#10;- Experience with Node.js and cloud services (AWS/GCP)&#10;- Strong problem-solving skills&#10;- Experience with CI/CD pipelines"
                      className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">{jobDescription.length} characters</p>
                  </div>

                  {/* Score Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleScore}
                      disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
                    >
                      {isLoading ? (
                        <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...</>
                      ) : (
                        <><BarChart3 className="w-5 h-5" /> Get ATS Score</>
                      )}
                    </Button>
                  </div>

                  {/* ATS Results */}
                  <AnimatePresence>
                    {atsScore && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-6"
                      >
                        {/* Overall Score */}
                        <div className="glass-card rounded-2xl p-8 text-center">
                          <div className="relative w-40 h-40 mx-auto mb-4">
                            <svg width="160" height="160" className="-rotate-90">
                              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                              <motion.circle
                                cx="80" cy="80" r="70" fill="none"
                                stroke={atsScore.overallScore >= 70 ? "#10b981" : atsScore.overallScore >= 50 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 70}
                                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - atsScore.overallScore / 100) }}
                                transition={{ duration: 2, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <motion.span
                                className="text-4xl font-bold font-heading text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                {atsScore.overallScore}
                              </motion.span>
                              <span className="text-xs text-gray-500">out of 100</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-heading font-semibold mb-1">
                            {atsScore.overallScore >= 80 ? "Excellent Match!" : atsScore.overallScore >= 60 ? "Good Match" : atsScore.overallScore >= 40 ? "Needs Work" : "Poor Match"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {atsScore.overallScore >= 70
                              ? "Your resume is well-optimized for this position"
                              : "Follow the suggestions below to improve your score"}
                          </p>
                        </div>

                        {/* Keyword Match */}
                        <div className="glass-card rounded-2xl p-6">
                          <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" /> Keyword Match
                          </h4>
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Match Rate</span>
                              <span className="text-sm font-semibold text-white">{atsScore.keywordMatch.percentage}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${atsScore.keywordMatch.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-emerald-400 font-medium mb-2">✅ Matched ({atsScore.keywordMatch.matched.length})</p>
                              <div className="flex flex-wrap gap-1.5">
                                {atsScore.keywordMatch.matched.slice(0, 15).map((kw, i) => (
                                  <span key={i} className="px-2 py-0.5 text-xs rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    {kw}
                                  </span>
                                ))}
                                {atsScore.keywordMatch.matched.length > 15 && (
                                  <span className="px-2 py-0.5 text-xs rounded bg-white/5 text-gray-400">
                                    +{atsScore.keywordMatch.matched.length - 15} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-red-400 font-medium mb-2">❌ Missing ({atsScore.keywordMatch.missing.length})</p>
                              <div className="flex flex-wrap gap-1.5">
                                {atsScore.keywordMatch.missing.slice(0, 15).map((kw, i) => (
                                  <span key={i} className="px-2 py-0.5 text-xs rounded bg-red-500/10 text-red-300 border border-red-500/20">
                                    {kw}
                                  </span>
                                ))}
                                {atsScore.keywordMatch.missing.length > 15 && (
                                  <span className="px-2 py-0.5 text-xs rounded bg-white/5 text-gray-400">
                                    +{atsScore.keywordMatch.missing.length - 15} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Formatting */}
                        <div className="glass-card rounded-2xl p-6">
                          <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-cyan-400" /> Formatting Analysis
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              { label: "Consistent Dates", value: atsScore.formatting.hasConsistentDates },
                              { label: "Bullet Points", value: atsScore.formatting.hasBulletPoints },
                              { label: "Quantifiable Metrics", value: atsScore.formatting.hasQuantifiableMetrics },
                              { label: "Proper Headings", value: atsScore.formatting.hasProperHeadings },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                                {item.value ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                )}
                                <span className="text-sm text-gray-300">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section Scores */}
                        <div className="glass-card rounded-2xl p-6">
                          <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-purple-400" /> Section Analysis
                          </h4>
                          <div className="space-y-3">
                            {atsScore.sections.map((section, i) => (
                              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {section.present ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <X className="w-3.5 h-3.5 text-red-400" />
                                    )}
                                    <span className="text-sm text-white">{section.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-400">{section.quality}/100</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${section.quality >= 70 ? "bg-emerald-500" : section.quality >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                                    style={{ width: `${section.quality}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{section.feedback}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths */}
                        {atsScore.strengths.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strengths
                            </h4>
                            <ul className="space-y-2">
                              {atsScore.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === "improvements" && (
                <motion.div
                  key="improvements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {!atsScore ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold mb-2">Score Your Resume First</h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Go to the ATS Score tab to analyze your resume against a job description, then come back here for personalized improvement suggestions.
                      </p>
                      <Button variant="primary" onClick={() => setActiveTab("ats")}>
                        <ChevronRight className="w-5 h-5" /> Go to ATS Score
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Suggestions */}
                      <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-400" /> Personalized Improvement Suggestions
                        </h3>
                        <div className="space-y-4">
                          {atsScore.suggestions.map((sug, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`p-4 rounded-xl border ${
                                sug.priority === 'high'
                                  ? "bg-red-500/5 border-red-500/20"
                                  : sug.priority === 'medium'
                                  ? "bg-amber-500/5 border-amber-500/20"
                                  : "bg-blue-500/5 border-blue-500/20"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                                  sug.priority === 'high'
                                    ? "bg-red-500/20 text-red-300"
                                    : sug.priority === 'medium'
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-blue-500/20 text-blue-300"
                                }`}>
                                  {sug.priority}
                                </span>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">{sug.section}</p>
                                  <p className="text-sm text-gray-200">{sug.suggestion}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Wins */}
                      <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-400" /> Quick Wins Checklist
                        </h3>
                        <div className="space-y-3">
                          {[
                            { task: "Add missing keywords from the job description", done: atsScore.keywordMatch.percentage >= 70 },
                            { task: "Use bullet points for all experience items", done: atsScore.formatting.hasBulletPoints },
                            { task: "Include at least 3 quantifiable metrics", done: atsScore.formatting.hasQuantifiableMetrics },
                            { task: "Use consistent date format (Mon YYYY)", done: atsScore.formatting.hasConsistentDates },
                            { task: "Add a professional summary section", done: atsScore.sections.find(s => s.name === "Professional Summary")?.present || false },
                            { task: "Include education details", done: atsScore.sections.find(s => s.name === "Education")?.present || false },
                            { task: "List relevant technical skills", done: atsScore.sections.find(s => s.name === "Skills")?.present || false },
                            { task: "Keep resume to 1-2 pages", done: true },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                              {item.done ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-600 shrink-0" />
                              )}
                              <span className={`text-sm ${item.done ? "text-gray-400 line-through" : "text-gray-200"}`}>
                                {item.task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Score Again */}
                      <div className="flex justify-center">
                        <Button variant="secondary" onClick={() => setActiveTab("ats")}>
                          <RefreshCw className="w-5 h-5" /> Re-score with different job
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
