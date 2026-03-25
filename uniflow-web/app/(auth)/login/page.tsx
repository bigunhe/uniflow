"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/callback` },
    });
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setMagicError("Please enter your email address.");
      return;
    }
    setMagicLoading(true);
    setMagicError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${location.origin}/callback` },
    });
    setMagicLoading(false);
    if (error) {
      setMagicError(error.message);
    } else {
      setMagicSent(true);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .login-root{min-height:100vh;background:#080c14;display:flex;font-family:'DM Sans',sans-serif;overflow:hidden;position:relative;}
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
        .hero-sub{font-size:16px;font-weight:300;line-height:1.7;color:rgba(255,255,255,.45);max-width:420px;margin-bottom:56px;}
        .stats{display:flex;gap:24px;flex-wrap:wrap;}
        .stat{display:flex;flex-direction:column;}
        .stat-value{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.04em;}
        .stat-label{font-size:12px;font-weight:400;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.07em;margin-top:2px;}
        .stat-divider{width:1px;background:rgba(255,255,255,.1);align-self:stretch;}
        .card-label{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:32px;display:inline-block;text-decoration:none;transition:color .18s,opacity .18s;}
        .card-label:hover,.card-label:focus-visible{color:rgba(0,210,180,.85);opacity:1;outline:none;}
        .card-heading{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:#fff;letter-spacing:-.03em;text-align:center;margin-bottom:8px;}
        .card-sub{font-size:14px;color:rgba(255,255,255,.35);text-align:center;line-height:1.6;margin-bottom:40px;}
        .btn-google{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:15px 24px;background:#fff;border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#1a1a2e;cursor:pointer;transition:transform .18s,box-shadow .18s;box-shadow:0 4px 24px rgba(0,0,0,.35);}
        .btn-google:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.4);}
        .btn-google:disabled{opacity:.6;cursor:not-allowed;}
        .spinner{width:18px;height:18px;border:2px solid rgba(0,0,0,.15);border-top-color:#1a1a2e;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .divider{display:flex;align-items:center;gap:12px;width:100%;margin:28px 0;}
        .divider-line{flex:1;height:1px;background:rgba(255,255,255,.08);}
        .divider-text{font-size:12px;color:rgba(255,255,255,.2);}
        .info-list{width:100%;display:flex;flex-direction:column;gap:14px;}
        .info-item{display:flex;align-items:flex-start;gap:12px;}
        .info-icon{width:30px;height:30px;flex-shrink:0;border-radius:8px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.2);display:flex;align-items:center;justify-content:center;font-size:13px;}
        .info-text{font-size:13px;color:rgba(255,255,255,.35);line-height:1.5;}
        .info-text strong{color:rgba(255,255,255,.6);font-weight:500;}
        .terms{margin-top:32px;font-size:11px;color:rgba(255,255,255,.2);text-align:center;line-height:1.6;}
        .terms a{color:rgba(0,210,180,.6);text-decoration:none;}
        .email-input{width:100%;padding:13px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff;outline:none;transition:border-color .2s,background .2s;margin-bottom:10px;}
        .email-input:focus{border-color:rgba(0,210,180,.45);background:rgba(0,210,180,.04);}
        .email-input::placeholder{color:rgba(255,255,255,.2);}
        .btn-magic{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:15px 24px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#fff;cursor:pointer;transition:opacity .18s,transform .18s;}
        .btn-magic:hover:not(:disabled){opacity:.88;transform:translateY(-1px);}
        .btn-magic:disabled{opacity:.55;cursor:not-allowed;}
        .magic-error{font-size:13px;color:#fca5a5;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:8px 12px;margin-top:8px;text-align:center;}
        .magic-sent{text-align:center;padding:24px 0;}
        .magic-sent-icon{font-size:40px;margin-bottom:12px;}
        .magic-sent-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;}
        .magic-sent-sub{font-size:13px;color:rgba(255,255,255,.35);line-height:1.6;}
        .magic-sent-email{color:#00d2b4;font-weight:500;}
        .magic-sent-retry{margin-top:16px;font-size:12px;color:rgba(255,255,255,.2);}
        .magic-sent-retry button{background:none;border:none;color:rgba(0,210,180,.6);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;text-decoration:underline;}
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
          <a className="card-label" href="/register">Get started free</a>
          <h2 className="card-heading">Welcome to UniFlow</h2>
          <p className="card-sub">Sign in with your university Google account to start building your verified career portfolio.</p>
          <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
            {loading ? <span className="spinner" /> : (
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9L37 9.7C33.7 6.8 29.1 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 15.1l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.7 1.1 7.8 2.9L37 9.7C33.7 6.8 29.1 5 24 5c-7.7 0-14.3 4.3-17.7 10.1z"/>
                <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 36.5 26.9 37 24 37c-5.2 0-9.6-3.3-11.3-8H6.4v5.5C9.9 40.7 16.5 45 24 45z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.9 35.8 44 30.8 44 25c0-1.3-.1-2.7-.4-5z"/>
              </svg>
            )}
            {loading ? "Connecting…" : "Continue with Google"}
          </button>
          <div className="divider"><div className="divider-line" /><span className="divider-text">or sign in with email</span><div className="divider-line" /></div>

          {magicSent ? (
            <div className="magic-sent">
              <div className="magic-sent-icon">📬</div>
              <div className="magic-sent-title">Check your inbox</div>
              <div className="magic-sent-sub">
                We sent a sign-in link to<br />
                <span className="magic-sent-email">{email}</span>
              </div>
              <div className="magic-sent-retry">
                Wrong address?{" "}
                <button onClick={() => { setMagicSent(false); setEmail(""); }}>Try again</button>
              </div>
            </div>
          ) : (
            <>
              <input
                className="email-input"
                type="email"
                placeholder="your@university.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setMagicError(""); }}
                onKeyDown={e => e.key === "Enter" && handleMagicLink()}
              />
              <button className="btn-magic" onClick={handleMagicLink} disabled={magicLoading}>
                {magicLoading
                  ? <><span className="spinner" style={{borderColor:"rgba(255,255,255,.3)",borderTopColor:"#fff"}} />Sending…</>
                  : "✉ Send Magic Link"}
              </button>
              {magicError && <div className="magic-error">{magicError}</div>}
            </>
          )}

          <div className="divider" style={{marginTop:24}}><div className="divider-line" /><span className="divider-text">what you get</span><div className="divider-line" /></div>
          <div className="info-list">
            <div className="info-item"><div className="info-icon">📊</div><div className="info-text"><strong>Employability Pulse Score</strong> — a live 0–100 metric that grows as you learn and build.</div></div>
            <div className="info-item"><div className="info-icon">🔗</div><div className="info-text"><strong>Public Portfolio URL</strong> — share uniflow.lk/p/you on LinkedIn with verified proof of skills.</div></div>
            <div className="info-item"><div className="info-icon">🎓</div><div className="info-text"><strong>Mentor Mode</strong> — tutor peers, earn community impact points, get endorsements.</div></div>
          </div>
          <p className="terms">By signing in you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
        </div>
      </div>
    </>
  );
}