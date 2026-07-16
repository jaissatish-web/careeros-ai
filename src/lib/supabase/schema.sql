# Database schema for CareerOS AI - Gulf Career Platform

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  country text check (country in ('sa', 'ae', 'qa', 'kw', 'bh', 'om', 'jo', 'eg', 'iq', 'lb')),
  city text,
  preferred_language text default 'en' check (preferred_language in ('en', 'ar')),
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Resumes table
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade,
  title text not null,
  content jsonb,
  parsed_data jsonb,
  ats_score jsonb,
  version integer default 1,
  is_default boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Cover letters table
create table public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade,
  title text not null,
  company text,
  role text,
  content text,
  tone text,
  template_id text,
  match_score integer,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Job applications table
create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade,
  company text not null,
  role text not null,
  location text,
  country text check (country in ('sa', 'ae', 'qa', 'kw', 'bh', 'om', 'jo', 'eg', 'iq', 'lb')),
  salary_min integer,
  salary_max integer,
  currency text default 'USD',
  status text default 'applied' check (status in ('applied', 'screening', 'interviewing', 'offer', 'rejected', 'accepted')),
  applied_date date,
  job_url text,
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Interview sessions table
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade,
  company text,
  role text,
  type text check (type in ('behavioral', 'technical', 'case-study', 'system-design', 'culture-fit')),
  questions jsonb,
  recordings jsonb,
  feedback jsonb,
  score jsonb,
  duration_seconds integer,
  created_at timestamp default now()
);

-- Companies (Gulf employers)
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  country text check (country in ('sa', 'ae', 'qa', 'kw', 'bh', 'om')),
  industry text,
  description text,
  logo_url text,
  website text,
  linkedin_url text,
  avg_salary_min integer,
  avg_salary_max integer,
  job_count integer default 0,
  created_at timestamp default now()
);

-- Gulf career knowledge base
create table public.career_knowledge (
  id uuid primary key default gen_random_uuid(),
  category text check (category in ('visa', 'labor-law', 'culture', 'salary', 'interview', 'tax')),
  country text check (country in ('sa', 'ae', 'qa', 'kw', 'bh', 'om')),
  title text not null,
  content text,
  tags text[],
  created_at timestamp default now()
);

-- Subscription events
create table public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade,
  event_type text check (event_type in ('created', 'updated', 'cancelled', 'renewed')),
  price_cents integer,
  currency text,
  stripe_event_id text,
  created_at timestamp default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.resumes enable row level security;
alter table public.cover_letters enable row level security;
alter table public.job_applications enable row level security;
alter table public.interview_sessions enable row level security;

-- Policies
create policy "users_own_data" on public.users for all using (auth.uid() = id);
create policy "resumes_own_data" on public.resumes for all using (auth.uid() = user_id);
create policy "cover_letters_own_data" on public.cover_letters for all using (auth.uid() = user_id);
create policy "job_applications_own_data" on public.job_applications for all using (auth.uid() = user_id);
create policy "interview_sessions_own_data" on public.interview_sessions for all using (auth.uid() = user_id);
create policy "companies_public_read" on public.companies for select using (true);