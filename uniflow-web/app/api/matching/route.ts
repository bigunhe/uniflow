import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { rankMentors } from "@/services/matching";
import { UserProfile } from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tags = ((body.tags as string[]) || []).map((item) => item.trim()).filter(Boolean);
    const urgency = (body.urgency as string) || "medium";

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("role", "mentor");

    if (error) throw error;

    const urgencyWeight = urgency === "urgent" ? 1.8 : urgency === "high" ? 1.3 : 1;
    const ranked = rankMentors((data || []) as UserProfile[], tags, urgencyWeight);

    return NextResponse.json({ mentors: ranked });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
