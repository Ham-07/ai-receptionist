# AI Receptionist Platform — PROJECT_SPEC.md
Version: MVP v2.0 (Zero-Budget Edition)

---

# Goal

Build a reusable, multi-tenant AI Receptionist platform that serves unlimited businesses from a single codebase and a single deployment.

- Business data must NEVER be hardcoded. Everything loads dynamically from Supabase using a `slug` or `business_id`.
- No feature may be implemented unless it works for multiple businesses out of the box. If a solution only works for one client, reject it and redesign it.
- The end delivery mechanism is an **embeddable widget script** that any business pastes into their own website — not a custom build per client.
- Every part of this stack must run on a free tier. This is a zero-budget project. No paid services, no paid add-ons, no "just upgrade the plan" shortcuts.

---

# Budget Constraint — Read This First

This project has **$0 budget**. Every tool choice below must stay inside a free tier:

| Layer | Tool | Free tier limit to respect |
|---|---|---|
| Hosting | Vercel (Hobby plan) | Fine for MVP; no custom domain required, `*.vercel.app` works |
| Database | Supabase (Free plan) | 500MB DB, 50k monthly active users, pauses after 1 week inactivity — ping it periodically once you have real users |
| AI | Gemini API (free tier) | Has a requests-per-minute and per-day cap — must be respected via rate limiting (see Phase 6) |
| Auth | Supabase Auth (included free) | No extra cost |
| Rate limiting | Supabase table + serverless function (NOT Redis/Upstash) | Avoid any tool that requires a paid plan past free-tier request limits |
| Domain | None required for MVP | Use the Vercel-provided subdomain until there's a paying client |

**Rule:** before adding any new package or service while building this, check it has a genuinely free tier with no credit card required. If Antigravity suggests a paid service "for reliability," reject it and ask for the free-tier-compatible alternative — this is a hard constraint, not a preference.

---

# Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Route Handlers
- **Database & Auth:** Supabase (Postgres + Row Level Security + Supabase Auth)
- **AI:** Gemini API (free tier)
- **Deployment:** Vercel (Hobby/free plan)
- **Validation:** Zod
- **Forms:** React Hook Form

---

# Architecture

## Widget delivery (public-facing side)
```
Business's own website
  ↓
<script src="https://yourapp.vercel.app/widget.js" data-business-id="xxx"></script>
  ↓
Widget loads in an isolated container (iframe or shadow DOM)
  ↓
Widget calls /api/business/[businessId] → loads branding, FAQs, services, hours
  ↓
Visitor chats → /api/chat/[businessId] → Gemini, scoped to that business's context only
  ↓
Visitor submits lead → /api/leads → stored with business_id
```

## Direct-visit flow (for demos / businesses without their own site yet)
```
Visitor
  ↓
https://yourapp.vercel.app/{slug}
  ↓
Extract slug → reject reserved slugs
  ↓
Query businesses table by slug
  ↓
Load branding + FAQs + services + contact info
  ↓
Initialize chat widget with that business's context
  ↓
Collect lead → store with business_id
```

## Dashboard flow (business-owner side — requires auth)
```
Business owner
  ↓
https://yourapp.vercel.app/dashboard
  ↓
Supabase Auth login
  ↓
Look up business_id linked to this auth user (dashboard_users table)
  ↓
All lead queries filtered server-side by that business_id — never trust a client-supplied business_id
  ↓
List / filter / search leads, mark contacted
```

---

# Database Schema

```
businesses
  id              uuid, primary key
  slug            text, unique, indexed, not null
  business_name   text, not null
  logo            text (URL)
  primary_color   text
  phone           text
  email           text
  business_hours  jsonb
  widget_settings jsonb        -- position, greeting message, theme overrides (config, not code)
  created_at      timestamptz, default now()

faqs
  id           uuid, primary key
  business_id  uuid, FK -> businesses.id, not null
  question     text, not null
  answer       text, not null

services
  id           uuid, primary key
  business_id  uuid, FK -> businesses.id, not null
  name         text, not null
  description  text

leads
  id           uuid, primary key
  business_id  uuid, FK -> businesses.id, not null
  name         text, not null
  email        text, not null
  phone        text
  message      text
  status       text, default 'new'   -- 'new' | 'contacted' | 'closed'
  created_at   timestamptz, default now()

dashboard_users
  id            uuid, primary key
  auth_user_id  uuid, FK -> auth.users.id, not null, unique
  business_id   uuid, FK -> businesses.id, not null

rate_limits                      -- free-tier-compatible rate limiting, no Redis needed
  id           uuid, primary key
  business_id  uuid, FK -> businesses.id, not null
  window_start timestamptz, not null
  request_count int, default 0
```

