import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSafeNextPath } from "@/lib/auth/safe-next-path";

function createUsernameSeed(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
  id: string;
}) {
  const fromMeta =
    typeof user.user_metadata?.username === "string"
      ? user.user_metadata.username
      : "";
  const fromEmail = (user.email || "").split("@")[0] || "";
  const raw = (fromMeta || fromEmail || `user_${user.id.slice(0, 8)}`).toLowerCase();
  const cleaned = raw
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return (cleaned || `user_${user.id.slice(0, 8)}`).slice(0, 20);
}

function withNext(path: string, origin: string, safeNext: string | null) {
  if (!safeNext) return `${origin}${path}`;
  const sep = path.includes("?") ? "&" : "?";
  return `${origin}${path}${sep}next=${encodeURIComponent(safeNext)}`;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextParam = requestUrl.searchParams.get("next");
  const safeNext = getSafeNextPath(nextParam);
  const origin = requestUrl.origin;

  if (!code && !(tokenHash && otpType)) {
    const loginQs = safeNext ? `?next=${encodeURIComponent(safeNext)}` : "";
    return NextResponse.redirect(`${origin}/login${loginQs}`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  if (code) {
    const exchange = await supabase.auth.exchangeCodeForSession(code);
    if (exchange.error) {
      const q = new URLSearchParams({ error: "auth_link_invalid" });
      if (safeNext) q.set("next", safeNext);
      return NextResponse.redirect(`${origin}/login?${q.toString()}`);
    }
  } else if (tokenHash && otpType) {
    const verification = await supabase.auth.verifyOtp({
      type: otpType,
      token_hash: tokenHash,
    });
    if (verification.error) {
      const q = new URLSearchParams({ error: "auth_link_expired" });
      if (safeNext) q.set("next", safeNext);
      return NextResponse.redirect(`${origin}/login?${q.toString()}`);
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginQs = safeNext ? `?next=${encodeURIComponent(safeNext)}` : "";
    return NextResponse.redirect(`${origin}/login${loginQs}`);
  }

  const { data: row } = await supabase
    .from("user_data")
    .select("id, onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (!row) {
    const baseUsername = createUsernameSeed(user);
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
      mentor_subjects: [] as string[],
      learning_subjects: [] as string[],
      pulse_score: 0,
      onboarding_complete: false,
    };

    let { error: insertErr } = await supabase.from("user_data").insert(payload);
    if (insertErr && /duplicate key value|unique constraint/i.test(insertErr.message || "")) {
      const retryPayload = { ...payload, username: fallbackUsername };
      const retry = await supabase.from("user_data").insert(retryPayload);
      insertErr = retry.error;
    }

    return NextResponse.redirect(withNext("/profile-setup", origin, safeNext));
  }

  if (!row.onboarding_complete) {
    return NextResponse.redirect(withNext("/profile-setup", origin, safeNext));
  }

  const dest = safeNext ?? "/dashboard";
  return NextResponse.redirect(`${origin}${dest}`);
}
