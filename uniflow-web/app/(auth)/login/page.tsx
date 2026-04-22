"use client";

import { createClient } from "@/lib/supabase/client";
import { callbackUrlWithNext, getSafeNextPath } from "@/lib/auth/safe-next-path";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginPageContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");
  const safeNext = useMemo(() => getSafeNextPath(nextRaw), [nextRaw]);
  const authCallbackUrl = useMemo(
    () => (typeof window !== "undefined" ? callbackUrlWithNext(window.location.origin, safeNext) : ""),
    [safeNext]
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState("");

  const handleMagicLink = async () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      setMagicError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setMagicError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo: authCallbackUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/callback`,
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (error) {
      setMagicError(error.message || "Unable to send your magic link.");
      return;
    }
    setMagicSent(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .login-root{min-height:100vh;background:#080c14;display:flex;font-family:'DM Sans',sans-serif;overflow:hidden;position:relative;color:var(--brand-dark-text,#dce3ee);}
        .bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,210,180,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.04) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .glow-1{width:520px;height:520px;background:radial-gradient(circle,rgba(0,210,180,.18) 0%,transparent 70%);top:-120px;left:-120px;animation:drift1 9s ease-in-out infinite alternate;}
        .glow-2{width:380px;height:380px;background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%);bottom:-80px;right:30%;animation:drift2 11s ease-in-out infinite alternate;}
        @keyframes drift1{to{transform:translate(40px,60px)}}
        @keyframes drift2{to{transform:translate(-30px,-50px)}}
        .left-panel{flex:1;display:flex;flex-direction:column;justify-content:center;padding:64px 72px;position:relative;z-index:1;}
        .right-panel{width:480px;max-width:100%;background:rgba(10,14,22,.92);border-left:1px solid rgba(0,210,180,.18);display:flex;flex-direction:column;align-items:stretch;justify-content:center;padding:64px 48px;position:relative;z-index:1;backdrop-filter:blur(16px);box-shadow:-12px 0 48px rgba(0,0,0,.35);}
        .logo{display:flex;align-items:center;gap:10px;margin-bottom:72px;}
        .logo-mark{width:36px;height:36px;background:linear-gradient(135deg,#00d2b4,#6366f1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;font-weight:800;font-size:16px;color:#fff;}
        .logo-text{font-family:'DM Sans',sans-serif;font-weight:700;font-size:20px;color:#fff;letter-spacing:-.02em;}
        .logo-text span{color:#00d2b4;}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.25);border-radius:100px;padding:4px 14px;font-size:12px;font-weight:500;letter-spacing:.08em;color:#00d2b4;margin-bottom:28px;text-transform:uppercase;}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#00d2b4;animation:blink 1.4s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        .hero-heading{font-family:'DM Sans',sans-serif;font-size:clamp(32px,3.6vw,48px);font-weight:700;line-height:1.12;color:#f0f4fb;letter-spacing:-.02em;margin-bottom:20px;}
        .hero-heading .accent{background:linear-gradient(90deg,#00d2b4,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .hero-sub{font-size:16px;font-weight:400;line-height:1.7;color:rgba(212,221,232,.82);max-width:420px;margin-bottom:56px;}
        .stats{display:flex;gap:24px;flex-wrap:wrap;}
        .stat{display:flex;flex-direction:column;}
        .stat-value{font-family:'DM Sans',sans-serif;font-size:26px;font-weight:700;color:#f0f4fb;letter-spacing:-.02em;}
        .stat-label{font-size:12px;font-weight:400;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-top:2px;}
        .stat-divider{width:1px;background:rgba(255,255,255,.1);align-self:stretch;}
        .card-label{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(0,210,180,.75);margin-bottom:16px;display:inline-block;text-decoration:none;transition:color .18s,opacity .18s;}
        .card-label:hover,.card-label:focus-visible{color:#33ddc4;outline:none;}
        .card-heading{font-family:'DM Sans',sans-serif;font-size:24px;font-weight:700;color:#f0f4fb;letter-spacing:-.02em;text-align:center;margin-bottom:10px;}
        .card-sub{font-size:14px;color:rgba(212,221,232,.88);text-align:center;line-height:1.65;margin-bottom:22px;}
        .magic-form-wrap{width:100%;padding:20px;border-radius:16px;background:rgba(0,210,180,.06);border:1px solid rgba(0,210,180,.22);margin-bottom:8px;}
        .email-input{width:100%;padding:14px 16px;background:rgba(8,12,20,.85);border:1px solid rgba(255,255,255,.14);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#f0f4fb;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;margin-bottom:12px;}
        .email-input:focus{border-color:rgba(0,210,180,.55);background:rgba(8,12,20,.95);box-shadow:0 0 0 3px rgba(0,210,180,.12);}
        .email-input::placeholder{color:rgba(168,184,208,.65);}
        .btn-magic{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:15px 24px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#fff;cursor:pointer;transition:opacity .18s,transform .18s;}
        .btn-magic:hover:not(:disabled){opacity:.88;transform:translateY(-1px);}
        .btn-magic:disabled{opacity:.55;cursor:not-allowed;}
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .magic-error{font-size:13px;color:#fecaca;background:rgba(127,29,29,.35);border:1px solid rgba(248,113,113,.35);border-radius:10px;padding:10px 14px;margin-top:8px;text-align:center;width:100%;}
        .magic-sent{text-align:center;padding:24px 0;}
        .magic-sent-icon{font-size:40px;margin-bottom:12px;}
        .magic-sent-title{font-family:'DM Sans',sans-serif;font-size:18px;font-weight:700;color:#f0f4fb;margin-bottom:8px;}
        .magic-sent-sub{font-size:14px;color:rgba(212,221,232,.85);line-height:1.6;}
        .magic-sent-email{color:#00d2b4;font-weight:500;}
        .magic-sent-retry{margin-top:16px;font-size:12px;color:rgba(255,255,255,.2);}
        .magic-sent-retry button{background:none;border:none;color:rgba(0,210,180,.6);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;text-decoration:underline;}
        .divider{display:flex;align-items:center;gap:12px;width:100%;margin:28px 0;}
        .divider-line{flex:1;height:1px;background:rgba(255,255,255,.08);}
        .divider-text{font-size:12px;color:rgba(168,184,208,.55);font-weight:500;letter-spacing:.04em;}
        .info-list{width:100%;display:flex;flex-direction:column;gap:14px;}
        .info-item{display:flex;align-items:flex-start;gap:12px;}
        .info-icon{width:30px;height:30px;flex-shrink:0;border-radius:8px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.2);display:flex;align-items:center;justify-content:center;font-size:13px;}
        .info-text{font-size:13px;color:rgba(212,221,232,.78);line-height:1.55;}
        .info-text strong{color:#f0f4fb;font-weight:600;}
        .terms{margin-top:32px;font-size:11px;color:rgba(168,184,208,.65);text-align:center;line-height:1.6;}
        .terms a{color:rgba(0,210,180,.6);text-decoration:none;}
        @media(max-width:768px){.login-root{flex-direction:column;}.left-panel{padding:48px 32px 32px;}.right-panel{width:100%;border-left:none;border-top:1px solid rgba(0,210,180,.15);padding:40px 32px;box-shadow:none;}}
      `}</style>

      <div className="login-root brand-dark-shell">
        <div className="bg-grid" /><div className="bg-glow glow-1" /><div className="bg-glow glow-2" />
        <div className="left-panel">
          <div className="logo"><div className="logo-mark">U</div><div className="logo-text">Uni<span>Flow</span></div></div>
          <div className="eyebrow"><span className="eyebrow-dot" />Student Career Platform</div>
          <h1 className="hero-heading">Your skills,<br /><span className="accent">verified & visible.</span></h1>
          <p className="hero-sub">UniFlow turns your academic effort into a public professional brand. Every KPI completed, every project built — tracked, scored, and showcased automatically.</p>
          <div className="stats">
            <div className="stat"><span className="stat-value">0→100</span><span className="stat-label">Pulse Score</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-value">Live</span><span className="stat-label">Portfolio</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-value">∞</span><span className="stat-label">Opportunities</span></div>
          </div>
        </div>
        <div className="right-panel">
          <a className="card-label" href="/register">Get started</a>
          <h2 className="card-heading">Welcome to UniFlow</h2>
          <p className="card-sub">
            Sign in with a secure magic link — no password, no OAuth.
            {safeNext ? (
              <>
                <br />
                <span style={{ color: "rgba(0,210,180,.85)" }}>After sign-in you&apos;ll continue where you left off.</span>
              </>
            ) : null}
          </p>

          {magicSent ? (
            <div className="magic-sent">
              <div className="magic-sent-icon">📬</div>
              <div className="magic-sent-title">Check your inbox</div>
              <div className="magic-sent-sub">
                We sent a sign-in link to<br />
                <span className="magic-sent-email">{email.trim().toLowerCase()}</span>
              </div>
              <div className="magic-sent-retry">
                Wrong address?{" "}
                <button type="button" onClick={() => { setMagicSent(false); setEmail(""); setMagicError(""); }}>
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <div className="magic-form-wrap">
              <input
                className="email-input"
                type="email"
                placeholder="your@university.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setMagicError(""); }}
                onKeyDown={e => e.key === "Enter" && handleMagicLink()}
                autoComplete="email"
                disabled={loading}
                aria-invalid={Boolean(magicError)}
                aria-describedby={magicError ? "login-magic-error" : undefined}
              />
              <button type="button" className="btn-magic" onClick={handleMagicLink} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Sending…
                  </>
                ) : (
                  "✉ Send magic link"
                )}
              </button>
              {magicError ? (
                <div id="login-magic-error" className="magic-error" role="alert">
                  {magicError}
                </div>
              ) : null}
            </div>
          )}

          <div className="divider"><div className="divider-line" /><span className="divider-text">what you get</span><div className="divider-line" /></div>
          <div className="info-list">
            <div className="info-item"><div className="info-icon">📊</div><div className="info-text"><strong>Employability Pulse Score</strong> — a live 0–100 metric that grows as you learn and build.</div></div>
            <div className="info-item"><div className="info-icon">🔗</div><div className="info-text"><strong>Public Portfolio URL</strong> — share uniflow.lk/p/you on LinkedIn with verified proof of skills.</div></div>
            <div className="info-item"><div className="info-icon">🎓</div><div className="info-text"><strong>Mentor Mode</strong> — tutor peers, earn community impact points, get endorsements.</div></div>
          </div>
          <p className="terms">
            By signing in you agree to our <a href="/terms-of-service">Terms of Service</a> and{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="brand-dark-shell" style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-dark-muted)", fontFamily: "system-ui,sans-serif" }}>
          Loading…
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
