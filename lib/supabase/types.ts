export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface WidgetSettings {
  position?: "bottom-right" | "bottom-left";
  greeting?: string;
  themeColor?: string;
}

export interface Business {
  id: string;
  slug: string;
  business_name: string;
  logo: string | null;
  primary_color: string | null;
  phone: string | null;
  email: string | null;
  business_hours: BusinessHours | null;
  widget_settings: WidgetSettings | null;
  created_at: string;
}

export interface FAQ {
  id: string;
  business_id: string;
  question: string;
  answer: string;
  created_at?: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface BusinessContext {
  business: Business;
  faqs: FAQ[];
  services: Service[];
}

export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface CreateLeadInput {
  business_id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface DashboardUser {
  id: string;
  auth_user_id: string;
  business_id: string;
  created_at?: string;
}