**Reserved slugs (never allowed as a business slug):**
`api`, `admin`, `dashboard`, `auth`, `_next`, `static`, `widget`, `login`, `signup`

---

# Row Level Security (RLS) — mandatory, not optional

RLS must be enabled on every table above from the moment tables are created — never build with it "temporarily off."

- `businesses`, `faqs`, `services`: public `SELECT` allowed (anonymous visitors need to read this to render the widget). No public `INSERT`/`UPDATE`/`DELETE`.
- `leads`: public `INSERT` allowed (a visitor submitting a lead), but **no public `SELECT`** — a visitor can write a lead but never read leads back. `SELECT`/`UPDATE` on `leads` is restricted to the authenticated dashboard user whose `dashboard_users.business_id` matches the lead's `business_id`.
- `dashboard_users`: a user can only read their own row (`auth_user_id = auth.uid()`).
- `rate_limits`: server-side (service role) access only — never exposed to the client.

---

# Rules

- Never hardcode business information — everything loads via `slug` or `business_id`.
- Every lead belongs to exactly one business, enforced by RLS, not just application logic.
- The dashboard requires authentication; there is no version of this product where lead data is publicly readable.
- Widget customization happens through `widget_settings` config, never through per-client code branches.
- Every API route validates its input with Zod before touching the database.
- Every route that reads/writes business-scoped data resolves `business_id` server-side from the authenticated session or the URL param — never trusts a hidden form field for authorization.
- Use server components where no interactivity is needed; client components only where required (widget open/close state, forms, chat).
- Keep files modular — one responsibility per file, shared logic in `/lib`.
- No new package or service without confirming it has a genuine free tier.

---

# Development Phases

Each phase ends with a **Definition of Done** checklist. Antigravity must not move to the next phase until every item is checked and you've confirmed it yourself.

## Phase 1 — Project Setup
**Goal:** Project foundation, zero-budget-safe from the start.

Tasks:
- Create Next.js 15 project (TypeScript, App Router)
- Configure Tailwind
- Install shadcn/ui
- Install Supabase SDK
- Install Gemini SDK
- Install Zod
- Install React Hook Form
- Create folder structure (`/app`, `/lib`, `/components`)
- Create `.env.local` for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
- Add `.env.local` to `.gitignore` **before** the first commit
- Create `.env.example` with empty placeholder values (safe to commit)
- Create homepage
- Add dark mode
- Push to GitHub — verify on GitHub.com that `.env.local` is NOT in the repo

**Definition of Done:**
- [ ] Repo is on GitHub
- [ ] `.env.local` confirmed absent from the GitHub repo (checked on GitHub, not just locally)
- [ ] Homepage loads locally and dark mode toggles

STOP. Wait for approval.

---

## Phase 2 — Routing
**Goal:** Support dynamic businesses via slug, with reserved slugs excluded.

Tasks:
- Create `/app/[slug]`
- Extract slug, display it on screen (e.g. `/smile-dental` shows "Smile Dental")
- Implement the reserved-slug list; reserved slugs must not be treated as a business (redirect to 404/home instead)
- No database yet

**Definition of Done:**
- [ ] `/smile-dental` (or similar test slug) displays correctly
- [ ] `/admin`, `/api`, `/dashboard` do NOT attempt to render as a business

STOP. Wait for approval.

---

## Phase 3 — Supabase
**Goal:** Load a real business dynamically, with RLS on from day one.

Tasks:
- Connect Supabase (free tier project)
- Create `businesses` table with unique `slug` constraint
- Enable RLS immediately, add the public-read policy described above
- Fetch business by slug
- Display Business Name, Phone, Email, Hours, Primary Color
- Custom 404 if slug doesn't exist

**Definition of Done:**
- [ ] Two test businesses exist in the table
- [ ] Each slug shows only its own business's data
- [ ] RLS confirmed ON in the Supabase dashboard (not just assumed)

STOP. Wait for approval.

---

## Phase 4 — Business Context
**Goal:** Load full business context (still no AI).

Tasks:
- Create `faqs` and `services` tables (RLS enabled, public read)
- Load FAQs, services, branding for the current business
- Display all of it on the business page

**Definition of Done:**
- [ ] Tested with at least 2 different businesses side by side — each shows only its own FAQs/services (this is the real test of the "no hardcoding" rule)

STOP. Wait for approval.

---

## Phase 5 — Chat Widget (UI only)
**Goal:** Build the widget interface, no AI wired up yet.

