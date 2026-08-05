import { NextRequest } from "next/server";
import { z } from "zod";
import { getBusinessContextById } from "@/lib/businesses";
import { generateReply } from "@/lib/gemini";
import { checkBusinessRateLimit } from "@/lib/rate-limit";

// Gemini key stays server-side; the client only ever talks to this route.
export const runtime = "nodejs";

// Free-tier-safe caps per business (10 requests / minute). Stays under
// Gemini's shared free-tier per-minute quota, even before other businesses
// add their own traffic.
const CHAT_REQUEST_LIMIT = 10;
const CHAT_WINDOW_SECONDS = 60;

import { UUID_FORMAT } from "@/lib/constants";

const ChatRequestBody = z.object({
  message: z.string().trim().min(1).max(2000),
});

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/chat/[businessId]">
) {
  const { businessId } = await ctx.params;

  if (!UUID_FORMAT.test(businessId)) {
    return Response.json({ error: "Invalid business id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ChatRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Load the business's full context server-side — scoped to this tenant only.
  const context = await getBusinessContextById(businessId);
  if (!context) {
    return Response.json({ error: "Business not found" }, { status: 404 });
  }

  // Protect the free-tier Gemini quota per business before calling the model.
  const rateLimit = await checkBusinessRateLimit(
    businessId,
    CHAT_REQUEST_LIMIT,
    CHAT_WINDOW_SECONDS
  );
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds ?? CHAT_WINDOW_SECONDS),
        },
      }
    );
  }

  try {
    const reply = await generateReply(context, parsed.data.message);
    return Response.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
