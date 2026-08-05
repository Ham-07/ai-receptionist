import { NextRequest } from "next/server";
import { getBusinessContextById } from "@/lib/businesses";
import { LeadSchema } from "@/lib/validations/lead";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 1. Re-validate payload strictly server-side with Zod (Never trust client validation alone)
  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { business_id, name, email, phone, message } = parsed.data;

  const context = await getBusinessContextById(business_id);
  if (!context) {
    return Response.json({ error: "Business not found" }, { status: 404 });
  }

  try {
    const supabase = await createClient();

    // Store lead with business_id, timestamp, and default status 'new'.
    // No .select() — RLS allows public INSERT but not public SELECT.
    const { error } = await supabase.from("leads").insert({
      business_id,
      name,
      email,
      phone: phone || null,
      message: message || null,
      status: "new",
    });

    if (error) {
      console.error("Supabase lead insertion error:", error);
      return Response.json(
        { error: "Failed to submit lead to database" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Lead submitted successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Server error submitting lead:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
