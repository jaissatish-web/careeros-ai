import { ResumeData, Experience, Education, SkillCategory, ParserOptions, DEFAULT_PARSER_OPTIONS, Project, Certification, Language } from './types';

// EMAIL_REGEX
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i;
const URL_REGEX = /https?:\/\/[^\s,;)]+/g;
const DATE_RANGE_REGEX = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)\s*\.?\s*\d{4}\s*[-–—to]+\s*(Present|Current|Now|\w+\.?\s*\d{4})/gi;
const GPA_REGEX = /GPA[:\s]*(\d\.?\d{0,2})\s*\/?\s*(\d\.?\d{0,2})/i;
const QUANT_METRIC_REGEX = /\d+[\d,]*\.?\d*\s*[$%+\-]|\+\d+%|\d+%/g;

const SECTION_HEADERS: Record<string, string[]> = {
  summary: ['summary', 'profile', 'about', 'objective', 'professional summary', 'about me', 'career objective', 'personal statement'],
  experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience', 'career history', 'positions held'],
  education: ['education', 'academic', 'academics', 'educational background', 'qualifications', 'degrees'],
  skills: ['skills', 'technical skills', 'technologies', 'core competencies', 'competencies', 'tools', 'technologies & tools', 'technical expertise', 'proficiencies'],
  projects: ['projects', 'key projects', 'personal projects', 'side projects', 'portfolio', 'selected projects'],
  certifications: ['certifications', 'certificates', 'licenses', 'credentials', 'professional certifications', 'accreditations'],
  languages: ['languages', 'language skills', 'language proficiency'],
  awards: ['awards', 'honors', 'achievements', 'accomplishments', 'recognition', 'distinctions'],
  volunteer: ['volunteer', 'volunteering', 'community service', 'community involvement'],
};

function extractContactInfo(text: string): { email: string; phone: string; linkedin: string; github: string; website: string } {
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);
  const linkedinMatch = text.match(LINKEDIN_REGEX);
  const githubMatch = text.match(GITHUB_REGEX);
  
  let website = '';
  const allUrls = text.match(URL_REGEX);
  if (allUrls) {
    for (const url of allUrls) {
      if (!url.includes('linkedin.com') && !url.includes('github.com')) {
        website = url;
        break;
      }
    }
  }

  return {
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0].trim() : '',
    linkedin: linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '',
    github: githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '',
    website,
  };
}

function extractName(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l.length < 60);
  for (const line of lines.slice(0, 5)) {
    if (line.match(EMAIL_REGEX) || line.match(PHONE_REGEX) || line.match(URL_REGEX)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5) {
      const capitalizedCount = words.filter(w => w[0] === w[0]?.toUpperCase() && w[0] !== w[0]?.toLowerCase()).length;
      if (capitalizedCount >= words.length - 1 && !line.match(/[^a-zA-Z\s.'-]/)) {
        return line.replace(/[^a-zA-Z\s.'-]/g, '').trim();
      }
    }
  }
  return '';
}

function extractLocation(text: string): string {
  const locationRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)/;
  const match = text.match(locationRegex);
  if (match) return match[1];
  
  const cityStateRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)/i;
  const match2 = text.match(cityStateRegex);
  return match2 ? match2[0] : '';
}

function identifySectionHeader(line: string): string | null {
  const normalized = line.toLowerCase().replace(/[^a-z\s&]/g, '').trim();
  for (const [section, headers] of Object.entries(SECTION_HEADERS)) {
    for (const header of headers) {
      if (normalized === header || normalized.startsWith(header + ' ') || normalized.endsWith(' ' + header)) {
        return section;
      }
    }
  }
  if (/^.{0,30}:$/.test(line.trim())) {
    const potential = line.trim().toLowerCase().replace(':', '').trim();
    for (const [section, headers] of Object.entries(SECTION_HEADERS)) {
      if (headers.some(h => potential.includes(h))) return section;
    }
  }
  return null;
}

function splitIntoSections(text: string): { type: string; content: string; startLine: number }[] {
  const lines = text.split('\n');
  const sections: { type: string; content: string; startLine: number }[] = [];
  let currentSection = { type: 'header', content: '', startLine: 0 };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    
    const sectionType = identifySectionHeader(line);
    if (sectionType && line.length < 50) {
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection });
      }
      currentSection = { type: sectionType, content: '', startLine: i };
    } else {
      currentSection.content += lines[i] + '\n';
    }
  }

  if (currentSection.content.trim()) {
    sections.push({ ...currentSection });
  }

  return sections;
}

