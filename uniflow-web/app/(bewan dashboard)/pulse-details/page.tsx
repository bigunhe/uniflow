"use client";

import { createClient } from "@/lib/supabase/client";
import { UniFlowBrandLink } from "@/components/shared/UniFlowBrandLink";
import { listLearningModules } from "@/lib/learning/sync";
import {
  readProjectStateMap,
  PROJECT_STATE_STORAGE_KEY,
} from "@/lib/projects/localState";
import { projectsPulsePillarPercent } from "@/lib/projects/pulseContribution";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function learningProgressFromModuleCount(count: number): number {
  if (count <= 0) return 0;
  const target = 7;
  return Math.min(100, Math.round((count / target) * 100));
}

function PulseRing({ score }: { score: number }) {
  const size = 200;
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const animDash = (animated / 100) * circ;
  const color = score < 30 ? "#f59e0b" : score < 60 ? "#3b82f6" : "#00d2b4";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 4}
          strokeDasharray={`${animDash} ${circ}`}
          strokeLinecap="round"
          style={{
            opacity: 0.15,
            transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${animDash} ${circ}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            fontFamily: "'Inter',sans-serif",
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {animated}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(0,210,180,0.85)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          Pulse
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "3px 10px",
            borderRadius: 99,
            background: `${color}22`,
            border: `1px solid ${color}55`,
            fontSize: 11,
            fontWeight: 600,
            color: color,
            letterSpacing: "0.05em",
          }}
        >
          {score < 30
            ? "STARTING"
            : score < 60
              ? "GROWING"
              : score < 80
                ? "STRONG"
                : "ELITE"}
        </div>
      </div>
    </div>
  );
}

function PillarBar({
  label,
  value,
  color,
  icon,
  sublabel,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
  sublabel?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 400);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <div>
            <span
              style={{
                fontSize: 13,
                color: "#e8eef8",
                fontWeight: 600,
              }}
            >
              {label}
            </span>
            {sublabel ? (
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(168,184,208,0.92)",
                  marginTop: 2,
                  lineHeight: 1.45,
                }}
              >
                {sublabel}
              </div>
            ) : null}
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
          {value}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            background: color,
            width: `${w}%`,
            transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 10px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

