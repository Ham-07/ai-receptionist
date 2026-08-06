import { NextRequest } from "next/server";
import { z } from "zod";
import { getDashboardSession, getDashboardLeads } from "@/lib/dashboard";

export const runtime = "nodejs";

const QuerySchema = z.object({
  search: z.string().max(100).optional().default(""),
  status: z.enum(["new", "contacted", "closed", "all"]).optional().default("all"),
});

export async function GET(request: NextRequest) {
  // business_id is resolved server-side from the session, never from the client.
  const session = await getDashboardSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = QuerySchema.safeParse({
    search: request.nextUrl.searchParams.get("search") ?? "",
    status: request.nextUrl.searchParams.get("status") ?? "all",
  });
  if (!parsed.success) {
    return Response.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const result = await getDashboardLeads(session.businessId, parsed.data);
  if (result.error) {
    console.error("Dashboard leads query error:", result.error);
    return Response.json({ error: "Failed to load leads" }, { status: 500 });
  }

  return Response.json({ leads: result.leads });
}
