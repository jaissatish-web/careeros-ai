import { ATSScore, ATSSectionScore, KeywordMatch } from './types';

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

const SOFT_SKILLS = [
  'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
  'time management', 'adaptability', 'collaboration', 'creativity', 'attention to detail',
  'organization', 'analytical thinking', 'interpersonal', 'presentation',
  'mentoring', 'conflict resolution', 'decision making', 'strategic thinking',
];

const ACTION_VERBS = [
  'led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built',
  'increased', 'reduced', 'improved', 'optimized', 'launched', 'coordinated',
  'analyzed', 'achieved', 'delivered', 'streamlined', 'established', 'initiated',
  'executed', 'facilitated', 'engineered', 'architected', 'automated',
];

const SECTION_WEIGHTS: Record<string, number> = {
  contact: 5,
  summary: 10,
  experience: 30,
  education: 15,
  skills: 20,
  certifications: 10,
  projects: 10,
};

function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const found: string[] = [];
  
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'must', 'work', 'worked', 'working', 'year', 'years', 'month', 'months', 'experience', 'required', 'skills', 'ability', 'team', 'role', 'position', 'job', 'company', 'responsible', 'responsibilities']);
  
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

function matchKeywords(resumeText: string, jobKeywords: string[]): KeywordMatch {
  const normalizedResume = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  
  for (const keyword of jobKeywords) {
    const normalized = keyword.toLowerCase().trim();
    if (normalizedResume.includes(normalized)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }
  
  const percentage = jobKeywords.length > 0
    ? Math.round((matched.length / jobKeywords.length) * 100)
    : 100;
  
  return { matched, missing, percentage };
}

function checkFormatting(text: string): ATSScore['formatting'] {
  const hasConsistentDates = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\s*\.?\s*\d{4}/i.test(text);
  
  const hasBulletPoints = /[•\-*]\s/.test(text) || /\n\s*[•\-*]/.test(text);
  
  const quantMetrics = text.match(/\d+[\d,]*\.?\d*\s*[$%]|\+\d+%|\d+%|\$\d+/g);
  const hasQuantifiableMetrics = (quantMetrics?.length || 0) >= 2;
  
  const sectionPatterns = ['experience', 'education', 'skills', 'summary', 'profile'];
  const foundSections = sectionPatterns.filter(p => new RegExp(`\\b${p}\\b`, 'i').test(text));
  const hasProperHeadings = foundSections.length >= 2;
  
  let score = 0;
  if (hasConsistentDates) score += 25;
  if (hasBulletPoints) score += 25;
  if (hasQuantifiableMetrics) score += 25;
  if (hasProperHeadings) score += 25;
  
  return {
    hasConsistentDates,
    hasBulletPoints,
    hasQuantifiableMetrics,
    hasProperHeadings,
    score,
  };
}

function checkSections(text: string): ATSSectionScore[] {
  const normalized = text.toLowerCase();
  
  const sections: ATSSectionScore[] = [
    {
      name: 'Contact Information',
      present: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text) || /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text),
      quality: 0,
      feedback: '',
    },
    {
      name: 'Professional Summary',
      present: /summary|profile|about|objective/i.test(text),
      quality: 0,
      feedback: '',
    },
    {
      name: 'Work Experience',
      present: /experience|employment|work history/i.test(text),
      quality: 0,
      feedback: '',
    },
    {
      name: 'Education',
      present: /education|academic|degree/i.test(text),
      quality: 0,
      feedback: '',
    },
    {
      name: 'Skills',
      present: /skills|technologies|competencies/i.test(text),
      quality: 0,
      feedback: '',
    },
    {
      name: 'Certifications',
      present: /certificat|license|credential/i.test(text),
      quality: 0,
      feedback: '',
    },
  ];

  const experienceBlocks = text.split(/\n\s*\n/).filter(b => /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\s*\d{4}/i.test(b));
  const hasActionVerbs = ACTION_VERBS.some(v => normalized.includes(v));
  const hasMetrics = /\d+[\d,]*\.?\d*\s*[$%+]|\d+%/.test(text);

  for (const section of sections) {
    if (section.present) {
      section.quality = 70;
      
      if (section.name === 'Work Experience') {
        if (experienceBlocks.length >= 2) section.quality += 15;
        if (hasActionVerbs) section.quality += 10;
        if (hasMetrics) section.quality += 5;
        section.feedback = experienceBlocks.length >= 2 && hasActionVerbs
          ? 'Good experience section with multiple roles and action verbs'
          : 'Consider adding more quantified achievements and action verbs';
      } else if (section.name === 'Skills') {
        const techFound = TECHNICAL_KEYWORDS.filter(k => normalized.includes(k));
        if (techFound.length >= 5) section.quality += 20;
        else if (techFound.length >= 2) section.quality += 10;
        section.feedback = techFound.length >= 5
          ? 'Strong technical skills section'
          : 'Consider adding more relevant technical skills';
      } else if (section.name === 'Education') {
        if (/bachelor|master|phd|associate/i.test(text)) section.quality += 20;
        section.feedback = 'Education section is present';
      } else if (section.name === 'Professional Summary') {
        const summaryText = text.match(/(summary|profile|about|objective)[:\s]*(.{50,500})/i);
        if (summaryText && summaryText[2]?.trim().length > 50) section.quality += 20;
        section.feedback = 'Summary provides context about your background';
      } else if (section.name === 'Certifications') {
        section.feedback = 'Certifications add credibility to your profile';
      } else {
        section.feedback = 'Contact information is present';
      }
      
      section.quality = Math.min(100, section.quality);
    } else {
      section.feedback = `Missing ${section.name} section - recommended for ATS compatibility`;
    }
  }

  return sections;
}

