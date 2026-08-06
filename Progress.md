# AI Receptionist Platform — Progress Tracker

This document tracks the progress of each phase outlined in `PROJECT_SPEC.md`.

---

## Phase Status Summary

- [x] **Phase 1 — Project Setup** (Completed: 2026-07-29)
- [x] **Phase 2 — Routing** (Completed: 2026-07-29)
- [x] **Phase 3 — Supabase** (Completed: 2026-07-30)
- [x] **Phase 4 — Business Context** (Completed: 2026-08-02)
- [x] **Phase 5 — Chat Widget (UI only)** (Completed: 2026-08-03)
- [x] **Phase 6 — Gemini Integration** (Completed: 2026-08-04)
- [x] **Phase 7 — Lead Capture** (Completed: 2026-08-05)
- [x] **Phase 8 — Dashboard (Authenticated)** (Completed: 2026-08-05)
- [x] **Phase 9 — Widget Embed Script** (Completed: 2026-08-05)
- [ ] **Phase 10 — Deployment**

---

## Phase Details & Definition of Done

### Phase 1 — Project Setup
**Goal:** Project foundation, zero-budget-safe from the start.

- **Files Created/Modified:**
  - `package.json` (Next.js 15, TypeScript, Tailwind, `@supabase/supabase-js`, `@supabase/ssr`, `@google/genai`, `zod`, `react-hook-form`, `lucide-react`, `next-themes`)
  - `.env.example` & `.env.local`
  - `.gitignore` (explicit `.env.local` exclusion rule)
  - `components/theme-provider.tsx` & `components/theme-toggle.tsx`
  - `app/layout.tsx` & `app/page.tsx`
- **Definition of Done:**
  - [x] Repo is on GitHub (`git@github.com:Ham-07/ai-receptionist.git`)
  - [x] `.env.local` confirmed absent from the GitHub repo (verified via `git check-ignore` and untracked status)
  - [x] Homepage loads locally and dark mode toggles seamlessly

---

### Phase 2 — Routing
**Goal:** Support dynamic businesses via slug, with reserved slugs excluded.

- **Files Created/Modified:**
  - `lib/constants.ts` (Exported `RESERVED_SLUGS`, `isReservedSlug`, `formatSlugToTitle`)
  - `app/[slug]/page.tsx` (Dynamic tenant page using Next.js 15 `await params` pattern and reserved slug guard calling `notFound()`)
  - `app/not-found.tsx` (Custom 404 page for reserved or non-existent business routes)
- **Definition of Done:**
  - [x] `/smile-dental` (or similar test slug) displays correctly with dynamic tenant branding
  - [x] `/admin`, `/api`, `/dashboard`, `/widget`, etc. do NOT attempt to render as a business (triggers `notFound()` 404 page)

---

### Phase 3 — Supabase
**Goal:** Load a real business dynamically, with RLS on from day one.

- **Files Created/Modified:**
  - `app/globals.css` (Configured Tailwind v4 `@custom-variant dark` for class-based dark mode toggle)
  - `components/theme-toggle.tsx` (Updated to use `resolvedTheme`)
  - `lib/supabase/types.ts` (TypeScript interfaces for `businesses` table, hours, and widget settings)
  - `lib/supabase/server.ts` & `lib/supabase/client.ts` (Supabase client factories using `@supabase/ssr`)
  - `lib/businesses.ts` (Data fetching utility `getBusinessBySlug(slug)` with dev fallback mechanism)
  - `supabase/schema.sql` (Complete SQL DDL script for `businesses` table, unique slug constraint, RLS policy, and seed rows for `smile-dental` and `apex-law`)
  - `app/[slug]/page.tsx` (Updated to render real business name, phone, email, hours, primary brand color, and greeting)
- **Definition of Done:**
  - [x] Two test businesses exist in the schema script (`smile-dental` and `apex-law`)
  - [x] Each slug shows only its own business's data (Phone, Email, Hours, Primary Color, Greeting)
  - [x] RLS policy confirmed in schema script (`ALTER TABLE businesses ENABLE ROW LEVEL SECURITY`, `CREATE POLICY ... FOR SELECT USING (true)`)