Tasks:
- Floating button
- Open / close behavior
- Responsive (test on mobile width)
- Chat history (local state only for now)
- Typing indicator
- Read `widget_settings` (position, greeting, color) from the business record so appearance is config-driven, not hardcoded

**Definition of Done:**
- [ ] Widget opens/closes correctly on desktop and mobile widths
- [ ] Two businesses with different `widget_settings` show visibly different widget appearance without any code change

STOP. Wait for approval.

---

## Phase 6 — Gemini Integration
**Goal:** Connect AI, scoped strictly to business context, protected from abuse.

Tasks:
- Create a secure API route (`/api/chat/[businessId]`) — never call Gemini directly from the client, key must stay server-side
- Pass business context (name, FAQs, services, hours, phone) into the system prompt
- System prompt must restrict answers to only that context — no general knowledge
- If the answer isn't in the business context, respond: "I'll ask our team to contact you."
- Implement basic rate limiting using the `rate_limits` table (e.g., cap requests per business per minute) — this protects your free-tier Gemini quota, no paid rate-limiting service needed

**Definition of Done:**
- [ ] Ask the same off-topic question to two different businesses' widgets — each stays scoped to its own data, neither leaks the other's info
- [ ] Confirm the "I'll ask our team to contact you" fallback triggers for genuinely unknown questions
- [ ] Confirm rate limiting actually blocks excessive requests in a quick manual test

STOP. Wait for approval.

---

## Phase 7 — Lead Capture
**Goal:** Capture and store leads safely.

Tasks:
- Form: Name, Email, Phone, Message (React Hook Form)
- Zod validation on the client AND re-validated server-side in the API route (never trust client-side validation alone)
- Store lead with `business_id`, timestamp
- RLS: public `INSERT` allowed, no public `SELECT`
- Show success message

**Definition of Done:**
- [ ] Submitting a lead with invalid data (e.g. malformed email) is rejected server-side even if the client check is bypassed
- [ ] Lead appears in the database correctly tied to the right `business_id`

STOP. Wait for approval.

---

## Phase 8 — Dashboard (Authenticated)
**Goal:** Business owners view only their own leads. This phase is where auth is mandatory.

Tasks:
- Supabase Auth login (email/password is enough for MVP — free, no extra service)
- `dashboard_users` table linking each auth user to exactly one `business_id`
- List leads — query filtered server-side by the logged-in user's `business_id`, resolved from `dashboard_users`, never from a client-supplied value
- Filter by search / status
- Mark leads as contacted

**Definition of Done:**
- [ ] Log in as Business A's user — confirm you can only ever see Business A's leads, including if you manually edit the URL or request parameters
- [ ] Confirm an unauthenticated visit to `/dashboard` redirects to login and shows no data

STOP. Wait for approval.

---

## Phase 9 — Widget Embed Script
**Goal:** Make the product deliverable to real businesses with a single script tag — this is the actual product delivery mechanism.

Tasks:
- Build `/public/widget.js` (or a route serving it) that businesses can paste into their site: `<script src=".../widget.js" data-business-id="xxx"></script>`
- Widget renders in an isolated container (iframe recommended for style isolation) and calls your existing APIs with the given `business-id`
- Confirm it works when pasted into a completely different, unrelated test HTML page (not just your own app)

**Definition of Done:**
- [ ] Widget successfully loads and functions when embedded in an external test site
- [ ] Two different `business-id` values on two different test pages show correctly separated branding/content

STOP. Wait for approval.

---

## Phase 10 — Deployment
**Goal:** Ship it, on free tiers only.

Tasks:
- Deploy to Vercel (Hobby plan)
- Configure environment variables in Vercel (not just locally)
- Confirm RLS is active in the production Supabase project
- Test the full flow end-to-end in production: visit slug → chat → submit lead → log into dashboard → see the lead

**Definition of Done:**
- [ ] Production environment variables set in Vercel
- [ ] End-to-end test passes in production with a real (test) business
- [ ] Confirmed RLS is on in production, not just in local/dev

STOP.

---

# Instructions For Antigravity

Before implementing any phase:
- Read this entire document.
- Implement ONLY the requested phase.
- Do NOT implement future phases.
- Do NOT invent features beyond what's specified.
- Do NOT introduce any paid service, package, or API tier — everything must run on a free tier as described in the Budget Constraint section.
- Keep the code clean and modular.

After finishing each phase, explain:
- Files created
- Packages installed
- Decisions made
- How to test it
- Confirm each Definition of Done item for that phase, explicitly, one by one

Then stop and wait for approval before continuing.