function generateSuggestions(score: ATSScore): { priority: 'high' | 'medium' | 'low'; section: string; suggestion: string }[] {
  const suggestions: { priority: 'high' | 'medium' | 'low'; section: string; suggestion: string }[] = [];

  if (score.keywordMatch.percentage < 60) {
    const missingTop3 = score.keywordMatch.missing.slice(0, 3);
    if (missingTop3.length > 0) {
      suggestions.push({ priority: 'high' as const, section: 'Keywords', suggestion: `Add these keywords from the job description: ${missingTop3.join(', ')}` });
    }
  }

  if (!score.formatting.hasBulletPoints) {
    suggestions.push({ priority: 'high' as const, section: 'Formatting', suggestion: 'Use bullet points to describe your responsibilities and achievements' });
  }

  if (!score.formatting.hasQuantifiableMetrics) {
    suggestions.push({ priority: 'high' as const, section: 'Experience', suggestion: 'Add quantifiable metrics (e.g., "increased sales by 25%", "managed team of 10") to demonstrate impact' });
  }

  if (!score.formatting.hasConsistentDates) {
    suggestions.push({ priority: 'medium' as const, section: 'Formatting', suggestion: 'Use a consistent date format throughout (e.g., "Jan 2022 - Present")' });
  }

  if (!score.formatting.hasProperHeadings) {
    suggestions.push({ priority: 'medium' as const, section: 'Structure', suggestion: 'Use standard section headings like "Experience", "Education", "Skills" for better ATS parsing' });
  }

  const missingSections = score.sections.filter(s => !s.present);
  if (missingSections.length > 0) {
    const names = missingSections.slice(0, 2).map(s => s.name);
    suggestions.push({ priority: 'medium' as const, section: 'Structure', suggestion: `Consider adding: ${names.join(' and ')}` });
  }

  if (score.overallScore >= 80) {
    suggestions.push({ priority: 'low' as const, section: 'Overall', suggestion: 'Your resume is well-optimized! Minor tweaks could make it even stronger.' });
  }

  return suggestions;
}

export function scoreResumeAgainstJob(resumeText: string, jobDescription: string): ATSScore {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);
  
  const keywordMatch = matchKeywords(resumeText, jobKeywords);
  const formatting = checkFormatting(resumeText);
  const sections = checkSections(resumeText);
  
  const sectionAvg = sections.reduce((acc, s) => acc + s.quality, 0) / sections.length;
  
  const overallScore = Math.round(
    (keywordMatch.percentage * 0.35) +
    (formatting.score * 0.25) +
    (sectionAvg * 0.40)
  );

  const strengths: string[] = [];
  
  if (keywordMatch.percentage >= 70) {
    strengths.push(`Strong keyword match (${keywordMatch.percentage}%) with the job description`);
  }
  if (formatting.hasBulletPoints) {
    strengths.push('Good use of bullet points for readability');
  }
  if (formatting.hasQuantifiableMetrics) {
    strengths.push('Includes quantifiable achievements and metrics');
  }
  if (formatting.hasConsistentDates) {
    strengths.push('Consistent date formatting throughout');
  }
  if (sections.filter(s => s.present).length >= 4) {
    strengths.push('Well-structured with all essential sections');
  }
  
  if (strengths.length === 0) {
    strengths.push('Resume has room for improvement - follow the suggestions below');
  }

  const score: ATSScore = {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    keywordMatch,
    formatting,
    sections,
    suggestions: [],
    strengths,
  };

  score.suggestions = generateSuggestions(score) as ATSScore['suggestions'];

  return score;
}
