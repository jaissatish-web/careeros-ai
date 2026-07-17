-- Quick seed for CareerOS AI Gulf Career Database
-- Run this in Supabase SQL Editor

-- Enable extensions
create extension if not exists "uuid-ossp";

-- Gulf Companies seed data
insert into public.companies (name, slug, country, industry, description, avg_salary_min, avg_salary_max, job_count) values
('Saudi Aramco', 'saudi-aramco', 'sa', 'Oil & Gas', 'Saudi Arabian Oil Company - World''s largest oil producer', 8000, 25000, 127),
('NEOM', 'neom', 'sa', 'Construction', 'Futuristic city project in Saudi Arabia', 6000, 18000, 89),
('Aramco Digital', 'aramco-digital', 'sa', 'Technology', 'Digital transformation arm of Saudi Aramco', 5000, 15000, 45),
('Emirates Group', 'emirates-group', 'ae', 'Aviation', 'Emirates Airlines and dnata - Major UAE employer', 4000, 12000, 84),
('ADNOC', 'adnoc', 'ae', 'Oil & Gas', 'Abu Dhabi National Oil Company', 6000, 20000, 67),
('QatarEnergy', 'qatarenergy', 'qa', 'Oil & Gas', 'Qatar''s national oil company', 7000, 18000, 63),
('Qatar Airways', 'qatar-airways', 'qa', 'Aviation', 'Qatar''s flag carrier airline', 3000, 10000, 42),
('Kuwait Petroleum Corporation', 'kuwait-petroleum', 'kw', 'Oil & Gas', 'Kuwait''s national oil company', 5000, 15000, 42),
('National Bank of Kuwait', 'nbk', 'kw', 'Finance', 'Leading Kuwaiti bank', 3000, 9000, 38),
('Petroleum Development Oman', 'pdo-oman', 'om', 'Oil & Gas', 'Oman''s leading oil & gas company', 4500, 12000, 28),
('Bank Muscat', 'bank-muscat', 'om', 'Finance', 'Oman''s largest bank', 2500, 7000, 22);

-- Gulf Visa Knowledge seed
insert into public.career_knowledge (category, country, title, content, tags) values
('visa', 'sa', 'Saudi Nitaqat System', 'The Nitaqat system classifies companies by Saudization ratio. Green zone = full hiring allowed. Red zone = expat quotas restricted.', ARRAY['visa', 'nitaqat', 'saudi-arabia']),
('visa', 'ae', 'UAE Golden Visa', '10-year residency visa for investors, entrepreneurs, professionals. Requires proof of income or investment.', ARRAY['visa', 'golden-visa', 'uae']),
('visa', 'qa', 'Qatar Work Visa', 'Requires employer sponsorship. Qatarization program prioritizes Qatari citizens for government positions.', ARRAY['visa', 'qatarization', 'qatar']);

-- Labor Law seeds
insert into public.career_knowledge (category, country, title, content, tags) values
('labor-law', 'sa', 'Saudi Working Hours', '8 hours/day, 48 hours/week. Ramadan hours reduced to 6-7 hours/day.', ARRAY['working-hours', 'ramadan']),
('labor-law', 'ae', 'UAE Annual Leave', '30 days minimum annual leave. End-of-service gratuity payment calculated at 21+ days per year.', ARRAY['leave', 'gratuity']);