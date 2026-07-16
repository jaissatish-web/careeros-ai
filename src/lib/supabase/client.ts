import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  full_name?: string
  phone?: string
  country?: string
  city?: string
  preferred_language?: string
  subscription_tier?: string
  created_at?: string
  updated_at?: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  content?: any
  parsed_data?: any
  ats_score?: any
  version?: number
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export interface CoverLetter {
  id: string
  user_id: string
  title: string
  company?: string
  role?: string
  content?: string
  tone?: string
  template_id?: string
  match_score?: number
  created_at?: string
  updated_at?: string
}

export interface JobApplication {
  id: string
  user_id: string
  company: string
  role: string
  location?: string
  country?: string
  salary_min?: number
  salary_max?: number
  currency?: string
  status?: string
  applied_date?: string
  job_url?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface InterviewSession {
  id: string
  user_id: string
  company?: string
  role?: string
  type?: string
  questions?: any
  recordings?: any
  feedback?: any
  score?: any
  duration_seconds?: number
  created_at?: string
}

export interface Company {
  id: string
  name: string
  slug?: string
  country?: string
  industry?: string
  description?: string
  logo_url?: string
  website?: string
  linkedin_url?: string
  avg_salary_min?: number
  avg_salary_max?: number
  job_count?: number
}

export interface CareerKnowledge {
  id: string
  category?: string
  country?: string
  title: string
  content?: string
  tags?: string[]
  created_at?: string
}