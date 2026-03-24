import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function createUsernameSeed(user: { email?: string | null; user_metadata?: Record<string, unknown>; id: string }) {
  const fromMeta = typeof user.user_metadata?.username === "string" ? user.user_metadata.username : "";
  const fromEmail = (user.email || "").split("@")[0] || "";
  const raw = (fromMeta || fromEmail || `user_${user.id.slice(0, 8)}`).toLowerCase();
  const cleaned = raw.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return (cleaned || `user_${user.id.slice(0, 8)}`).slice(0, 20);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("user_data")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!profile) {
        const baseUsername = createUsernameSeed(user as unknown as { email?: string | null; user_metadata?: Record<string, unknown>; id: string });
        const fallbackUsername = `${baseUsername.slice(0, 12)}_${user.id.slice(0, 6)}`;

        const payload = {
          id: user.id,
          email: user.email,
          display_name:
            (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
            (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
            user.email?.split("@")[0] ||
            "Member",
          username: baseUsername,
          avatar_url:
            (typeof user.user_metadata?.avatar_url === "string" && user.user_metadata.avatar_url) ||
            "",
          is_mentor: false,
          mentor_subjects: [],
          pulse_score: 0,
        };

        let { error: insertErr } = await supabase.from("user_data").insert(payload);
        if (insertErr && /duplicate key value|unique constraint/i.test(insertErr.message || "")) {
          const retryPayload = { ...payload, username: fallbackUsername };
          const retry = await supabase.from("user_data").insert(retryPayload);
          insertErr = retry.error;
        }

        if (insertErr) {
          return NextResponse.redirect(`${requestUrl.origin}/profile-setup`);
        }

        return NextResponse.redirect(`${requestUrl.origin}/profile-setup`);
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/`);
}