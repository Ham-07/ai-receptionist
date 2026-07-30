import { createClient } from "@/lib/supabase/server";
import { Business } from "@/lib/supabase/types";

// Seed fallback data for local testing before Supabase project credentials are set up
const MOCK_BUSINESSES: Record<string, Business> = {
  "smile-dental": {
    id: "b1000000-0000-0000-0000-000000000001",
    slug: "smile-dental",
    business_name: "Smile Dental Clinic",
    logo: null,
    primary_color: "#0ea5e9",
    phone: "+1 (555) 234-5678",
    email: "contact@smiledental.com",
    business_hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed",
    },
    widget_settings: {
      position: "bottom-right",
      greeting: "Hello! Welcome to Smile Dental Clinic. How can we help your smile today?",
      themeColor: "#0ea5e9",
    },
    created_at: new Date().toISOString(),
  },
  "apex-law": {
    id: "b2000000-0000-0000-0000-000000000002",
    slug: "apex-law",
    business_name: "Apex Law Group",
    logo: null,
    primary_color: "#6366f1",
    phone: "+1 (555) 987-6543",
    email: "info@apexlaw.com",
    business_hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    widget_settings: {
      position: "bottom-right",
      greeting: "Welcome to Apex Law Group. Connect with our legal concierge assistant.",
      themeColor: "#6366f1",
    },
    created_at: new Date().toISOString(),
  },
};

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Check if real Supabase URL is configured (not default placeholder)
  const isRealSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes("your-project.supabase.co") &&
    supabaseUrl.startsWith("https://");

  if (isRealSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error("Supabase query error:", error);
      }

      if (data) {
        return data as Business;
      }
    } catch (err) {
      console.error("Failed to connect to Supabase:", err);
    }
  }

  // Fallback to local test data for seamless local development
  const mock = MOCK_BUSINESSES[slug.toLowerCase()];
  return mock || null;
}
