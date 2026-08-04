-- ==========================================
-- AI Receptionist Platform — Phase 4 Database Migration
-- Target Database: Supabase Postgres (Free Tier)
-- Schema: faqs & services tables with RLS enabled
-- ==========================================

-- 1. Create faqs table
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

-- Index on business_id for fast relational queries
create index if not exists idx_faqs_business_id on public.faqs(business_id);

-- Enable RLS on faqs
alter table public.faqs enable row level security;

-- Public read access policy for faqs
drop policy if exists "Allow public read access to faqs" on public.faqs;
create policy "Allow public read access to faqs"
  on public.faqs
  for select
  using (true);

-- 2. Create services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- Index on business_id for fast relational queries
create index if not exists idx_services_business_id on public.services(business_id);

-- Enable RLS on services
alter table public.services enable row level security;

-- Public read access policy for services
drop policy if exists "Allow public read access to services" on public.services;
create policy "Allow public read access to services"
  on public.services
  for select
  using (true);

-- 3. Seed FAQs & Services for smile-dental
-- Business ID for smile-dental: 'b1000000-0000-0000-0000-000000000001'
insert into public.faqs (business_id, question, answer)
values
(
  'b1000000-0000-0000-0000-000000000001',
  'Do you accept new dental patients?',
  'Yes! We welcome new patients of all ages. You can schedule your initial appointment through our concierge.'
),
(
  'b1000000-0000-0000-0000-000000000001',
  'What insurance plans do you accept?',
  'We accept most major PPO dental insurance providers including Delta Dental, Cigna, MetLife, and Aetna.'
),
(
  'b1000000-0000-0000-0000-000000000001',
  'How long does a routine cleaning take?',
  'A standard preventive cleaning and oral examination takes approximately 45 to 60 minutes.'
)
on conflict do nothing;

insert into public.services (business_id, name, description)
values
(
  'b1000000-0000-0000-0000-000000000001',
  'Preventive Teeth Cleaning',
  'Comprehensive oral examination, ultrasonic plaque removal, polishing, and oral cancer screening.'
),
(
  'b1000000-0000-0000-0000-000000000001',
  'Professional Laser Whitening',
  'In-office teeth whitening delivering up to 8 shades brighter teeth in a single 60-minute session.'
),
(
  'b1000000-0000-0000-0000-000000000001',
  'Porcelain Crowns & Veneers',
  'Custom-crafted ceramic crowns and aesthetic veneers designed for natural strength and beauty.'
)
on conflict do nothing;

-- 4. Seed FAQs & Services for apex-law
-- Business ID for apex-law: 'b2000000-0000-0000-0000-000000000002'
insert into public.faqs (business_id, question, answer)
values
(
  'b2000000-0000-0000-0000-000000000002',
  'What legal areas do you specialize in?',
  'We specialize in corporate governance, intellectual property defense, commercial litigation, and contract advisory.'
),
(
  'b2000000-0000-0000-0000-000000000002',
  'How much is the initial consultation fee?',
  'We offer a complimentary 15-minute preliminary case evaluation for prospective commercial clients.'
)
on conflict do nothing;

insert into public.services (business_id, name, description)
values
(
  'b2000000-0000-0000-0000-000000000002',
  'Corporate Governance & Advisory',
  'Strategic counsel on entity structuring, shareholder agreements, compliance, and venture financing.'
),
(
  'b2000000-0000-0000-0000-000000000002',
  'Commercial Contract Drafting',
  'Custom drafting and rigorous risk-mitigation review of enterprise software and vendor agreements.'
),
(
  'b2000000-0000-0000-0000-000000000002',
  'Intellectual Property Defense',
  'Trademark registration, patent portfolio management, and copyright infringement protection.'
)
on conflict do nothing;