function parseExperience(content: string): Experience[] {
  const experiences: Experience[] = [];
  const blocks = content.split(/\n\s*\n|\n(?=[A-Z])/);
  
  let current: Partial<Experience> = {};
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    const dateMatch = block.match(DATE_RANGE_REGEX);
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    if (dateMatch || block.length > 30) {
      if (current.title || current.company) {
        experiences.push({
          company: current.company || '',
          title: current.title || '',
          location: current.location || '',
          startDate: current.startDate || '',
          endDate: current.endDate || '',
          current: current.current || false,
          description: current.description || [],
          bulletPoints: current.bulletPoints || [],
        });
      }
      current = {};
      
      if (dateMatch) {
        const dateStr = dateMatch[0];
        const parts = dateStr.split(/[-–—]+/);
        current.startDate = parts[0]?.trim() || '';
        current.endDate = parts[1]?.trim() || '';
        current.current = /present|current/i.test(dateStr);
      }
      
      for (const line of lines) {
        if (line.match(DATE_RANGE_REGEX)) continue;
        if (line.match(/^\d/) || line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          current.bulletPoints = current.bulletPoints || [];
          current.bulletPoints.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (!current.title) {
          current.title = line;
        } else if (!current.company) {
          current.company = line;
        }
      }
    }
  }
  
  if (current.title || current.company) {
    experiences.push({
      company: current.company || '',
      title: current.title || '',
      location: current.location || '',
      startDate: current.startDate || '',
      endDate: current.endDate || '',
      current: current.current || false,
      description: current.description || [],
      bulletPoints: current.bulletPoints || [],
    });
  }

  // Fill locations from text
  const fullContent = content;
  for (const exp of experiences) {
    if (!exp.location) {
      const locMatch = fullContent.match(new RegExp(exp.company + '.{0,100}([A-Z][a-z]+,?\s*[A-Z]{2})', 'i'));
      if (locMatch) exp.location = locMatch[1];
    }
  }

  return experiences;
}

function parseEducation(content: string): Education[] {
  const educations: Education[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let current: Partial<Education> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (['Bachelor', 'Master', 'PhD', 'Doctorate', 'Associate', 'B.S.', 'M.S.', 'B.A.', 'M.A.', 'BSc', 'MBA', 'Bachelor\'s', 'Master\'s', 'Doctor of'].some(d => line.includes(d))) {
      if (current.institution || current.degree) {
        educations.push(current as Education);
      }
      current = { degree: line, institution: '', field: '', location: '', startDate: '', endDate: '', gpa: '', details: [] };
      
      for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 3); j++) {
        if (j === i) continue;
        const gpaMatch = lines[j].match(GPA_REGEX);
        if (gpaMatch) current.gpa = gpaMatch[1] + '/' + (gpaMatch[2] || '4.0');
        const dateMatch = lines[j].match(/(20\d{2}|19\d{2})/);
        if (dateMatch && !current.startDate) {
          if (!current.startDate) current.startDate = lines[j];
          else if (!current.endDate) current.endDate = lines[j];
        }
        if (lines[j].length > 5 && !lines[j].match(/^\d/) && !lines[j].startsWith('•') && !current.institution && j < i) {
          current.institution = lines[j];
        }
      }
    } else if (current.degree && !current.institution && line.length > 5) {
      current.institution = line;
    } else if (line.match(/GPA/i)) {
      const gpaMatch = line.match(GPA_REGEX);
      if (gpaMatch) current.gpa = gpaMatch[1] + '/' + (gpaMatch[2] || '4.0');
    }
  }
  
  if (current.institution || current.degree) {
    educations.push(current as Education);
  }

  return educations.map(e => ({
    institution: e.institution || '',
    degree: e.degree || '',
    field: e.field || '',
    location: e.location || '',
    startDate: e.startDate || '',
    endDate: e.endDate || '',
    gpa: e.gpa || '',
    details: e.details || [],
  }));
}

