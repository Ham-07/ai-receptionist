import { notFound } from "next/navigation";
import Link from "next/link";
import { isReservedSlug } from "@/lib/constants";
import { getBusinessContextBySlug } from "@/lib/businesses";
import { ThemeToggle } from "@/components/theme-toggle";
import { BusinessFaqs } from "@/components/business-faqs";
import { BusinessServices } from "@/components/business-services";
import { LeadForm } from "@/components/lead-form";
import { ChatWidget } from "@/components/chat-widget";
import {
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  MapPin,
  Sparkles,
  Dumbbell,
  Stethoscope,
  Scale,
  Home,
  Briefcase,
  ShieldCheck,
  Calendar,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to determine business type and get themed default taglines/icons
function getBusinessTheme(name: string, slug: string, settings: any) {
  const category = (settings?.category || "").toLowerCase();
  const searchStr = `${name} ${slug} ${category}`.toLowerCase();

  if (searchStr.includes("dental") || searchStr.includes("dentist") || searchStr.includes("clinic")) {
    return {
      type: "Dental Clinic",
      icon: Stethoscope,
      tagline: settings?.tagline || "Advanced Dental Care for a Healthier, Brighter Smile",
      description: settings?.description || "Providing comprehensive, gentle family dentistry, professional cleanings, and advanced restorative treatments in a state-of-the-art facility.",
    };
  }
  if (searchStr.includes("gym") || searchStr.includes("fitness") || searchStr.includes("crossfit") || searchStr.includes("workout")) {
    return {
      type: "Fitness Center",
      icon: Dumbbell,
      tagline: settings?.tagline || "Transform Your Body, Mind, and Health",
      description: settings?.description || "Achieve your fitness goals with our state-of-the-art gym equipment, professional personal trainers, and high-energy group fitness classes tailored to all skill levels.",
    };
  }
  if (searchStr.includes("real") || searchStr.includes("realty") || searchStr.includes("estate") || searchStr.includes("property")) {
    return {
      type: "Real Estate Agency",
      icon: Home,
      tagline: settings?.tagline || "Find Your Dream Home & Smart Investments",
      description: settings?.description || "Helping you buy, sell, and lease premium residential and commercial properties with expert market insights and dedication.",
    };
  }
  if (searchStr.includes("law") || searchStr.includes("legal") || searchStr.includes("attorney") || searchStr.includes("court")) {
    return {
      type: "Legal Practice",
      icon: Scale,
      tagline: settings?.tagline || "Committed to Protecting Your Rights & Interests",
      description: settings?.description || "Providing trusted, expert legal representation and consultative advisory services for corporations, small businesses, and individuals.",
    };
  }

  return {
    type: "Professional Services",
    icon: Briefcase,
    tagline: settings?.tagline || "Premium Quality & Expert Service Solutions",
    description: settings?.description || "Dedicated to delivering exceptional quality, personalized attention, and reliable services to help you or your business thrive.",
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  // Reject reserved system slugs immediately (trigger 404)
  if (isReservedSlug(slug)) {
    notFound();
  }

  // Fetch full business context (branding, FAQs, services) from Supabase
  const context = await getBusinessContextBySlug(slug);

  // Custom 404 if slug doesn't exist in database
  if (!context) {
    notFound();
  }

  const { business, faqs, services } = context;
  const primaryColor = business.primary_color || "#6366f1";
  const hours = business.business_hours;
  
  const settings = business.widget_settings || {};
  const theme = getBusinessTheme(business.business_name, slug, settings);
  const IconComponent = theme.icon;

  const address = settings.address || "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 scroll-smooth">
      {/* Dynamic Background Glow based on Primary Color */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] opacity-[0.09] dark:opacity-[0.14] blur-3xl pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Professional Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand / Home Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Return to Platform Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl text-white shadow-md flex items-center justify-center shrink-0 font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight truncate max-w-[200px] sm:max-w-none">
                {business.business_name}
              </span>
            </div>
          </div>

          {/* Middle: Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Services
            </a>
            <a href="#faqs" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              FAQs
            </a>
            <a href="#hours" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Hours & Info
            </a>
            <a href="#booking" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          {/* Right: Theme Toggle & Booking CTA */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#booking"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95 shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full relative z-10 space-y-16">
        
        {/* Full-Width Professional Hero Banner */}
        <section className="p-8 sm:p-14 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden text-center sm:text-left">
          {/* Subtle Accent Glow inside Hero */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none rounded-full"
            style={{ backgroundColor: primaryColor }}
          />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
              <span>{theme.type}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">24/7 AI Concierge Ready</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              {theme.tagline}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-xl leading-relaxed">
              {theme.description}
            </p>

            {/* Action Buttons & Badges */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <a
                href="#booking"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Request Info & Booking</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-center"
              >
                Explore Services
              </a>
            </div>

            {/* Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Provider</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>24/7 AI Assistant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Offerings Section */}
        <section id="services" className="scroll-mt-24">
          <BusinessServices services={services} primaryColor={primaryColor} />
        </section>

        {/* Info Grid (FAQs & Business Hours) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQs */}
          <div id="faqs" className="lg:col-span-7 scroll-mt-24">
            <BusinessFaqs faqs={faqs} primaryColor={primaryColor} />
          </div>

          {/* Hours & Contact Quick Info Card */}
          <div id="hours" className="lg:col-span-5 p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Hours of Operation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Standard business availability</p>
              </div>
            </div>

            {hours ? (
              <div className="space-y-2 text-xs sm:text-sm">
                {Object.entries(hours).map(([day, val]) => (
                  <div key={day} className="flex justify-between p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30">
                    <span className="font-semibold capitalize">{day}</span>
                    <span className="text-slate-500 dark:text-slate-400">{val || "Closed"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Hours not configured yet.</p>
            )}
          </div>
        </section>

        {/* Dedicated Request & Booking Section at the End */}
        <section id="booking" className="scroll-mt-24 p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-80 h-80 opacity-10 blur-3xl pointer-events-none rounded-full"
            style={{ backgroundColor: primaryColor }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>Get In Touch</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Request Info & Schedule Booking
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Have questions or ready to schedule your appointment with <strong>{business.business_name}</strong>? Fill out the inquiry form and our team will get back to you promptly.
              </p>

              {/* Direct Contact Cards */}
              <div className="space-y-3 pt-2">
                {business.phone && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800">
                      <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Phone</span>
                      <a href={`tel:${business.phone}`} className="text-sm font-semibold hover:underline">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800">
                      <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Email</span>
                      <a href={`mailto:${business.email}`} className="text-sm font-semibold hover:underline break-all">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800">
                      <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Location</span>
                      <span className="text-sm font-semibold">{address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <LeadForm
                businessId={business.id}
                businessName={business.business_name}
                primaryColor={primaryColor}
              />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-8 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md mt-16 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {business.business_name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Powered by AI Receptionist Concierge</span>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget
        businessId={business.id}
        businessName={business.business_name}
        widgetSettings={business.widget_settings}
        primaryColor={business.primary_color}
      />
    </div>
  );
}
