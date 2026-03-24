"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ email:"", password:"", confirmPassword:"", displayName:"", username:"", university:"", yearOfStudy:"", jobRole:"", agreeTerms:false });
  const set = (k: string, v: string | boolean) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    if (step===0) {
      if (!form.email.includes("@")) return "Enter a valid email address.";
      if (form.password.length<8) return "Password must be at least 8 characters.";
      if (form.password!==form.confirmPassword) return "Passwords do not match.";
      if (!form.agreeTerms) return "Please accept the terms to continue.";
    }
    if (step===1) {
      if (!form.displayName.trim()) return "Display name is required.";
      if (!/^[a-z0-9_]{3,20}$/.test(form.username)) return "Username: 3–20 chars, lowercase letters, numbers, underscores.";
    }
    return "";
  };

  const next = () => { const err=validate(); if(err){setError(err);return;} setError(""); setStep(s=>s+1); };

  const handleRegister = async () => {
    const err=validate(); if(err){setError(err);return;}
    setError(""); setLoading(true);
    const {data,error:signUpErr} = await supabase.auth.signUp({ email:form.email, password:form.password, options:{ data:{full_name:form.displayName,username:form.username}, emailRedirectTo:`${location.origin}/auth/callback` } });
    if (signUpErr){setError("Could not create account right now. Please try again.");setLoading(false);return;}
    if (data.user) {
      const { error: profileErr } = await supabase.from("user_data").upsert({ id:data.user.id, email:form.email.trim(), display_name:form.displayName.trim(), username:form.username.trim(), avatar_url:"", is_mentor:false, mentor_subjects:[], job_role:form.jobRole, university:form.university, year_of_study:form.yearOfStudy, pulse_score:0 });
      if (profileErr) {
        setError("Account created, but profile setup failed. Please sign in and complete profile setup.");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setSuccess("Check your email to confirm your account, then log in!");
  };

  const handleGoogle = async () => { setGoogleLoading(true); await supabase.auth.signInWithOAuth({ provider:"google", options:{redirectTo:`${location.origin}/auth/callback`} }); setGoogleLoading(false); };

  const pwStrength = (() => { const p=form.password; if(!p)return 0; let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++; return s; })();
  const pwLabels=["","Weak","Fair","Good","Strong"];
  const pwColors=["","#ef4444","#f59e0b","#3b82f6","#00d2b4"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .root{min-height:100vh;background:var(--app-bg-gradient);display:flex;align-items:stretch;font-family:'DM Sans',sans-serif;overflow:hidden;position:relative;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.04) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;}
        .g1{width:480px;height:480px;background:radial-gradient(circle,rgba(0,210,180,.15) 0%,transparent 70%);top:-160px;right:-80px;}
        .g2{width:360px;height:360px;background:radial-gradient(circle,rgba(99,102,241,.13) 0%,transparent 70%);bottom:-100px;left:30%;}
        .sidebar{width:360px;flex-shrink:0;background:rgba(255,255,255,.02);border-right:1px solid rgba(255,255,255,.07);padding:48px 40px;display:flex;flex-direction:column;position:relative;z-index:1;}
        .logo{display:flex;align-items:center;gap:10px;margin-bottom:60px;}
        .logo-mark{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#00d2b4,#6366f1);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:#fff;}
        .logo-name{font-family:'Syne',sans-serif;font-weight:700;font-size:19px;color:#fff;}
        .logo-name span{color:#00d2b4;}
        .steps{display:flex;flex-direction:column;gap:0;flex:1;}
        .step-item{display:flex;align-items:flex-start;gap:16px;padding-bottom:36px;position:relative;}
        .step-item:not(:last-child)::after{content:'';position:absolute;left:15px;top:34px;width:1px;bottom:0;background:rgba(255,255,255,.08);}
        .step-item.active:not(:last-child)::after{background:linear-gradient(to bottom,#00d2b4,rgba(0,210,180,.1));}
        .step-dot{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border:1.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.25);background:transparent;position:relative;z-index:1;transition:all .3s;}
        .step-item.done .step-dot{background:rgba(0,210,180,.15);border-color:rgba(0,210,180,.5);color:#00d2b4;}
        .step-item.active .step-dot{background:linear-gradient(135deg,#00d2b4,#6366f1);border-color:transparent;color:#fff;box-shadow:0 0 18px rgba(0,210,180,.4);}
        .step-info{padding-top:4px;}
        .step-name{font-size:13px;font-weight:500;color:rgba(255,255,255,.25);margin-bottom:2px;transition:color .3s;}
        .step-item.active .step-name{color:#fff;}
        .step-item.done .step-name{color:rgba(0,210,180,.8);}
        .step-desc{font-size:12px;color:rgba(255,255,255,.18);}
        .step-item.active .step-desc{color:rgba(255,255,255,.35);}
        .sidebar-footer{font-size:12px;color:rgba(255,255,255,.2);line-height:1.6;}
        .sidebar-footer a{color:rgba(0,210,180,.5);text-decoration:none;}
        .main{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 48px;position:relative;z-index:1;}
        .form-wrap{width:100%;max-width:440px;}
        .form-header{margin-bottom:32px;}
        .eyebrow{display:inline-flex;align-items:center;gap:7px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.22);border-radius:99px;padding:3px 12px;margin-bottom:14px;font-size:11px;font-weight:500;letter-spacing:.08em;color:#00d2b4;text-transform:uppercase;}
        .eyebrow-dot{width:5px;height:5px;border-radius:50%;background:#00d2b4;animation:blink 1.4s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        .form-title{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.04em;margin-bottom:6px;}
        .form-sub{font-size:14px;color:rgba(255,255,255,.3);line-height:1.6;}
        .btn-google{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:14px 20px;background:#fff;border:none;border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#1a1a2e;transition:transform .18s,box-shadow .18s;box-shadow:0 4px 20px rgba(0,0,0,.3);margin-bottom:24px;}
        .btn-google:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.35);}
        .btn-google:disabled{opacity:.6;cursor:not-allowed;}
        .divider{display:flex;align-items:center;gap:12px;margin-bottom:24px;}
        .divider-line{flex:1;height:1px;background:rgba(255,255,255,.08);}
        .divider-text{font-size:12px;color:rgba(255,255,255,.2);}
        .field{margin-bottom:16px;}
        .field label{display:block;font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:7px;}
        .input-wrap{position:relative;}
        .input-wrap input{width:100%;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff;outline:none;transition:border-color .2s,background .2s;}
        .input-wrap input:focus{border-color:rgba(0,210,180,.45);background:rgba(0,210,180,.04);}
        .input-wrap input::placeholder{color:rgba(255,255,255,.18);}
        .prefix-text{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;color:rgba(255,255,255,.25);pointer-events:none;}
        .has-prefix input{padding-left:128px;}
        .row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .pw-meter{margin-top:8px;display:flex;gap:4px;align-items:center;}
        .pw-seg{flex:1;height:3px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;}
        .pw-seg-fill{height:100%;border-radius:99px;transition:width .3s,background .3s;}
        .pw-label{font-size:11px;margin-left:6px;font-weight:500;}
        .check-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;cursor:pointer;}
        .checkbox{width:18px;height:18px;border-radius:5px;flex-shrink:0;margin-top:1px;border:1.5px solid rgba(255,255,255,.2);background:transparent;display:flex;align-items:center;justify-content:center;transition:all .18s;}
        .checkbox.checked{background:linear-gradient(135deg,#00d2b4,#6366f1);border-color:transparent;}
        .check-label{font-size:13px;color:rgba(255,255,255,.35);line-height:1.5;}
        .check-label a{color:rgba(0,210,180,.6);text-decoration:none;}
        select.styled-select{width:100%;padding:13px 16px;appearance:none;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff;outline:none;cursor:pointer;transition:border-color .2s;}
        select.styled-select:focus{border-color:rgba(0,210,180,.45);}
        select.styled-select option{background:#131928;color:#fff;}
        .select-wrap{position:relative;}
        .select-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);pointer-events:none;font-size:11px;}
        .error-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:11px 14px;font-size:13px;color:#fca5a5;margin-bottom:16px;}
        .success-box{background:rgba(0,210,180,.08);border:1px solid rgba(0,210,180,.3);border-radius:14px;padding:24px;text-align:center;}
        .success-icon{font-size:36px;margin-bottom:12px;}
        .success-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#fff;margin-bottom:8px;}
        .success-text{font-size:14px;color:rgba(255,255,255,.4);line-height:1.6;}
        .btn-row{display:flex;gap:10px;}
        .btn-back{padding:13px 20px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:rgba(255,255,255,.4);cursor:pointer;transition:all .18s;}
        .btn-back:hover{background:rgba(255,255,255,.09);color:rgba(255,255,255,.7);}
        .btn-primary{flex:1;padding:13px 24px;border-radius:11px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#fff;transition:opacity .18s,transform .18s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .btn-primary:hover:not(:disabled){opacity:.88;transform:translateY(-1px);}
        .btn-primary:disabled{opacity:.5;cursor:not-allowed;}
        .spinner{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .login-link{margin-top:20px;text-align:center;font-size:13px;color:rgba(255,255,255,.25);}
        .login-link a{color:rgba(0,210,180,.6);text-decoration:none;font-weight:500;}
        @media(max-width:860px){.sidebar{display:none;}.main{padding:32px 20px;}}
      `}</style>

      <div className="root">
        <div className="bg-grid" /><div className="bg-glow g1" /><div className="bg-glow g2" />

        <div className="sidebar">
          <div className="logo"><div className="logo-mark">U</div><div className="logo-name">Uni<span>Flow</span></div></div>
          <div className="steps">
            {[{label:"Account",desc:"Email & password"},{label:"Identity",desc:"Name & public URL"},{label:"Career",desc:"Role & university"}].map((s,i)=>(
              <div key={s.label} className={`step-item ${i<step?"done":""} ${i===step?"active":""}`}>
                <div className="step-dot">{i<step?"✓":i+1}</div>
                <div className="step-info"><div className="step-name">{s.label}</div><div className="step-desc">{s.desc}</div></div>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">Already have an account?<br /><a href="/login">Sign in to UniFlow →</a></div>
        </div>

        <div className="main">
          <div className="form-wrap">
            {success ? (
              <div className="success-box">
                <div className="success-icon">📬</div>
                <div className="success-title">Check your inbox!</div>
                <div className="success-text">{success}<br /><br /><a href="/login" style={{color:"#00d2b4"}}>← Back to Login</a></div>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <div className="eyebrow"><span className="eyebrow-dot" /> New Account</div>
                  <div className="form-title">{step===0?"Create your account":step===1?"Build your identity":"Your career goals"}</div>
                  <div className="form-sub">{step===0?"Start with email or use your Google account for instant setup.":step===1?"Choose how you'll appear on UniFlow and your public portfolio.":"This personalises your Pulse Score and career recommendations."}</div>
                </div>

                {step===0 && (
                  <>
                    <button className="btn-google" onClick={handleGoogle} disabled={googleLoading}>
                      {googleLoading?<span className="spinner"/>:(
                        <svg width="20" height="20" viewBox="0 0 48 48">
                          <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9L37 9.7C33.7 6.8 29.1 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                          <path fill="#FF3D00" d="M6.3 15.1l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.7 1.1 7.8 2.9L37 9.7C33.7 6.8 29.1 5 24 5c-7.7 0-14.3 4.3-17.7 10.1z"/>
                          <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 36.5 26.9 37 24 37c-5.2 0-9.6-3.3-11.3-8H6.4v5.5C9.9 40.7 16.5 45 24 45z"/>
                          <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.9 35.8 44 30.8 44 25c0-1.3-.1-2.7-.4-5z"/>
                        </svg>
                      )}
                      {googleLoading?"Connecting…":"Sign up with Google"}
                    </button>
                    <div className="divider"><div className="divider-line"/><span className="divider-text">or register with email</span><div className="divider-line"/></div>
                    <div className="field"><label>Email Address</label><div className="input-wrap"><input type="email" placeholder="you@university.lk" value={form.email} onChange={e=>set("email",e.target.value)}/></div></div>
                    <div className="field">
                      <label>Password</label>
                      <div className="input-wrap"><input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e=>set("password",e.target.value)}/></div>
                      {form.password&&(<div className="pw-meter">{[1,2,3,4].map(i=><div className="pw-seg" key={i}><div className="pw-seg-fill" style={{width:pwStrength>=i?"100%":"0%",background:pwColors[pwStrength]}}/></div>)}<span className="pw-label" style={{color:pwColors[pwStrength]}}>{pwLabels[pwStrength]}</span></div>)}
                    </div>
                    <div className="field"><label>Confirm Password</label><div className="input-wrap"><input type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)}/></div></div>
                    <div className="check-row" onClick={()=>set("agreeTerms",!form.agreeTerms)}>
                      <div className={`checkbox ${form.agreeTerms?"checked":""}`}>{form.agreeTerms&&<span style={{color:"#fff",fontSize:"11px"}}>✓</span>}</div>
                      <div className="check-label">I agree to UniFlow's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></div>
                    </div>
                    {error&&<div className="error-box">{error}</div>}
                    <div className="btn-row"><button className="btn-primary" onClick={next}>Continue →</button></div>
                  </>
                )}

                {step===1 && (
                  <>
                    <div className="field"><label>Display Name</label><div className="input-wrap"><input type="text" placeholder="e.g. Kamal Perera" value={form.displayName} onChange={e=>set("displayName",e.target.value)}/></div></div>
                    <div className="field">
                      <label>Username · Your public portfolio URL</label>
                      <div className="input-wrap has-prefix"><span className="prefix-text">uniflow.lk/p/</span><input type="text" placeholder="kamal_perera" value={form.username} onChange={e=>set("username",e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}/></div>
                    </div>
                    {error&&<div className="error-box">{error}</div>}
                    <div className="btn-row"><button className="btn-back" onClick={()=>{setError("");setStep(0);}}>← Back</button><button className="btn-primary" onClick={next}>Continue →</button></div>
                  </>
                )}

                {step===2 && (
                  <>
                    <div className="field"><label>University / Institute</label><div className="input-wrap"><input type="text" placeholder="e.g. University of Moratuwa" value={form.university} onChange={e=>set("university",e.target.value)}/></div></div>
                    <div className="row-2">
                      <div className="field"><label>Year of Study</label><div className="select-wrap"><select className="styled-select" value={form.yearOfStudy} onChange={e=>set("yearOfStudy",e.target.value)}><option value="">Select…</option>{["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"].map(y=><option key={y} value={y}>{y}</option>)}</select><span className="select-arrow">▾</span></div></div>
                      <div className="field"><label>Target Job Role</label><div className="select-wrap"><select className="styled-select" value={form.jobRole} onChange={e=>set("jobRole",e.target.value)}><option value="">Select…</option>{["Software Engineer","Data Analyst","Frontend Developer","Backend Developer","Full Stack Developer","DevOps Engineer","UI/UX Designer","Cybersecurity Analyst","ML Engineer","Mobile Developer"].map(r=><option key={r} value={r}>{r}</option>)}</select><span className="select-arrow">▾</span></div></div>
                    </div>
                    {error&&<div className="error-box">{error}</div>}
                    <div className="btn-row"><button className="btn-back" onClick={()=>{setError("");setStep(1);}}>← Back</button><button className="btn-primary" onClick={handleRegister} disabled={loading}>{loading?<><span className="spinner"/>Creating…</>:"Create Account 🚀"}</button></div>
                  </>
                )}

                <div className="login-link">Already have an account? <a href="/login">Sign in →</a></div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}