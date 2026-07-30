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
