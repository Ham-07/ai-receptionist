import { notFound } from "next/navigation";
import Link from "next/link";
import { isReservedSlug } from "@/lib/constants";
import { getBusinessBySlug } from "@/lib/businesses";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Building2,
  Phone,
  Mail,
  Clock,
  Bot,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  // Reject reserved system slugs immediately (trigger 404)
  if (isReservedSlug(slug)) {
    notFound();
  }

  // Fetch real business context dynamically from Supabase
  const business = await getBusinessBySlug(slug);

  // Custom 404 if slug doesn't exist in database
  if (!business) {
    notFound();
  }

  const primaryColor = business.primary_color || "#6366f1";
  const hours = business.business_hours;
  const widgetGreeting =
    business.widget_settings?.greeting || `Hello! Welcome to ${business.business_name}. How can we assist you today?`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Background Glow based on Primary Color */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

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
              <div
                className="p-2 rounded-xl text-white shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                {business.business_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> RLS Verified
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-12 pb-24 w-full relative z-10">
        {/* Business Hero Banner */}
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span>Tenant ID:</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                {business.id.slice(0, 8)}...
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {business.business_name}
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl">
              Official corporate profile dynamically loaded from Supabase database. Serving custom branding, schedule availability, and automated AI receptionist support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 min-w-[240px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Primary Brand Accent
            </span>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl shadow-inner border border-white/20"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="font-mono text-sm font-semibold">{primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Details */}
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2.5 rounded-xl text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Contact Information</h3>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs text-slate-500 block">Phone Number</span>
                  <span className="font-semibold">{business.phone || "Not provided"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs text-slate-500 block">Email Address</span>
                  <span className="font-semibold">{business.email || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2.5 rounded-xl text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Business Hours</h3>
            </div>

            {hours ? (
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium">Monday</span>
                  <span className="text-slate-500">{hours.monday || "Closed"}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium">Tuesday</span>
                  <span className="text-slate-500">{hours.tuesday || "Closed"}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium">Wednesday</span>
                  <span className="text-slate-500">{hours.wednesday || "Closed"}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium">Thursday</span>
                  <span className="text-slate-500">{hours.thursday || "Closed"}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium">Friday</span>
                  <span className="text-slate-500">{hours.friday || "Closed"}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium">Saturday</span>
                  <span className="text-slate-500">{hours.saturday || "Closed"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Hours not configured yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Dynamic Chat Widget Greeting Banner */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className="flex items-center gap-3 p-4 rounded-2xl text-white shadow-xl hover:scale-105 transition-transform cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <div className="hidden sm:block text-left max-w-xs">
            <span className="text-xs opacity-90 block font-semibold">AI Receptionist</span>
            <span className="text-xs truncate block">{widgetGreeting}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
