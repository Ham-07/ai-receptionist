import { createClient } from "@/lib/supabase/server";
import { Lead, LeadStatus } from "@/lib/supabase/types";

/**
 * Server-side dashboard helpers. Every business_id here is resolved from the
 * authenticated session (via the dashboard_users table) — never from any
 * client-supplied value. Combined with RLS, this guarantees a logged-in user
 * can only ever see or modify leads belonging to their own business.
 */

export interface DashboardSession {
  userId: string;
  businessId: string;
}

export interface DashboardAccount {
  businessId: string;
  businessName: string | null;
}

/**
 * Returns the logged-in user's session plus their linked business_id, or null
 * when the request is unauthenticated or the user isn't linked to a business.
 */
export async function getDashboardSession(): Promise<DashboardSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("dashboard_users")
    .select("business_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return { userId: user.id, businessId: data.business_id as string };
}

/** Looks up the business linked to a dashboard user (for display purposes). */
export async function getDashboardAccount(
  userId: string
): Promise<DashboardAccount | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dashboard_users")
    .select("business_id, businesses(business_name)")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  const business = data.businesses as { business_name?: string } | null;
  return {
    businessId: data.business_id as string,
    businessName: business?.business_name ?? null,
  };
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | "all";
}

/**
 * Lists leads for a business, ordered newest first, with optional search and
 * status filters. business_id is resolved server-side from the session.
 */
export async function getDashboardLeads(
  businessId: string,
  filters: LeadFilters = {}
): Promise<{ leads: Lead[]; error: string | null }> {
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  const status = filters.status;
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const search = filters.search?.trim();
  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `name.ilike.${term},email.ilike.${term},phone.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) return { leads: [], error: error.message };
  return { leads: (data as Lead[]) ?? [], error: null };
}

/**
 * Updates a lead's status, scoping the update to the owner's business_id so a
 * tampered leadId can never touch another business's leads.
 */
export async function updateDashboardLeadStatus(
  businessId: string,
  leadId: string,
  status: LeadStatus
): Promise<{ lead: Lead | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId)
    .eq("business_id", businessId)
    .select("*")
    .maybeSingle();

  if (error) return { lead: null, error: error.message };
  return { lead: (data as Lead) ?? null, error: null };
}
