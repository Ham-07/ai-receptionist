-- ==========================================
-- AI Receptionist Platform — Phase 7 Database Migration
-- Target Database: Supabase Postgres (Free Tier)
-- Schema: leads table with public INSERT allowed and NO public SELECT
-- ==========================================

-- 1. Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new', -- 'new' | 'contacted' | 'closed'
  created_at timestamptz default now()
);

-- 2. Index on business_id for dashboard performance
create index if not exists idx_leads_business_id on public.leads(business_id);
create index if not exists idx_leads_status on public.leads(status);

-- 3. Enable Row Level Security (RLS) immediately (Mandatory Rule)
alter table public.leads enable row level security;

-- 4. Create RLS Policy allowing public INSERT for anonymous lead submissions
drop policy if exists "Allow public insert to leads" on public.leads;
create policy "Allow public insert to leads"
  on public.leads
  for insert
  with check (true);

-- NOTE: NO public SELECT policy is created. Anonymous visitors can write leads,
-- but can NEVER read lead records back. Dashboard access will be configured in Phase 8.
