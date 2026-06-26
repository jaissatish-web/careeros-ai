// Resume Parser Types

export interface Experience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  bulletPoints: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  details: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: string[];
  volunteer: string[];
}

export interface ATSSectionScore {
  name: string;
  present: boolean;
  quality: number;
  feedback: string;
}

export interface KeywordMatch {
  matched: string[];
  missing: string[];
  percentage: number;
}

export interface ATSScore {
  overallScore: number;
  keywordMatch: KeywordMatch;
  formatting: {
    hasConsistentDates: boolean;
    hasBulletPoints: boolean;
    hasQuantifiableMetrics: boolean;
    hasProperHeadings: boolean;
    score: number;
  };
  sections: ATSSectionScore[];
  suggestions: {
    priority: 'high' | 'medium' | 'low';
    section: string;
    suggestion: string;
  }[];
  strengths: string[];
}

export interface ParserOptions {
  extractSkills?: boolean;
  extractEducation?: boolean;
  extractExperience?: boolean;
  strictMode?: boolean;
}

export const DEFAULT_PARSER_OPTIONS: ParserOptions = {
  extractSkills: true,
  extractEducation: true,
  extractExperience: true,
  strictMode: false,
};
