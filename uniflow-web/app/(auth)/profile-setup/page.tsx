"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","Data Science","Web Development","Machine Learning","Networking","Cybersecurity","Database Systems","Software Engineering","UI/UX Design","Statistics","Economics"];
const JOB_ROLES = ["Software Engineer","Data Analyst","Data Scientist","Frontend Developer","Backend Developer","Full Stack Developer","DevOps Engineer","UI/UX Designer","Cybersecurity Analyst","Machine Learning Engineer","Product Manager","Business Analyst","Network Engineer","Cloud Engineer","Mobile Developer"];

export default function ProfileSetupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [form, setForm] = useState({ displayName:"", username:"", isMentor:false, mentorSubjects:[] as string[], jobRole:"" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const name = user.user_metadata?.full_name || "";
      const avatar = user.user_metadata?.avatar_url || "";
      setAvatarUrl(avatar);
      setForm(f => ({ ...f, displayName: name, username: name.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"") }));
    });
  }, []);

  const toggleSubject = (s: string) =>
    setForm(f => ({ ...f, mentorSubjects: f.mentorSubjects.includes(s) ? f.mentorSubjects.filter(x=>x!==s) : f.mentorSubjects.length < 5 ? [...f.mentorSubjects, s] : f.mentorSubjects }));

  const handleSave = async () => {
    if (!form.displayName.trim()) { setError("Display name is required."); return; }
    if (!/^[a-z0-9_]{3,20}$/.test(form.username)) { setError("Username: 3–20 chars, lowercase letters, numbers, underscores only."); return; }
    setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { error: dbErr } = await supabase.from("profiles").upsert({ id:user.id, display_name:form.displayName.trim(), username:form.username.trim(), avatar_url:avatarUrl, is_mentor:form.isMentor, mentor_subjects:form.mentorSubjects, job_role:form.jobRole, pulse_score:0 });
    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    router.push("/");
  };

  const canNext = form.displayName.trim().length > 0 && /^[a-z0-9_]{3,20}$/.test(form.username);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .root{min-height:100vh;background:var(--app-bg-gradient);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;padding:32px 16px;position:relative;overflow:hidden;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.04) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:fixed;pointer-events:none;border-radius:50%;filter:blur(100px);}
        .g1{width:500px;height:500px;background:radial-gradient(circle,rgba(0,210,180,.14) 0%,transparent 70%);top:-150px;left:-150px;}
        .g2{width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%);bottom:-100px;right:-100px;}
        .logo{display:flex;align-items:center;gap:10px;margin-bottom:40px;position:relative;z-index:1;}
        .logo-mark{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#00d2b4,#6366f1);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:#fff;}
        .logo-name{font-family:'Syne',sans-serif;font-weight:700;font-size:19px;color:#fff;}
        .logo-name span{color:#00d2b4;}
        .progress-wrap{width:100%;max-width:520px;display:flex;gap:8px;margin-bottom:32px;position:relative;z-index:1;}
        .prog-seg{flex:1;height:3px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;position:relative;}
        .prog-seg::after{content:'';position:absolute;inset:0;border-radius:99px;background:linear-gradient(90deg,#00d2b4,#6366f1);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.4,0,.2,1);}
        .prog-seg.done::after{transform:scaleX(1);}
        .card{width:100%;max-width:520px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:40px 40px 36px;position:relative;z-index:1;backdrop-filter:blur(20px);}
        .step-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.22);border-radius:99px;padding:3px 12px;font-size:11px;font-weight:500;letter-spacing:.08em;color:#00d2b4;text-transform:uppercase;margin-bottom:16px;}
        .card-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:6px;}
        .card-sub{font-size:14px;color:rgba(255,255,255,.35);line-height:1.6;margin-bottom:32px;}
        .avatar-row{display:flex;align-items:center;gap:16px;margin-bottom:28px;}
        .avatar-img{width:60px;height:60px;border-radius:50%;border:2px solid rgba(0,210,180,.4);object-fit:cover;background:#1a2030;display:flex;align-items:center;justify-content:center;font-size:22px;color:rgba(255,255,255,.4);overflow:hidden;}
        .avatar-img img{width:100%;height:100%;object-fit:cover;}
        .avatar-hint{font-size:13px;color:rgba(255,255,255,.3);line-height:1.5;}
        .avatar-hint strong{color:rgba(255,255,255,.55);font-weight:500;}
        .field{margin-bottom:20px;}
        .field label{display:block;font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px;}
        .field input{width:100%;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff;outline:none;transition:border-color .2s,background .2s;}
        .field input:focus{border-color:rgba(0,210,180,.5);background:rgba(0,210,180,.05);}
        .field input::placeholder{color:rgba(255,255,255,.2);}
        .field-hint{font-size:12px;color:rgba(255,255,255,.22);margin-top:6px;}
        .prefix-wrap{position:relative;}
        .prefix{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:15px;color:rgba(255,255,255,.3);pointer-events:none;}
        .prefix-wrap input{padding-left:130px;}
        .mentor-toggle-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:16px;margin-bottom:24px;cursor:pointer;transition:border-color .2s,background .2s;}
        .mentor-toggle-card.active{border-color:rgba(0,210,180,.35);background:rgba(0,210,180,.06);}
        .toggle-icon{width:42px;height:42px;border-radius:11px;flex-shrink:0;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.2);display:flex;align-items:center;justify-content:center;font-size:18px;}
        .toggle-copy{flex:1;}
        .toggle-copy strong{display:block;font-size:14px;font-weight:500;color:rgba(255,255,255,.8);margin-bottom:2px;}
        .toggle-copy span{font-size:12px;color:rgba(255,255,255,.3);}
        .toggle-switch{width:44px;height:24px;border-radius:99px;background:rgba(255,255,255,.12);position:relative;transition:background .2s;flex-shrink:0;}
        .toggle-switch.on{background:linear-gradient(90deg,#00d2b4,#6366f1);}
        .toggle-switch::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .22s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 4px rgba(0,0,0,.3);}
        .toggle-switch.on::after{transform:translateX(20px);}
        .section-label{font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:12px;}
        .subjects-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}
        .subj-pill{padding:6px 14px;border-radius:99px;font-size:13px;cursor:pointer;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.45);background:transparent;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .subj-pill:hover{border-color:rgba(0,210,180,.35);color:rgba(255,255,255,.7);}
        .subj-pill.selected{background:rgba(0,210,180,.12);border-color:rgba(0,210,180,.5);color:#00d2b4;}
        .subj-count{font-size:12px;color:rgba(255,255,255,.25);margin-top:-16px;margin-bottom:24px;}
        .select-wrap{position:relative;margin-bottom:28px;}
        .select-wrap select{width:100%;padding:13px 16px;appearance:none;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff;outline:none;cursor:pointer;transition:border-color .2s;}
        .select-wrap select:focus{border-color:rgba(0,210,180,.5);}
        .select-wrap select option{background:#131928;color:#fff;}
        .select-arrow{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);pointer-events:none;font-size:12px;}
        .error-box{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;padding:11px 14px;font-size:13px;color:#fca5a5;margin-bottom:20px;}
        .btn-row{display:flex;gap:12px;}
        .btn-back{padding:14px 22px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:rgba(255,255,255,.5);cursor:pointer;transition:all .18s;}
        .btn-back:hover{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);}
        .btn-next{flex:1;padding:14px 24px;border-radius:12px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#fff;cursor:pointer;transition:opacity .18s,transform .18s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .btn-next:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
        .btn-next:disabled{opacity:.5;cursor:not-allowed;}
        .spinner{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:560px){.card{padding:28px 20px 24px;}.btn-row{flex-direction:column;}.btn-back{order:2;}}
      `}</style>

      <div className="root">
        <div className="bg-grid" /><div className="bg-glow g1" /><div className="bg-glow g2" />
        <div className="logo"><div className="logo-mark">U</div><div className="logo-name">Uni<span>Flow</span></div></div>
        <div className="progress-wrap">
          <div className={`prog-seg ${step >= 1 ? "done" : ""}`} />
          <div className={`prog-seg ${step >= 2 ? "done" : ""}`} />
        </div>

        <div className="card">
          {step === 1 && (
            <>
              <div className="step-chip">Step 1 of 2</div>
              <h1 className="card-title">Set up your profile</h1>
              <p className="card-sub">This is how other students and employers will see you on UniFlow.</p>
              <div className="avatar-row">
                <div className="avatar-img">{avatarUrl ? <img src={avatarUrl} alt="avatar" /> : <span>👤</span>}</div>
                <div className="avatar-hint"><strong>Profile photo from Google</strong><br />Your Google account photo is used automatically.</div>
              </div>
              <div className="field">
                <label>Display Name</label>
                <input type="text" placeholder="e.g. Kamal Perera" value={form.displayName} onChange={e=>setForm(f=>({...f,displayName:e.target.value}))} />
              </div>
              <div className="field">
                <label>Username</label>
                <div className="prefix-wrap">
                  <span className="prefix">uniflow.lk/p/</span>
                  <input type="text" placeholder="kamal_perera" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,"")}))} />
                </div>
                <div className="field-hint">3–20 chars · lowercase letters, numbers, underscores · your public portfolio URL</div>
              </div>
              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button className="btn-next" disabled={!canNext} onClick={()=>{setError("");setStep(2);}}>Continue →</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="step-chip">Step 2 of 2</div>
              <h1 className="card-title">Your academic & career info</h1>
              <p className="card-sub">This powers your Pulse Score and portfolio.</p>
              <div className={`mentor-toggle-card ${form.isMentor?"active":""}`} onClick={()=>setForm(f=>({...f,isMentor:!f.isMentor}))}>
                <div className="toggle-icon">🎓</div>
                <div className="toggle-copy"><strong>Available to Mentor</strong><span>Peers can request your help · earn Community Impact points</span></div>
                <div className={`toggle-switch ${form.isMentor?"on":""}`} />
              </div>
              <div className="section-label">Strong Subjects{form.isMentor && " · Select up to 5 you can tutor"}</div>
              <div className="subjects-grid">
                {SUBJECTS.map(s=>(
                  <button key={s} className={`subj-pill ${form.mentorSubjects.includes(s)?"selected":""}`} onClick={()=>toggleSubject(s)}>{s}</button>
                ))}
              </div>
              <div className="subj-count">{form.mentorSubjects.length}/5 selected</div>
              <div className="section-label">Target Job Role</div>
              <div className="select-wrap">
                <select value={form.jobRole} onChange={e=>setForm(f=>({...f,jobRole:e.target.value}))}>
                  <option value="">Select a role…</option>
                  {JOB_ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button className="btn-back" onClick={()=>{setError("");setStep(1);}}>← Back</button>
                <button className="btn-next" onClick={handleSave} disabled={saving}>
                  {saving?<><span className="spinner"/>Saving…</>:"Complete Setup 🚀"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}