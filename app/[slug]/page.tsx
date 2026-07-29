import { notFound } from "next/navigation";
import Link from "next/link";
import { isReservedSlug, formatSlugToTitle } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Building2,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Briefcase,
  Bot,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  // Reject reserved system slugs immediately (redirect to 404)
  if (isReservedSlug(slug)) {
    notFound();
  }

  const businessName = formatSlugToTitle(slug);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Return to Platform Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                {businessName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              slug: /{slug}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-12 pb-20 w-full relative z-10">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-500 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-indigo-900 dark:text-indigo-200">
                Phase 2 — Dynamic Route Verified
              </h2>
              <p className="text-xs sm:text-sm text-indigo-700/80 dark:text-indigo-300/80">
                URL slug <code className="font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded">/{slug}</code> parsed successfully. Reserved slugs are guarded.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Dynamic Tenant Page
          </span>
        </div>

        {/* Tenant Hero Header */}
        <div className="text-center sm:text-left mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to {businessName}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Providing tailored professional concierge services powered by AI Receptionist Platform.
          </p>
        </div>

        {/* Placeholder Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Contact Details */}
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-3">Contact Details</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>info@{slug}.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Mon – Fri: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* FAQs Placeholder */}
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-200">How do I book an appointment?</p>
                <p className="text-xs text-slate-500">Ask our AI Receptionist widget in the bottom right corner.</p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-200">Do you offer emergency services?</p>
                <p className="text-xs text-slate-500">Yes, same-day scheduling is supported.</p>
              </div>
            </div>
          </div>

          {/* Services Placeholder */}
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-3">Featured Services</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Comprehensive Consultation</li>
              <li>Customized Care Plans</li>
              <li>24/7 Digital Concierge Support</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Floating Chat Widget Placeholder */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 cursor-pointer hover:scale-105 transition-transform">
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="font-semibold text-sm hidden sm:inline">
            Chat with {businessName}
          </span>
        </div>
      </div>
    </div>
  );
}
