-- ==========================================
-- AI Receptionist Platform — Phase 3 Database Migration
-- Target Database: Supabase Postgres (Free Tier)
-- ==========================================

-- 1. Create businesses table
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  business_name text not null,
  logo text,
  primary_color text,
  phone text,
  email text,
  business_hours jsonb,
  widget_settings jsonb,
  created_at timestamptz default now()
);

-- 2. Create index on slug for fast query performance
create index if not exists idx_businesses_slug on public.businesses (slug);

-- 3. Enable Row Level Security (RLS) immediately
alter table public.businesses enable row level security;

-- 4. Create RLS policy for public read access (anonymous visitors can read branding & info)
drop policy if exists "Allow public read access to businesses" on public.businesses;

create policy "Allow public read access to businesses"
  on public.businesses
  for select
  using (true);

-- 5. Seed initial test businesses
insert into public.businesses (id, slug, business_name, logo, primary_color, phone, email, business_hours, widget_settings)
values
(
  'b1000000-0000-0000-0000-000000000001',
  'smile-dental',
  'Smile Dental Clinic',
  null,
  '#0ea5e9',
  '+1 (555) 234-5678',
  'contact@smiledental.com',
  '{"monday": "8:00 AM - 5:00 PM", "tuesday": "8:00 AM - 5:00 PM", "wednesday": "8:00 AM - 5:00 PM", "thursday": "8:00 AM - 5:00 PM", "friday": "8:00 AM - 4:00 PM", "saturday": "9:00 AM - 1:00 PM", "sunday": "Closed"}'::jsonb,
  '{"position": "bottom-right", "greeting": "Hello! Welcome to Smile Dental Clinic. How can we help your smile today?", "themeColor": "#0ea5e9"}'::jsonb
),
(
  'b2000000-0000-0000-0000-000000000002',
  'apex-law',
  'Apex Law Group',
  null,
  '#6366f1',
  '+1 (555) 987-6543',
  'info@apexlaw.com',
  '{"monday": "9:00 AM - 6:00 PM", "tuesday": "9:00 AM - 6:00 PM", "wednesday": "9:00 AM - 6:00 PM", "thursday": "9:00 AM - 6:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "Closed", "sunday": "Closed"}'::jsonb,
  '{"position": "bottom-right", "greeting": "Welcome to Apex Law Group. Connect with our legal concierge assistant.", "themeColor": "#6366f1"}'::jsonb
)
on conflict (slug) do update set
  business_name = excluded.business_name,
  phone = excluded.phone,
  email = excluded.email,
  primary_color = excluded.primary_color,
  business_hours = excluded.business_hours,
  widget_settings = excluded.widget_settings;
