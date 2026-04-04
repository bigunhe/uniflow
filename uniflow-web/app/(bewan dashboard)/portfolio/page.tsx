"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UniFlowBrandLink } from "@/components/shared/UniFlowBrandLink";
import { mockProjectsById } from "@/lib/mockData";

type SubmissionRow = {
  id: string;
  module_id: string;
  github_url: string | null;
  live_url: string | null;
  screenshot_url: string | null;
  reflection: string | null;
};

export default function MyPortfolioPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile, error: pErr } = await supabase
      .from("user_data")
      .select("username, onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    if (pErr || !profile?.onboarding_complete) {
      router.replace("/profile-setup");
      return;
    }

    setUsername(profile.username ?? null);

    const { data: rows } = await supabase
      .from("user_project_submission")
      .select("id, module_id, github_url, live_url, screenshot_url, reflection")
      .eq("user_id", user.id);

    setSubmissions(Array.isArray(rows) ? (rows as SubmissionRow[]) : []);
    setLoading(false);
  }, [router, supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans',sans-serif",
          color: "rgba(168,184,208,0.85)",
        }}
      >
        Loading portfolio…
      </div>
    );
  }

  const hubUrl =
    username && origin ? `${origin}/p/${username}/portfolio` : "";

  return (
    <div className="brand-dark-shell" style={{ minHeight: "100vh", background: "#080c14", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
          <UniFlowBrandLink variant="dark" size="md" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.12)",
                background: "rgba(255,255,255,.05)",
                color: "rgba(255,255,255,.75)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => router.push("/projects/completed")}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(0,210,180,.3)",
                background: "rgba(0,210,180,.1)",
                color: "#7ae9d8",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Add verification
            </button>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>
          My project portfolio
        </h1>
        <p style={{ fontSize: 14, color: "rgba(168,184,208,.88)", maxWidth: 640, lineHeight: 1.6, marginBottom: 24 }}>
          Verified studio projects and public showcase links. Share individual project pages or your full portfolio index.
        </p>

        {hubUrl ? (
          <div
            style={{
              marginBottom: 28,
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(0,210,180,.22)",
              background: "rgba(0,210,180,.08)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,210,180,.85)", marginBottom: 8 }}>
              Public portfolio (all projects)
            </div>
            <div style={{ fontSize: 13, color: "#7ae9d8", wordBreak: "break-all", marginBottom: 10 }}>{hubUrl}</div>
            <button
              type="button"
              onClick={() => void copyText("hub", hubUrl)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#00d2b4,#6366f1)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {copied === "hub" ? "Copied" : "Copy link"}
            </button>
            <p style={{ marginTop: 10, fontSize: 12, color: "rgba(168,184,208,.75)" }}>
              On localhost, paste this URL in the browser to preview what others see.
            </p>
          </div>
        ) : null}

        {submissions.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              borderRadius: 16,
              border: "1px dashed rgba(255,255,255,.12)",
              color: "rgba(168,184,208,.65)",
              fontSize: 14,
            }}
          >
            No submissions yet. Complete a project and submit verification from{" "}
            <strong style={{ color: "rgba(255,255,255,.85)" }}>Projects → Completed Projects</strong>.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {submissions.map((row) => {
              const project = mockProjectsById[row.module_id];
              const title = project?.title ?? row.module_id;
              const brief = project?.brief ?? "";
              const showcase =
                username && origin
                  ? `${origin}/p/${username}/projects/${row.module_id}`
                  : "";
              return (
                <div
                  key={row.id}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,.1)",
                    background: "rgba(255,255,255,.03)",
                  }}
                >
                  <div style={{ fontSize: 12, color: "rgba(0,210,180,.85)", marginBottom: 6 }}>{project?.year ?? "Project"}</div>
                  <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
                  {brief ? (
                    <p style={{ fontSize: 13, color: "rgba(168,184,208,.9)", lineHeight: 1.55, marginBottom: 12 }}>{brief}</p>
                  ) : null}
                  {showcase ? (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.4)", marginBottom: 6 }}>
                        Public showcase URL
                      </div>
                      <div style={{ fontSize: 12, color: "#7ae9d8", wordBreak: "break-all", marginBottom: 10 }}>{showcase}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => void copyText(row.id, showcase)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(0,210,180,.35)",
                            background: "rgba(0,210,180,.1)",
                            color: "#7ae9d8",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          {copied === row.id ? "Copied" : "Copy"}
                        </button>
                        <a
                          href={showcase}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,.15)",
                            color: "rgba(255,255,255,.75)",
                            fontSize: 12,
                            textDecoration: "none",
                          }}
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
