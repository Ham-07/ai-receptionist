import { createClient } from "@/lib/supabase/server";
import { Business, FAQ, Service, BusinessContext } from "@/lib/supabase/types";

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

const MOCK_FAQS: Record<string, FAQ[]> = {
  "b1000000-0000-0000-0000-000000000001": [
    {
      id: "f1",
      business_id: "b1000000-0000-0000-0000-000000000001",
      question: "Do you accept new dental patients?",
      answer: "Yes! We welcome new patients of all ages. You can schedule your initial appointment through our concierge.",
    },
    {
      id: "f2",
      business_id: "b1000000-0000-0000-0000-000000000001",
      question: "What insurance plans do you accept?",
      answer: "We accept most major PPO dental insurance providers including Delta Dental, Cigna, MetLife, and Aetna.",
    },
    {
      id: "f3",
      business_id: "b1000000-0000-0000-0000-000000000001",
      question: "How long does a routine cleaning take?",
      answer: "A standard preventive cleaning and oral examination takes approximately 45 to 60 minutes.",
    },
  ],
  "b2000000-0000-0000-0000-000000000002": [
    {
      id: "f4",
      business_id: "b2000000-0000-0000-0000-000000000002",
      question: "What legal areas do you specialize in?",
      answer: "We specialize in corporate governance, intellectual property defense, commercial litigation, and contract advisory.",
    },
    {
      id: "f5",
      business_id: "b2000000-0000-0000-0000-000000000002",
      question: "How much is the initial consultation fee?",
      answer: "We offer a complimentary 15-minute preliminary case evaluation for prospective commercial clients.",
    },
  ],
};

const MOCK_SERVICES: Record<string, Service[]> = {
  "b1000000-0000-0000-0000-000000000001": [
    {
      id: "s1",
      business_id: "b1000000-0000-0000-0000-000000000001",
      name: "Preventive Teeth Cleaning",
      description: "Comprehensive oral examination, ultrasonic plaque removal, polishing, and oral cancer screening.",
    },
    {
      id: "s2",
      business_id: "b1000000-0000-0000-0000-000000000001",
      name: "Professional Laser Whitening",
      description: "In-office teeth whitening delivering up to 8 shades brighter teeth in a single 60-minute session.",
    },
    {
      id: "s3",
      business_id: "b1000000-0000-0000-0000-000000000001",
      name: "Porcelain Crowns & Veneers",
      description: "Custom-crafted ceramic crowns and aesthetic veneers designed for natural strength and beauty.",
    },
  ],
  "b2000000-0000-0000-0000-000000000002": [
    {
      id: "s4",
      business_id: "b2000000-0000-0000-0000-000000000002",
      name: "Corporate Governance & Advisory",
      description: "Strategic counsel on entity structuring, shareholder agreements, compliance, and venture financing.",
    },
    {
      id: "s5",
      business_id: "b2000000-0000-0000-0000-000000000002",
      name: "Commercial Contract Drafting",
      description: "Custom drafting and rigorous risk-mitigation review of enterprise software and vendor agreements.",
    },
    {
      id: "s6",
      business_id: "b2000000-0000-0000-0000-000000000002",
      name: "Intellectual Property Defense",
      description: "Trademark registration, patent portfolio management, and copyright infringement protection.",
    },
  ],
};

function getMockBusinessById(businessId: string): Business | null {
  for (const business of Object.values(MOCK_BUSINESSES)) {
    if (business.id === businessId) return business;
  }
  return null;
}

const isRealSupabaseConfigured = (): boolean => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(
    supabaseUrl &&
      !supabaseUrl.includes("your-project.supabase.co") &&
      supabaseUrl.startsWith("https://")
  );
};

export async function getBusinessContextById(
  businessId: string
): Promise<BusinessContext | null> {
  if (isRealSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      const [businessRes, faqsRes, servicesRes] = await Promise.all([
        supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .maybeSingle(),
        supabase
          .from("faqs")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: true }),
        supabase
          .from("services")
          .select("*")
          .eq("business_id", businessId)
          .order("created_at", { ascending: true }),
      ]);

      const business = businessRes.data as Business | null;
      if (business) {
        const faqs = (faqsRes.data as FAQ[]) || [];
        const services = (servicesRes.data as Service[]) || [];
        return {
          business,
          faqs: faqs.length > 0 ? faqs : MOCK_FAQS[businessId] || [],
          services: services.length > 0 ? services : MOCK_SERVICES[businessId] || [],
        };
      }
    } catch (err) {
      console.error("Failed to fetch business context by id:", err);
    }
  }

  const mockBusiness = getMockBusinessById(businessId);
  if (!mockBusiness) return null;

  return {
    business: mockBusiness,
    faqs: MOCK_FAQS[businessId] || [],
    services: MOCK_SERVICES[businessId] || [],
  };
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (isRealSupabaseConfigured()) {
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

  const mock = MOCK_BUSINESSES[slug.toLowerCase()];
  return mock || null;
}

export async function getBusinessContextBySlug(
  slug: string
): Promise<BusinessContext | null> {
  const business = await getBusinessBySlug(slug);
  if (!business) return null;

  if (isRealSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      const [faqsRes, servicesRes] = await Promise.all([
        supabase
          .from("faqs")
          .select("*")
          .eq("business_id", business.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("services")
          .select("*")
          .eq("business_id", business.id)
          .order("created_at", { ascending: true }),
      ]);

      const faqs = (faqsRes.data as FAQ[]) || [];
      const services = (servicesRes.data as Service[]) || [];

      // If live Supabase tables return rows, use them; otherwise fallback to mock for that business
      return {
        business,
        faqs: faqs.length > 0 ? faqs : MOCK_FAQS[business.id] || [],
        services: services.length > 0 ? services : MOCK_SERVICES[business.id] || [],
      };
    } catch (err) {
      console.error("Failed to fetch relational context from Supabase:", err);
    }
  }

  return {
    business,
    faqs: MOCK_FAQS[business.id] || [],
    services: MOCK_SERVICES[business.id] || [],
  };
}
