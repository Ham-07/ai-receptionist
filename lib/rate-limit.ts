import { createServiceClient } from "@/lib/supabase/service";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

interface RateLimitRow {
  id: string;
  business_id: string;
  window_start: string;
  request_count: number;
}

/**
 * Sliding-window rate limit per business, backed by the `rate_limits` table.
 * Service-role only (RLS denies everything else), so it can never be tampered
 * with from the client. Keeps the free-tier Gemini quota safe without any
 * paid rate-limiting service.
 */
export async function checkBusinessRateLimit(
  businessId: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const supabase = createServiceClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1000);

  // Opportunistic cleanup of stale windows to prevent unbounded table growth.
  await supabase
    .from("rate_limits")
    .delete()
    .eq("business_id", businessId)
    .lt("window_start", windowStart);

  const { data, error } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("business_id", businessId)
    .gte("window_start", windowStart)
    .order("window_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Fail open on DB errors so a rate-limiter hiccup never breaks the widget.
    console.error("Rate limit query error:", error);
    return { allowed: true };
  }

  if (!data) {
    const { error: insertError } = await supabase.from("rate_limits").insert({
      business_id: businessId,
      window_start: now.toISOString(),
      request_count: 1,
    });
    if (insertError) {
      console.error("Rate limit insert error:", insertError);
    }
    return { allowed: true };
  }

  const row = data as RateLimitRow;

  if (row.request_count >= maxRequests) {
    const elapsed = now.getTime() - new Date(row.window_start).getTime();
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowSeconds * 1000 - elapsed) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  const { error: updateError } = await supabase
    .from("rate_limits")
    .update({ request_count: row.request_count + 1 })
    .eq("id", row.id);
  if (updateError) {
    console.error("Rate limit update error:", updateError);
  }
  return { allowed: true };
}


