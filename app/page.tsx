"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bot,
  Menu,
  X,
  Zap,
  Target,
  Globe,
  PhoneCall,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

// Single edit point for the brand name shown in the navbar and footer.
const BRAND = "Systemic AI";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const PROJECTS = [
  {
    slug: "/smile-dental",
    name: "Smile Dental",
    industry: "Dental Clinic",
    description:
      "Handles appointment booking, insurance questions, and after-hours patient inquiries so the front desk never misses a call.",
    tags: ["AI Receptionist", "Booking", "Lead Capture"],
    latency: "142ms",
  },
  {
    slug: "/apex-law",
    name: "Apex Law",
    industry: "Law Firm",
    description:
      "Qualifies new case inquiries, schedules consultations, and routes urgent matters straight to the right attorney.",
    tags: ["AI Receptionist", "Intake", "Lead Capture"],
    latency: "98ms",
  },
];

const SERVICES = [
  {
    icon: Zap,
    title: "AI Automation",
    description:
      "We map your repetitive front-office and back-office work and replace it with AI workflows that run on their own, day and night.",
  },
  {
    icon: PhoneCall,
    title: "AI Receptionist",
    description:
      "A always-on AI receptionist that answers calls and chats, books appointments, and sounds like a trained member of your team.",
  },
  {
    icon: Target,
    title: "Leads Tracking",
    description:
      "Every inquiry is captured, qualified, and logged in a live dashboard, so no lead sits in an inbox unanswered.",
  },
  {
    icon: Globe,
    title: "AI-Integrated Website",
    description:
      "A complete website with the AI receptionist and leads tracking built in from day one, not bolted on after launch.",
  },
];

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email",
    value: "hamzaa0721@gmail.com",
    href: "mailto:hamzaa0721@gmail.com",
  },
  {
    icon: Phone,
    label: "Call",
    value: "+92 342 8256742",
    href: "tel:+923428256742",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message us directly",
    href: "https://wa.me/923428256742",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#F6F7F9] dark:bg-[#0A0D14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[28rem] bg-[#3D6BFF]/10 dark:bg-[#3D6BFF]/[0.08] blur-[110px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-72 h-72 bg-[#FFB020]/10 dark:bg-[#FFB020]/[0.06] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0A0D14]/80 border-b border-slate-200/70 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-lg bg-[#3D6BFF] text-white">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFB020] border-2 border-white dark:border-[#0A0D14] animate-pulse" />
            </div>
            <span className="font-bold text-base tracking-tight">{BRAND}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3D6BFF] hover:bg-[#3358d9] text-white transition-colors"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200/70 dark:border-white/10 bg-white/95 dark:bg-[#0A0D14]/95 px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#3D6BFF] text-white"
            >
              Book a Call
            </a>
          </div>
        )}
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020] animate-pulse" />
              Now building for new clients
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.12]">
              We build AI systems for businesses that never stop working.
            </h1>

            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              From the first missed call to the last unqualified lead, we replace the gaps in your
              front office with AI that answers, books, and follows up automatically, so your team
              can focus on the customers already through the door.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-[#3D6BFF] hover:bg-[#3358d9] text-white shadow-lg shadow-[#3D6BFF]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Live Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200"
              >
                <span>Talk to Us</span>
              </a>
            </div>
          </div>

          {/* Signature element: live "console" of deployed tenant systems */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                systems.live
              </span>
            </div>
            <div className="p-5 font-mono text-[12.5px] leading-7 text-slate-600 dark:text-slate-400">
              <p>
                <span className="text-[#3D6BFF]">GET</span> /smile-dental{" "}
                <span className="text-emerald-500">200 OK</span>{" "}
                <span className="text-slate-400 dark:text-slate-600">142ms</span>
              </p>
              <p>
                <span className="text-[#3D6BFF]">GET</span> /apex-law{" "}
                <span className="text-emerald-500">200 OK</span>{" "}
                <span className="text-slate-400 dark:text-slate-600">98ms</span>
              </p>
              <p>
                <span className="text-[#FFB020]">POST</span> /api/leads{" "}
                <span className="text-emerald-500">201 Created</span>
              </p>
              <p>
                <span className="text-[#3D6BFF]">GET</span> /api/receptionist/status{" "}
                <span className="text-emerald-500">online</span>
              </p>
              <p className="text-slate-400 dark:text-slate-600">
                <span className="animate-pulse">▌</span> listening for new requests…
              </p>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200/70 dark:border-white/10">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#3D6BFF]">
              Deployed Systems
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              See it running
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Two live client deployments, each running its own AI receptionist and lead pipeline
              on isolated, secured data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project) => (
              <Link
                key={project.slug}
                href={project.slug}
                className="group relative p-7 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-[#3D6BFF]/40 dark:hover:border-[#3D6BFF]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    {project.slug}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    LIVE
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{project.industry}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3D6BFF]">
                  Visit project
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200/70 dark:border-white/10">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#3D6BFF]">
              What We Build
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Services
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Every engagement starts with your front office and ends with a system that runs
              itself.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:shadow-md transition-shadow"
              >
                <div className="p-3 w-fit rounded-xl bg-[#3D6BFF]/10 text-[#3D6BFF] mb-4">
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Every build is multi-tenant ready and data-isolated by default, so your business's
              data stays fully separate from every other client we serve.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200/70 dark:border-white/10">
          <div className="max-w-xl mb-12">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#3D6BFF]">
              Get In Touch
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Let's build your AI system
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Tell us about your business and we'll show you exactly what an AI receptionist could
              handle for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {CONTACT_METHODS.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-[#3D6BFF]/40 dark:hover:border-[#3D6BFF]/40 transition-colors"
              >
                <div className="p-3 w-fit rounded-xl bg-[#3D6BFF]/10 text-[#3D6BFF] mb-4">
                  <method.icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                  {method.label}
                </p>
                <p className="text-sm font-semibold break-words">{method.value}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/70 dark:border-white/10 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto  px-6 flex flex-col sm:flex-row items-center justify-between gap-4w">
          <p>© 2026 {BRAND}. Intelligent AI solutions for modern businesses.</p>

        </div>
      </footer>
    </div>
  );
}
