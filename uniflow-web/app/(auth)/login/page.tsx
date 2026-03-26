"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  const handleMagicLinkLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter a valid email address to continue.");
      return;
    }

    setError("");
    setSentTo("");
    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${location.origin}/callback`,
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      setError(otpError.message || "Unable to send your magic link right now.");
      setLoading(false);
      return;
    }

    setSentTo(normalizedEmail);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .login-root{min-height:100vh;background:var(--app-bg-gradient);display:flex;font-family:'DM Sans',sans-serif;overflow:hidden;position:relative;}
        .bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,210,180,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.04) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .glow-1{width:520px;height:520px;background:radial-gradient(circle,rgba(0,210,180,.18) 0%,transparent 70%);top:-120px;left:-120px;animation:drift1 9s ease-in-out infinite alternate;}
        .glow-2{width:380px;height:380px;background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%);bottom:-80px;right:30%;animation:drift2 11s ease-in-out infinite alternate;}
        @keyframes drift1{to{transform:translate(40px,60px)}}
        @keyframes drift2{to{transform:translate(-30px,-50px)}}
        .left-panel{flex:1;display:flex;flex-direction:column;justify-content:center;padding:64px 72px;position:relative;z-index:1;}
        .right-panel{width:480px;background:rgba(255,255,255,.03);border-left:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 48px;position:relative;z-index:1;backdrop-filter:blur(16px);}
        .logo{display:flex;align-items:center;gap:10px;margin-bottom:72px;}
        .logo-mark{width:36px;height:36px;background:linear-gradient(135deg,#00d2b4,#6366f1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:#fff;}
        .logo-text{font-family:'Syne',sans-serif;font-weight:700;font-size:20px;color:#fff;letter-spacing:-.3px;}
        .logo-text span{color:#00d2b4;}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.25);border-radius:100px;padding:4px 14px;font-size:12px;font-weight:500;letter-spacing:.08em;color:#00d2b4;margin-bottom:28px;text-transform:uppercase;}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:#00d2b4;animation:blink 1.4s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        .hero-heading{font-family:'Syne',sans-serif;font-size:clamp(36px,4vw,54px);font-weight:800;line-height:1.08;color:#fff;letter-spacing:-.04em;margin-bottom:20px;}
        .hero-heading .accent{background:linear-gradient(90deg,#00d2b4,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .hero-sub{font-size:16px;font-weight:400;line-height:1.7;color:rgba(255,255,255,.75);max-width:420px;margin-bottom:56px;}
        .stats{display:flex;gap:24px;flex-wrap:wrap;}
        .stat{display:flex;flex-direction:column;}
        .stat-value{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.04em;}
        .stat-label{font-size:12px;font-weight:600;color:rgba(255,255,255,.65);text-transform:uppercase;letter-spacing:.07em;margin-top:2px;}
        .stat-divider{width:1px;background:rgba(255,255,255,.1);align-self:stretch;}
        .card-label{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:32px;display:inline-block;text-decoration:none;transition:color .18s,opacity .18s;}
        .card-label:hover,.card-label:focus-visible{color:rgba(0,210,180,.95);opacity:1;outline:none;}
        .card-heading{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:#fff;letter-spacing:-.03em;text-align:center;margin-bottom:8px;}
        .card-sub{font-size:14px;color:rgba(255,255,255,.65);text-align:center;line-height:1.6;margin-bottom:24px;}
        .input-wrap{width:100%;margin-bottom:14px;}
        .input-wrap input{width:100%;padding:14px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#000000;outline:none;transition:border-color .2s,background .2s;font-weight:600;}
        .input-wrap input:focus{border-color:rgba(0,210,180,.45);background:rgba(0,210,180,.05);}
        .input-wrap input::placeholder{color:rgba(255,255,255,.55);}
        .btn-magic{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:15px 24px;background:#fff;border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#000000;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 4px 24px rgba(0,0,0,.35);}
        .btn-magic:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.4);}
        .btn-magic:disabled{opacity:.6;cursor:not-allowed;}
        .spinner{width:18px;height:18px;border:2px solid rgba(0,0,0,.15);border-top-color:#1a1a2e;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .feedback{width:100%;border-radius:11px;padding:10px 12px;font-size:13px;line-height:1.5;margin-bottom:12px;font-weight:600;}
        .feedback-error{background:#ffe6e6;border:1px solid #ff6b6b;color:#c92a2a;}
        .feedback-success{background:#e6f9f7;border:1px solid #1ab394;color:#0a6c5e;}
        .divider{display:flex;align-items:center;gap:12px;width:100%;margin:20px 0 28px;}
        .divider-line{flex:1;height:1px;background:rgba(255,255,255,.08);}
        .divider-text{font-size:12px;color:rgba(255,255,255,.55);font-weight:600;}
        .info-list{width:100%;display:flex;flex-direction:column;gap:14px;}
        .info-item{display:flex;align-items:flex-start;gap:12px;}
        .info-icon{width:30px;height:30px;flex-shrink:0;border-radius:8px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.2);display:flex;align-items:center;justify-content:center;font-size:13px;}
        .info-text{font-size:13px;color:rgba(255,255,255,.7);line-height:1.5;font-weight:500;}
        .info-text strong{color:#ffffff;font-weight:700;}
        .terms{margin-top:32px;font-size:11px;color:rgba(255,255,255,.55);text-align:center;line-height:1.6;font-weight:500;}
        .terms a{color:rgba(0,210,180,.95);text-decoration:none;font-weight:600;}
        @media(max-width:768px){.login-root{flex-direction:column;}.left-panel{padding:48px 32px 32px;}.right-panel{width:100%;border-left:none;border-top:1px solid rgba(255,255,255,.07);padding:40px 32px;}}
      `}</style>

      <div className="login-root">
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
          <a className="card-label" href="/register">SignUp free</a>
          <h2 className="card-heading">Welcome to UniFlow</h2>
          <p className="card-sub">Enter your email and we&apos;ll send a secure magic link. No password, no OAuth setup.</p>
          {error ? <div className="feedback feedback-error">{error}</div> : null}
          {sentTo ? <div className="feedback feedback-success">Magic link sent to <strong>{sentTo}</strong>. Check your inbox and spam folder.</div> : null}
          <div className="input-wrap">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@university.edu"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <button className="btn-magic" onClick={handleMagicLinkLogin} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? "Sending magic link…" : "Send magic link"}
          </button>
          <div className="divider"><div className="divider-line" /><span className="divider-text">what you get</span><div className="divider-line" /></div>
          <div className="info-list">
            <div className="info-item"><div className="info-icon">📊</div><div className="info-text"><strong>Employability Pulse Score</strong> — a live 0–100 metric that grows as you learn and build.</div></div>
            <div className="info-item"><div className="info-icon">🔗</div><div className="info-text"><strong>Public Portfolio URL</strong> — share uniflow.lk/p/you on LinkedIn with verified proof of skills.</div></div>
            <div className="info-item"><div className="info-icon">🎓</div><div className="info-text"><strong>Mentor Mode</strong> — tutor peers, earn community impact points, get endorsements.</div></div>
          </div>
          <p className="terms">By signing in you agree to our <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>
        </div>
      </div>
    </>
  );
}