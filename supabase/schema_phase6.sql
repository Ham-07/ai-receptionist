-- ==========================================
-- AI Receptionist Platform — Phase 6 Database Migration
-- Target Database: Supabase Postgres (Free Tier)
-- Schema: rate_limits table for free-tier-compatible rate limiting
-- ==========================================

-- 1. Create rate_limits table
-- Server-side (service role) access only. No public/authenticated policies.
create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  window_start timestamptz not null default now(),
  request_count int not null default 0
);

-- 2. Indexes for fast per-business window lookups and stale-window cleanup
create index if not exists idx_rate_limits_business_id on public.rate_limits(business_id);
create index if not exists idx_rate_limits_window_start on public.rate_limits(window_start);

-- 3. Enable Row Level Security (RLS) immediately
alter table public.rate_limits enable row level security;

-- NOTE: No policies are created. With RLS enabled and zero policies, every
-- role except the service role is denied. The service role bypasses RLS, which
-- is exactly what we need — the chat route uses the service role key server-side
-- only. This table is never exposed to the client.