function parseSkills(content: string): SkillCategory[] {
  const categories: SkillCategory[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const knownCategories: Record<string, string[]> = {
    'Programming Languages': ['javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'php', 'scala', 'r\\b', 'perl', 'haskell', 'elixir', 'dart', 'lua'],
    'Frontend': ['react', 'angular', 'vue', 'svelte', 'next\\.js', 'nuxt', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material ui', 'chakra', 'webpack', 'vite', 'babel'],
    'Backend': ['node\\.js', 'express', 'django', 'flask', 'spring', 'rails', 'laravel', 'fastapi', 'graphql', 'rest api', 'microservices'],
    'Databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'mariadb', 'dynamodb', 'cassandra', 'neo4j', 'supabase', 'firebase'],
    'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'github actions', 'ci\\/cd', 'nginx', 'vercel', 'heroku'],
    'Tools & Others': ['git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'postman', 'vscode', 'intellij', 'linux', 'agile', 'scrum'],
  };

  // Try categorized format first
  let currentCategory: string | null = null;
  
  for (const line of lines) {
    let foundCategory = false;
    for (const [cat, _] of Object.entries(knownCategories)) {
      if (line.toLowerCase().includes(cat.toLowerCase().split(' ')[0]) || line.toLowerCase().replace(/[^a-z]/g, '') === cat.toLowerCase().replace(/[^a-z]/g, '')) {
        currentCategory = cat;
        foundCategory = true;
        if (!categories.find(c => c.category === cat)) {
          categories.push({ category: cat, skills: [] });
        }
        break;
      }
    }
    if (!foundCategory && (line.includes(',') || line.includes('•') || line.includes('-'))) {
      const skills = line.split(/[,•;-]\s*/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
      if (skills.length > 0) {
        if (!currentCategory) {
          currentCategory = 'Other';
          if (!categories.find(c => c.category === 'Other')) {
            categories.push({ category: 'Other', skills: [] });
          }
        }
        const cat = categories.find(c => c.category === currentCategory);
        if (cat) cat.skills.push(...skills);
      }
    }
  }

  // Fallback: extract all technical terms as uncategorized skills
  if (categories.length === 0) {
    const allSkills: string[] = [];
    for (const line of lines) {
      const items = line.split(/[,;|]\s*/);
      for (const item of items) {
        const skill = item.trim();
        if (skill.length > 1 && skill.length < 30 && !skill.match(/^\d/) && !skill.match(/^(and|or|with|using|the|and)\b/i)) {
          const isTechnical = /^[A-Z]/.test(skill) || /[\.\#\+]/.test(skill) || knownCategories['Programming Languages'].some(k => skill.toLowerCase().includes(k));
          if (isTechnical || skill.split(/\s+/).length <= 2) {
            allSkills.push(skill);
          }
        }
      }
    }
    if (allSkills.length > 0) {
      categories.push({ category: 'Skills', skills: Array.from(new Set(allSkills)).slice(0, 30) });
    }
  }

  return categories;
}

function parseProjects(content: string): Project[] {
  const projects: Project[] = [];
  const blocks = content.split(/\n\s*\n/);
  
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;
    
    const firstLine = lines[0];
    if (firstLine.length < 50 && !firstLine.match(/^\d/) && !firstLine.startsWith('•')) {
      const urlMatch = block.match(URL_REGEX);
      const techMatch = block.match(/(?:Built with|Technologies|Tech Stack|Using)[:\s]*(.+)/i);
      
      projects.push({
        name: firstLine,
        description: lines.slice(1).filter(l => !l.match(URL_REGEX) && !l.match(/Built with/i)).join(' ').slice(0, 200),
        technologies: techMatch ? techMatch[1].split(/[,;|]\s*/).map(t => t.trim()) : [],
        url: urlMatch ? urlMatch[0] : '',
      });
    }
  }
  
  return projects.slice(0, 10);
}

function parseCertifications(content: string): Certification[] {
  const certifications: Certification[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (const line of lines) {
    if (line.length > 5 && !line.match(/^\d/) && !line.startsWith('•')) {
      const dateMatch = line.match(/(20\d{2}|19\d{2})/);
      const issuerMatch = line.match(/(?:from|by|issuer[:\s]+)(.+)/i);
      certifications.push({
        name: line.replace(/(20\d{2}|19\d{2})|from|by|issuer[:\s]+/gi, '').trim(),
        issuer: issuerMatch ? issuerMatch[1].trim() : '',
        date: dateMatch ? dateMatch[0] : '',
        url: '',
      });
    }
  }
  
  return certifications.slice(0, 10);
}

function parseLanguages(content: string): Language[] {
  const languages: Language[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const proficiencyLevels = ['native', 'fluent', 'professional', 'advanced', 'intermediate', 'beginner', 'basic', 'conversational', 'working proficiency'];
  
  for (const line of lines) {
    const parts = line.split(/[:\-,;|]\s*/);
    if (parts.length >= 1) {
      const lang = parts[0].trim();
      const prof = parts.length > 1 ? parts[1].trim().toLowerCase() : '';
      const matchedProf = proficiencyLevels.find(p => prof.includes(p)) || 'proficient';
      
      if (lang.length > 2 && lang.length < 25 && !lang.match(/^\d/)) {
        languages.push({ language: lang, proficiency: matchedProf });
      }
    }
  }
  
  return languages.slice(0, 10);
}

function extractSummary(content: string): string {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let summary = '';
  
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    if (line.length > 50 && !line.match(EMAIL_REGEX) && !line.match(PHONE_REGEX) && !line.match(URL_REGEX) && !line.match(/^\d/) && !line.match(/^(name|email|phone|address|linkedin|github)/i)) {
      summary = line;
      break;
    }
  }
  
  if (!summary) {
    const allText = content.replace(/[\n\r]+/g, ' ').trim();
    const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 30 && s.trim().length < 300);
    summary = sentences[0]?.trim() || '';
  }
  
  return summary.slice(0, 500);
}

export function parseResume(text: string, options: ParserOptions = DEFAULT_PARSER_OPTIONS): ResumeData {
  const opts = { ...DEFAULT_PARSER_OPTIONS, ...options };
  
  const contactInfo = extractContactInfo(text);
  const name = extractName(text);
  const location = extractLocation(text);
  
  const sections = splitIntoSections(text);
  
  let summary = '';
  const experience: Experience[] = [];
  const education: Education[] = [];
  const skills: SkillCategory[] = [];
  const projects: Project[] = [];
  const certifications: Certification[] = [];
  const languages: Language[] = [];
  const awards: string[] = [];
  const volunteer: string[] = [];

  for (const section of sections) {
    switch (section.type) {
      case 'summary':
        summary = section.content.trim() || extractSummary(text);
        break;
      case 'experience':
        experience.push(...parseExperience(section.content));
        break;
      case 'education':
        education.push(...parseEducation(section.content));
        break;
      case 'skills':
        skills.push(...parseSkills(section.content));
        break;
      case 'projects':
        projects.push(...parseProjects(section.content));
        break;
      case 'certifications':
        certifications.push(...parseCertifications(section.content));
        break;
      case 'languages':
        languages.push(...parseLanguages(section.content));
        break;
      case 'awards':
        awards.push(...section.content.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l.length < 200));
        break;
      case 'volunteer':
        volunteer.push(...section.content.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l.length < 200));
        break;
    }
  }

  if (!summary) {
    summary = extractSummary(text);
  }

  return {
    name,
    email: contactInfo.email,
    phone: contactInfo.phone,
    location,
    linkedin: contactInfo.linkedin,
    github: contactInfo.github,
    website: contactInfo.website,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    volunteer,
  };
}

export { QUANT_METRIC_REGEX, DATE_RANGE_REGEX, GPA_REGEX, EMAIL_REGEX, PHONE_REGEX };