export default function PulseDetailsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pulseScore, setPulseScore] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const [learningCount, setLearningCount] = useState(0);
  const [projectsPercent, setProjectsPercent] = useState(0);

  const refreshProjectsSlice = useCallback(() => {
    setProjectsPercent(projectsPulsePillarPercent(readProjectStateMap()));
  }, []);

  const refreshPulseFromDb = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from("user_data")
      .select("pulse_score, username")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) return;
    setPulseScore(
      Math.min(100, Math.max(0, Math.round(Number(profile.pulse_score ?? 0))))
    );
    setUsername(profile.username ?? null);
  }, [supabase]);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("user_data")
      .select("pulse_score, username")
      .eq("id", user.id)
      .maybeSingle();

    const score = Math.min(
      100,
      Math.max(0, Math.round(Number(profile?.pulse_score ?? 0)))
    );
    setPulseScore(score);
    setUsername(profile?.username ?? null);

    try {
      const modules = await listLearningModules(supabase, user.id);
      setLearningCount(modules.length);
    } catch {
      setLearningCount(0);
    }

    refreshProjectsSlice();
    setLoading(false);
  }, [supabase, router, refreshProjectsSlice]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === PROJECT_STATE_STORAGE_KEY ||
        e.key === "uniflow.projectsPulseLastAggregate"
      ) {
        refreshProjectsSlice();
      }
    };
    const onProjectState = () => refreshProjectsSlice();
    const onPulseSynced = () => {
      refreshProjectsSlice();
      void refreshPulseFromDb();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("uniflow-project-state-changed", onProjectState);
    window.addEventListener("uniflow-projects-pulse-synced", onPulseSynced);
    const onWindowFocus = () => {
      refreshProjectsSlice();
      void refreshPulseFromDb();
    };
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      refreshProjectsSlice();
      void refreshPulseFromDb();
    };
    window.addEventListener("focus", onWindowFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("uniflow-project-state-changed", onProjectState);
      window.removeEventListener("uniflow-projects-pulse-synced", onPulseSynced);
      window.removeEventListener("focus", onWindowFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshProjectsSlice, refreshPulseFromDb]);

  const learningPercent = learningProgressFromModuleCount(learningCount);
  const modulesToTarget = Math.max(0, 7 - learningCount);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(232,238,248,0.85)",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Loading Pulse…
      </div>
    );
  }

  return (
    <div
      className="brand-dark-shell"
      style={{
        minHeight: "100vh",
        background: "#080c14",
        color: "#e8eef8",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(0,210,180,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,180,.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 520,
          height: 520,
          borderRadius: "50%",
          filter: "blur(120px)",
          background: "radial-gradient(circle, rgba(0,210,180,.14) 0%, transparent 70%)",
          top: -160,
          left: -80,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 420,
          height: 420,
          borderRadius: "50%",
          filter: "blur(120px)",
          background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)",
          bottom: -120,
          right: -60,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "28px 20px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <UniFlowBrandLink variant="dark" size="md" />
            <button
              type="button"
              onClick={() => router.replace("/dashboard")}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(0,210,180,.28)",
                background: "rgba(0,210,180,.12)",
                color: "#7ae9d8",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Back to dashboard
            </button>
          </div>
          {username ? (
            <Link
              href={`/pulse/${username}`}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#00d2b4",
                textDecoration: "none",
              }}
            >
              Public pulse card →
            </Link>
          ) : null}
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            fontFamily: "'Inter',sans-serif",
            letterSpacing: "-0.03em",
            margin: "0 0 8px",
            color: "#fff",
          }}
        >
          Pulse details
        </h1>
        <p style={{ margin: "0 0 28px", fontSize: 14, color: "rgba(232,238,248,0.78)", maxWidth: 640, lineHeight: 1.6 }}>
          Your official Pulse score (below) is what employers and programs see. Use the breakdown to see where to invest time next: sync learning modules, verify projects with evidence, and soon community activity.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: 24,
            alignItems: "start",
          }}
          className="pulse-details-grid"
        >
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(0,210,180,.22)",
              background: "linear-gradient(160deg, rgba(255,255,255,.06) 0%, rgba(0,210,180,.06) 100%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,.04) inset, 0 12px 40px rgba(0,0,0,.25)",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PulseRing score={pulseScore} />
            <p style={{ margin: "20px 0 0", fontSize: 13, color: "rgba(168,184,208,0.95)", textAlign: "center", lineHeight: 1.55 }}>
              Capped at 100. Updates when you sync learning, submit project evidence, and complete verification.
            </p>
          </div>

          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.04)",
              boxShadow: "0 12px 40px rgba(0,0,0,.2)",
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Inter',sans-serif", margin: "0 0 18px", color: "rgba(255,255,255,.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Where you stand
            </h2>

            <PillarBar
              label="Learning"
              icon="📚"
              value={learningPercent}
              color="#3b82f6"
              sublabel={
                learningCount === 0
                  ? "No modules synced yet — connect your LMS from Learning."
                  : `${learningCount} module${learningCount === 1 ? "" : "s"} synced${modulesToTarget > 0 ? ` · ~${modulesToTarget} more toward a strong baseline` : ""}`
              }
            />

            <PillarBar
              label="Projects"
              icon="🧩"
              value={projectsPercent}
              color="#00d2b4"
              sublabel="From studio evidence and verified submissions in Projects."
            />

            <div
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 14,
                background: "rgba(99,102,241,.1)",
                border: "1px dashed rgba(129,140,248,.45)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14 }}>🤝</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e8eef8" }}>Community</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "#c4b5fd",
                    border: "1px solid rgba(196,181,253,.5)",
                    borderRadius: 99,
                    padding: "3px 10px",
                    background: "rgba(99,102,241,.15)",
                  }}
                >
                  COMING SOON
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(199,210,254,0.9)", lineHeight: 1.55 }}>
                Networking and community signals will add to Pulse here. For now, focus on learning sync and verified projects.
              </p>
            </div>

            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.1)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,210,180,.85)", margin: "0 0 12px", fontFamily: "'Inter',sans-serif" }}>
                NEXT STEPS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/learning" style={{ fontSize: 14, fontWeight: 600, color: "#5eead4", textDecoration: "none" }}>
                  Sync modules → Learning
                </Link>
                <Link href="/projects" style={{ fontSize: 14, fontWeight: 600, color: "#5eead4", textDecoration: "none" }}>
                  Build evidence → Projects
                </Link>
                <Link href="/projects/completed" style={{ fontSize: 14, fontWeight: 600, color: "#5eead4", textDecoration: "none" }}>
                  Verify for Pulse → Completed projects
                </Link>
                <Link href="/portfolio" style={{ fontSize: 14, fontWeight: 600, color: "#5eead4", textDecoration: "none" }}>
                  Share work → Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @media (max-width: 800px) {
            .pulse-details-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
