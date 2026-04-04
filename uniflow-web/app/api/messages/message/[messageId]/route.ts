import { NextResponse } from "next/server";
import { getSupabaseIfConfigured } from "@/lib/supabase";

type DbMessage = {
  id: string;
  sender: "mentor" | "user";
  text: string;
  created_at: string | null;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return NextResponse.json({ message: null }, { status: 503 });

  try {
    const body = (await req.json()) as { text?: string };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return NextResponse.json({ message: null }, { status: 400 });

    const { data, error } = await supabase
      .from("messages")
      .update({ text })
      .eq("id", messageId)
      .select("id,sender,text,created_at")
      .single();

    if (error || !data) return NextResponse.json({ message: null }, { status: 400 });
    return NextResponse.json({ message: data as DbMessage });
  } catch {
    return NextResponse.json({ message: null }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return NextResponse.json({ success: false }, { status: 503 });

  try {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) return NextResponse.json({ success: false }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