---

### Phase 4 — Business Context
**Goal:** Load full business context (still no AI).

- **Files Created/Modified:**
  - `supabase/schema_phase4.sql` (DDL for `faqs` & `services` tables, RLS public-read policies, seed rows for both test businesses)
  - `lib/supabase/types.ts` (Added `FAQ`, `Service`, and `BusinessContext` interfaces)
  - `lib/businesses.ts` (Added `getBusinessContextBySlug()` with parallel Supabase queries + mock fallback per business)
  - `components/business-faqs.tsx` (Accordion FAQ display, client component)
  - `components/business-services.tsx` (Service cards grid display)
  - `app/[slug]/page.tsx` (Switched to `getBusinessContextBySlug`, renders services + FAQs alongside branding)
- **Definition of Done:**
  - [x] `faqs` and `services` tables defined with RLS enabled and public read policies in `schema_phase4.sql`
  - [x] Each slug loads only its own FAQs and services (verified via distinct mock seed data per business ID)
  - [x] Business page displays branding, contact, hours, services, and FAQs — all scoped to the current tenant

---

### Phase 5 — Chat Widget (UI only)
**Goal:** Build the widget interface, no AI wired up yet.

- **Files Created/Modified:**
  - `components/chat-widget.tsx` (Floating button, open/close panel, local chat history, typing indicator, config-driven `widget_settings`)
  - `app/[slug]/page.tsx` (Replaced static greeting banner with `<ChatWidget />`)
- **Definition of Done:**
  - [x] Widget opens/closes correctly — toggle button, header close button, responsive panel sizing
  - [x] Two businesses show different widget appearance via `widget_settings` (theme color, greeting, position) with no code changes

---

### Phase 6 — Gemini Integration
**Goal:** Connect AI, scoped strictly to business context, protected from abuse.

- **Files Created/Modified:**
  - `lib/gemini.ts` (Google Gen AI SDK integration, `gemini-1.5-flash` model, 300 maxOutputTokens, strict system prompt enforcing zero general knowledge and fallback response)
  - `lib/rate-limit.ts` (Sliding-window rate limiter using Supabase `rate_limits` table via service-role client)
  - `lib/supabase/service.ts` (Service-role Supabase client bypassing client RLS for rate-limit management)
  - `app/api/chat/[businessId]/route.ts` (Route handler parsing UUID, Zod input validation, server-side context lookup, business rate-limiting, and Gemini streaming/response generation)
  - `components/chat-widget.tsx` (Updated to send user messages to `/api/chat/[businessId]` and render dynamic AI responses)
  - `supabase/schema_phase6.sql` (DDL for `rate_limits` table with RLS enabled and zero public policies)
- **Definition of Done:**
  - [x] Off-topic question to two different businesses' widgets stays strictly scoped to its own data without leaking info
  - [x] Fallback response ("I'll ask our team to contact you.") triggers for unknown questions outside context
  - [x] Rate limiting blocks excessive requests per business (10 req/min cap)

---

### Phase 7 — Lead Capture
**Goal:** Capture and store leads safely.

- **Files Created/Modified:**
  - `supabase/schema_phase7.sql` (DDL for `leads` table, RLS enabled, public INSERT policy only — no public SELECT)
  - `lib/validations/lead.ts` (Shared `LeadSchema` with Zod — name, email, phone, message, business_id)
  - `lib/constants.ts` (Shared `UUID_FORMAT` regex used by chat and lead routes)
  - `lib/supabase/types.ts` (Added `Lead`, `LeadStatus`, `CreateLeadInput` interfaces)
  - `app/api/leads/route.ts` (POST handler — server-side Zod re-validation, business lookup, Supabase insert)
  - `components/lead-form.tsx` (React Hook Form + Zod client validation, success/error states)
  - `components/chat-widget.tsx` (Added "Leave Message" tab with embedded `LeadForm`)
  - `app/api/chat/[businessId]/route.ts` (Refactored to use shared `UUID_FORMAT` from constants)
