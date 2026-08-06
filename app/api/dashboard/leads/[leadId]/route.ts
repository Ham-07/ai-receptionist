import { NextRequest } from "next/server";
import { z } from "zod";
import { UUID_FORMAT } from "@/lib/constants";
import { getDashboardSession, updateDashboardLeadStatus } from "@/lib/dashboard";

export const runtime = "nodejs";

const StatusUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/leads/[leadId]">
) {
  const { leadId } = await ctx.params;

  // business_id is resolved server-side from the session, never from the client.
  const session = await getDashboardSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!UUID_FORMAT.test(leadId)) {
    return Response.json({ error: "Invalid lead id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = StatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const { lead, error } = await updateDashboardLeadStatus(
    session.businessId,
    leadId,
    parsed.data.status
  );

  if (error) {
    console.error("Dashboard lead update error:", error);
    return Response.json({ error: "Failed to update lead" }, { status: 500 });
  }

  return Response.json({ lead });
}
