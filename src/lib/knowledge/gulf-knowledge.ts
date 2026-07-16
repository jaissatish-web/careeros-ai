import type { CareerKnowledge } from '@/lib/supabase/client'

// Gulf-specific knowledge templates
export const GULF_VISA_KNOWLEDGE: Partial<CareerKnowledge>[] = [
  {
    category: 'visa',
    country: 'sa',
    title: 'Saudi Arabia Nitaqat System Explained',
    content: 'Saudi Arabia uses the Nitaqat system to classify companies based on Saudization ratios...',
    tags: ['visa', 'saudi-arabia', 'nitaqat', 'quota']
  },
  {
    category: 'visa',
    country: 'ae',
    title: 'UAE Golden Visa Eligibility',
    content: 'The UAE Golden Visa offers 10-year residency for qualified professionals...',
    tags: ['visa', 'uae', 'golden-visa', 'residency']
  },
  {
    category: 'visa',
    country: 'qa',
    title: 'Qatar Work Visa Requirements',
    content: 'Qatar requires sponsorship from a registered company. The Qatarization program...',
    tags: ['visa', 'qatar', 'qatarization', 'sponsorship']
  },
  {
    category: 'visa',
    country: 'kw',
    title: 'Kuwait Expat Quotas',
    content: 'Kuwait has strict expat quotas in the public sector. Private sector hiring...',
    tags: ['visa', 'kuwait', 'quota', 'kuwaitization']
  },
  {
    category: 'visa',
    country: 'bh',
    title: 'Bahrain Work Permit Process',
    content: 'Bahrain offers straightforward work permit process through employer sponsorship...',
    tags: ['visa', 'bahrain', 'work-permit']
  },
  {
    category: 'visa',
    country: 'om',
    title: 'Oman Employment Visa Guide',
    content: 'Oman provides employment visas through company sponsorship with residency permits...',
    tags: ['visa', 'oman', 'employment']
  },
  {
    category: 'labor-law',
    country: 'sa',
    title: 'Saudi Arabia Labor Law for Expats',
    content: 'Working hours: 8 hours/day, 48 hours/week. Annual leave: 21+ days...',
    tags: ['labor-law', 'saudi-arabia', 'working-hours']
  },
  {
    category: 'labor-law',
    country: 'ae',
    title: 'UAE Labor Law Basics',
    content: 'UAE labor law provides 30 days annual leave, 48 hours work week...',
    tags: ['labor-law', 'uae', 'working-hours']
  },
  {
    category: 'salary',
    country: 'ae',
    title: 'Dubai Tech Salary Ranges 2025',
    content: 'Software Engineer: $4K-12K/month. Senior roles: $12K-25K. CTO: $30K+...',
    tags: ['salary', 'dubai', 'tech', 'benchmarks']
  },
  {
    category: 'culture',
    country: 'sa',
    title: 'Saudi Business Culture Essentials',
    content: 'Business meetings start with Arabic coffee. Dress modestly. Handshakes...',
    tags: ['culture', 'saudi-arabia', 'business-etiquette']
  }
]

// Interview patterns for Gulf employers
export const GULF_INTERVIEW_PATTERNS = {
  saudi: {
    behavioral_questions: [
      'Tell me about yourself and your experience in the Gulf region',
      'How do you handle working in a multicultural environment?',
      'Describe your experience with Islamic business practices',
      'What motivates you to work in Saudi Arabia specifically?'
    ],
    technical_focus: ['oil-gas', 'construction', 'finance', 'telecom']
  },
  uae: {
    behavioral_questions: [
      'Why do you want to join our Dubai team?',
      'How do you adapt to fast-paced environments?',
      'Describe your experience with international clients',
      'What do you know about UAE Vision 2071?'
    ],
    technical_focus: ['fintech', 'logistics', 'tourism', 'renewable-energy']
  },
  qatar: {
    behavioral_questions: [
      'What interests you about working in Qatar?',
      'How do you handle high-profile projects?',
      'Describe your experience with FIFA or major events',
      'What do you know about Qatar National Vision 2030?'
    ],
    technical_focus: ['construction', 'sports', 'finance', 'infrastructure']
  }
}