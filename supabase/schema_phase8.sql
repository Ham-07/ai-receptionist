-- ==========================================
-- AI Receptionist Platform — Phase 8 Database Migration
-- Target Database: Supabase Postgres (Free Tier)
-- Schema: dashboard_users table + authenticated lead read/update policies
-- ==========================================

-- 1. Create dashboard_users table (links each auth user to exactly one business)
create table if not exists public.dashboard_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade not null unique,
  business_id uuid references public.businesses(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- 2. Indexes for fast auth->business lookups
create index if not exists idx_dashboard_users_auth_user_id on public.dashboard_users(auth_user_id);
create index if not exists idx_dashboard_users_business_id on public.dashboard_users(business_id);

-- 3. Enable Row Level Security (RLS) immediately
alter table public.dashboard_users enable row level security;

-- 4. A user can only read their OWN dashboard_users row (auth_user_id = auth.uid())
--    No public/authenticated INSERT policy — rows are linked manually by an admin
--    (e.g. in the Supabase SQL editor after creating the auth user).
drop policy if exists "Users can view own dashboard link" on public.dashboard_users;
create policy "Users can view own dashboard link"
  on public.dashboard_users
  for select
  using (auth_user_id = auth.uid());

-- 5. leads: allow authenticated dashboard users to SELECT only their own business's leads
drop policy if exists "Dashboard owner can view own leads" on public.leads;
create policy "Dashboard owner can view own leads"
  on public.leads
  for select
  using (
    exists (
      select 1
      from public.dashboard_users du
      where du.auth_user_id = auth.uid()
        and du.business_id = leads.business_id
    )
  );

-- 6. leads: allow authenticated dashboard users to UPDATE only their own business's leads
drop policy if exists "Dashboard owner can update own leads" on public.leads;
create policy "Dashboard owner can update own leads"
  on public.leads
  for update
  using (
    exists (
      select 1
      from public.dashboard_users du
      where du.auth_user_id = auth.uid()
        and du.business_id = leads.business_id
    )
  )
  with check (
    exists (
      select 1
      from public.dashboard_users du
      where du.auth_user_id = auth.uid()
        and du.business_id = leads.business_id
    )
  );

-- NOTE: leads still has NO public SELECT policy. Anonymous visitors may only
-- INSERT. Only an authenticated user linked via dashboard_users can read or
-- update leads — and only for their own business.

-- --------------------------------------------------------------------------
-- To wire up a test user for the dashboard, after creating the auth user
-- in Supabase Auth > Users (email/password), run something like:
--
--   insert into public.dashboard_users (auth_user_id, business_id)
--   values
--     ('<AUTH_USER_UUID>', 'b1000000-0000-0000-0000-000000000001'); -- smile-dental
-- --------------------------------------------------------------------------