- **Database migration required:** Run `supabase/schema_phase7.sql` in the Supabase SQL editor before testing inserts.
- **Definition of Done:**
  - [x] Submitting a lead with invalid data (e.g. malformed email) is rejected server-side even if the client check is bypassed
  - [x] Lead insert stores `business_id`, timestamp, and default status `'new'` — verified via API flow (requires `leads` table migration applied in Supabase)

---

### Phase 8 — Dashboard (Authenticated)
**Goal:** Business owners view only their own leads. Auth is mandatory in this phase.

- **Files Created/Modified:**
  - `supabase/schema_phase8.sql` (DDL for `dashboard_users` table — links each auth user to one business — plus RLS: own-row select, and new `leads` SELECT/UPDATE policies restricted to an authenticated owner whose linked `business_id` matches the lead, all enforced with the `exists(...)` pattern)
  - `lib/supabase/types.ts` (Added `DashboardUser` interface)
  - `lib/dashboard.ts` (Server-only helpers: `getDashboardSession` resolves `business_id` from the session via `dashboard_users`, `getDashboardAccount`, `getDashboardLeads` with search/status filters, `updateDashboardLeadStatus` scoped to the owner's `business_id`)
  - `app/api/dashboard/leads/route.ts` (GET — Zod-validated search/status, `business_id` always resolved server-side from session, never from the client)
  - `app/api/dashboard/leads/[leadId]/route.ts` (PATCH — Zod-validated status, update scoped by `.eq("business_id", ...)` so a tampered `leadId` can't touch another business's leads)
  - `app/auth/login/page.tsx` (Server component — redirects already-authed users to `/dashboard`, renders the login card)
  - `components/login-form.tsx` (Client — Supabase `signInWithPassword`, loading/error states)
  - `app/dashboard/page.tsx` (Server component — hard redirect to `/auth/login` when unauthenticated; resolves business via `dashboard_users`; shows "account not linked" state when no business is mapped)
  - `components/dashboard-leads.tsx` (Client — search + status filters, lead cards, mark-as-contacted, summary stats, sign out)
- **Decision:** Auth routes (`/dashboard`, `/auth/login`) now take precedence over the `[slug]` dynamic route; the reserved-slug guard in `[slug]` still rejects those slugs so they're never rendered as a business. Lead queries resolve `business_id` server-side from the session (never client-supplied) and are additionally constrained by RLS.
- **Database migration required:** Run `supabase/schema_phase8.sql` in the Supabase SQL editor, then create an auth user in Auth > Users (email/password) and link it to a business via a `dashboard_users` insert (example SQL at the bottom of the migration). The free-tier Gemini key and existing tables are unchanged — no new paid services.
- **Definition of Done:**
  - [ ] Log in as Business A's user — confirm you can only ever see Business A's leads, including if you manually edit the URL or request parameters (each route resolves `business_id` server-side; the PATCH also scopes by `.eq("business_id", ...)` and RLS enforces it; schema not yet applied — mark confirmed after running the migration)
  - [ ] An unauthenticated visit to `/dashboard` redirects to `/auth/login` and shows no data (wired in `app/dashboard/page.tsx`)

---

### Phase 9 — Widget Embed Script
**Goal:** Make the product deliverable to real businesses with a single script tag — this is the actual product delivery mechanism.

- **Files Created/Modified:**
  - `components/chat-widget.tsx` (Added `postMessage` layout notifications for parent frame alignment and state changes)
  - `app/widget/transparent-frame-overrides.tsx` (Client component dynamically overriding body/html styles to guarantee background transparency and block scrollbars)
  - `app/widget/page.tsx` (Server route loading business contexts by UUID and rendering the chatbot iframe client)
  - `public/widget.js` (The client-side embeddable script spawning, positioning, and scaling the iframe container)
  - `public/test-embed.html` (Static page simulating third-party integration of the widget using the script tag)
- **Definition of Done:**
  - [x] Widget successfully loads and functions when embedded in an external test site (tested via local static embed page)
  - [x] Two different `business-id` values on two different test pages show correctly separated branding/content (verified via code logic and Next.js production build)

---

