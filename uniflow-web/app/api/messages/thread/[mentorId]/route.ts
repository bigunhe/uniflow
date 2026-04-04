import { NextResponse } from "next/server";
import { getSupabaseIfConfigured } from "@/lib/supabase";

type DbMessage = {
  id: string;
  sender: "mentor" | "user";
  text: string;
  created_at: string | null;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const { mentorId } = await params;
  const supabase = getSupabaseIfConfigured();
  if (!supabase) {
    return NextResponse.json({ messages: [] as DbMessage[] });
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id,sender,text,created_at")
      .eq("mentor_slug", mentorId)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ messages: [] as DbMessage[] });
    return NextResponse.json({ messages: (data ?? []) as DbMessage[] });
  } catch {
    return NextResponse.json({ messages: [] as DbMessage[] });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  const { mentorId } = await params;
  const supabase = getSupabaseIfConfigured();
  if (!supabase) {
    return NextResponse.json({ message: null }, { status: 503 });
  }

  try {
    const body = (await req.json()) as { text?: string };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ message: null }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        mentor_slug: mentorId,
        sender: "user",
        text,
      })
      .select("id,sender,text,created_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ message: null }, { status: 400 });
    }

    return NextResponse.json({ message: data as DbMessage });
  } catch {
    return NextResponse.json({ message: null }, { status: 500 });
  }
}

