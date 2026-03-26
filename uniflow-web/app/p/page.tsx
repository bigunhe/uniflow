"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology","Computer Science",
  "Data Science","Web Development","Machine Learning","Networking",
  "Cybersecurity","Database Systems","Software Engineering","UI/UX Design",
  "Statistics","Economics",
];

const JOB_ROLES = [
  "Software Engineer","Data Analyst","Data Scientist","Frontend Developer",
  "Backend Developer","Full Stack Developer","DevOps Engineer","UI/UX Designer",
  "Cybersecurity Analyst","Machine Learning Engineer","Product Manager",
  "Business Analyst","Network Engineer","Cloud Engineer","Mobile Developer",
];

const YEARS = ["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"];

type Profile = {
  display_name: string;
  username: string;
  avatar_url: string;
  email: string;
  is_mentor: boolean;
  mentor_subjects: string[];
  job_role: string;
  university: string;
  year_of_study: string;
  pulse_score: number;
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"info"|"mentor"|"account">("info");
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: string | boolean | string[]) =>
    setProfile(p => p ? { ...p, [k]: v } : p);

  const toggleSubject = (s: string) => {
    if (!profile) return;
    const cur = profile.mentor_subjects || [];
    const next = cur.includes(s) ? cur.filter(x => x !== s) : cur.length < 5 ? [...cur, s] : cur;
    set("mentor_subjects", next);
  };

  const handleSave = async () => {
    if (!profile) return;
    if (!profile.display_name.trim()) { setError("Display name is required."); return; }
    if (!/^[a-z0-9_]{3,20}$/.test(profile.username)) {
      setError("Username: 3–20 chars, lowercase letters, numbers, underscores only."); return;
    }
    setSaving(true); setError("");
    const { error: dbErr } = await supabase.from("profiles").update({
      display_name: profile.display_name.trim(),
      username: profile.username.trim(),
      is_mentor: profile.is_mentor,
      mentor_subjects: profile.mentor_subjects,
      job_role: profile.job_role,
      university: profile.university,
      year_of_study: profile.year_of_study,
    }).eq("id", userId);
    setSaving(false);
    if (dbErr) { setError(dbErr.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${profile?.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight:"100vh",background:"var(--app-bg-gradient)",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ width:40,height:40,borderRadius:"50%",border:"3px solid rgba(0,210,180,.2)",borderTopColor:"#00d2b4",animation:"spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}

        .root{min-height:100vh;background:#080c14;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;align-items:center;padding:40px 16px 80px;position:relative;overflow:hidden;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:fixed;border-radius:50%;filter:blur(110px);pointer-events:none;}
        .g1{width:500px;height:500px;background:radial-gradient(circle,rgba(0,210,180,.11) 0%,transparent 70%);top:-160px;left:-100px;}
        .g2{width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,.09) 0%,transparent 70%);bottom:-100px;right:-80px;}

        /* Topbar */
        .topbar{width:100%;max-width:680px;display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;position:relative;z-index:1;}
        .back-btn{display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);color:rgba(255,255,255,.5);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .18s;text-decoration:none;}
        .back-btn:hover{background:rgba(255,255,255,.09);color:rgba(255,255,255,.8);}
        .page-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fff;}

        /* Avatar hero */
        .avatar-hero{width:100%;max-width:680px;display:flex;align-items:center;gap:24px;padding:28px 32px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:24px;margin-bottom:20px;position:relative;z-index:1;animation:fadeUp .4s ease both;}
        .avatar-circle{width:80px;height:80px;border-radius:50%;border:3px solid rgba(0,210,180,.35);overflow:hidden;background:#1a2030;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;}
        .avatar-circle img{width:100%;height:100%;object-fit:cover;}
        .avatar-info{flex:1;}
        .avatar-name{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.03em;margin-bottom:4px;}
        .avatar-role{font-size:14px;color:rgba(255,255,255,.4);margin-bottom:10px;}
        .portfolio-link-row{display:flex;align-items:center;gap:10px;}
        .portfolio-url{font-size:13px;color:rgba(0,210,180,.7);font-family:'DM Sans',sans-serif;}
        .copy-btn{padding:5px 14px;border-radius:8px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.25);color:#00d2b4;font-size:12px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .copy-btn:hover{background:rgba(0,210,180,.18);}
        .pulse-badge{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:12px;background:rgba(0,210,180,.08);border:1px solid rgba(0,210,180,.2);}
        .pulse-num{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#00d2b4;letter-spacing:-.04em;}
        .pulse-lbl{font-size:11px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.08em;}

        /* Tabs */
        .tabs-wrap{width:100%;max-width:680px;display:flex;gap:4px;margin-bottom:20px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:5px;position:relative;z-index:1;}
        .tab-btn{flex:1;padding:10px;border-radius:10px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,.35);cursor:pointer;transition:all .2s;}
        .tab-btn.active{background:rgba(0,210,180,.12);color:#00d2b4;border:1px solid rgba(0,210,180,.2);}
        .tab-btn:hover:not(.active){background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);}

        /* Card */
        .card{width:100%;max-width:680px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:32px;position:relative;z-index:1;animation:fadeUp .4s ease both;}
        .card-section{margin-bottom:28px;}
        .card-section:last-child{margin-bottom:0;}
        .section-label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
        .section-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.06);}

        /* Fields */
        .field{margin-bottom:16px;}
        .field label{display:block;font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:8px;}
        .field input,.field select,.field textarea{width:100%;padding:12px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;color:#fff;outline:none;transition:border-color .2s,background .2s;}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:rgba(0,210,180,.45);background:rgba(0,210,180,.04);}
        .field input::placeholder,.field textarea::placeholder{color:rgba(255,255,255,.18);}
        .field select option{background:#131928;color:#fff;}
        .field select{appearance:none;cursor:pointer;}
        .select-wrap{position:relative;}
        .select-wrap::after{content:'▾';position:absolute;right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);pointer-events:none;font-size:12px;}
        .prefix-wrap{position:relative;}
        .prefix-txt{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;color:rgba(255,255,255,.25);pointer-events:none;}
        .prefix-wrap input{padding-left:130px;}
        .row-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .field-hint{font-size:11px;color:rgba(255,255,255,.2);margin-top:5px;}

        /* Mentor toggle */
        .mentor-card{display:flex;align-items:center;gap:16px;padding:16px 20px;background:rgba(255,255,255,.03);border:1.5px solid rgba(255,255,255,.08);border-radius:14px;cursor:pointer;transition:all .2s;margin-bottom:20px;}
        .mentor-card.on{background:rgba(0,210,180,.06);border-color:rgba(0,210,180,.3);}
        .mentor-icon{width:42px;height:42px;border-radius:11px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
        .mentor-copy{flex:1;}
        .mentor-copy strong{display:block;font-size:14px;font-weight:500;color:rgba(255,255,255,.8);margin-bottom:2px;}
        .mentor-copy span{font-size:12px;color:rgba(255,255,255,.3);}
        .tog{width:42px;height:24px;border-radius:99px;background:rgba(255,255,255,.12);position:relative;flex-shrink:0;transition:background .2s;}
        .tog.on{background:linear-gradient(90deg,#00d2b4,#6366f1);}
        .tog::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .22s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 4px rgba(0,0,0,.3);}
        .tog.on::after{transform:translateX(18px);}

        /* Subjects */
        .subjects-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;}
        .subj-pill{padding:6px 14px;border-radius:99px;font-size:12px;cursor:pointer;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);background:transparent;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .subj-pill:hover{border-color:rgba(0,210,180,.35);color:rgba(255,255,255,.7);}
        .subj-pill.sel{background:rgba(0,210,180,.12);border-color:rgba(0,210,180,.5);color:#00d2b4;}
        .subj-count{font-size:11px;color:rgba(255,255,255,.25);margin-bottom:0;}

        /* Danger zone */
        .danger-card{padding:18px 20px;background:rgba(239,68,68,.05);border:1px solid rgba(239,68,68,.15);border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
        .danger-text strong{display:block;font-size:14px;font-weight:500;color:rgba(255,255,255,.7);margin-bottom:3px;}
        .danger-text span{font-size:12px;color:rgba(255,255,255,.3);}
        .danger-btn{padding:9px 18px;border-radius:10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#f87171;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all .18s;}
        .danger-btn:hover{background:rgba(239,68,68,.18);}

        /* Error / Success */
        .error-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:11px 14px;font-size:13px;color:#fca5a5;margin-bottom:16px;}
        .success-toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:12px 24px;background:rgba(0,210,180,.15);border:1px solid rgba(0,210,180,.4);border-radius:14px;font-size:14px;font-weight:500;color:#00d2b4;z-index:100;animation:popIn .3s ease both;backdrop-filter:blur(16px);}

        /* Save button */
        .save-row{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);}
        .btn-cancel{padding:11px 22px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:rgba(255,255,255,.4);cursor:pointer;transition:all .18s;}
        .btn-cancel:hover{background:rgba(255,255,255,.09);}
        .btn-save{padding:11px 28px;border-radius:11px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#fff;cursor:pointer;transition:opacity .18s,transform .18s;display:flex;align-items:center;gap:8px;}
        .btn-save:hover:not(:disabled){opacity:.88;transform:translateY(-1px);}
        .btn-save:disabled{opacity:.5;cursor:not-allowed;}
        .spinner{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:spin .7s linear infinite;}

        /* Light theme alignment with rest of site */
        .root{background:var(--app-bg-gradient) !important;}
        .topbar .page-title{color:#0f3460 !important;}
        .back-btn{background:rgba(255,255,255,.8) !important;border:1px solid rgba(67,96,151,.2) !important;color:#1f3260 !important;}
        .back-btn:hover{background:#ffffff !important;color:#0f3460 !important;}
        .avatar-hero,.tabs-wrap,.card{background:rgba(255,255,255,.88) !important;border:1px solid rgba(67,96,151,.18) !important;box-shadow:0 12px 30px rgba(35,62,109,.08);}
        .avatar-name{color:#0f3460 !important;}
        .avatar-role,.portfolio-url,.pulse-lbl{color:#2e4563 !important;}
        .tab-btn{color:#2e4563 !important;font-weight:600;}
        .tab-btn.active{background:rgba(0,210,180,.12) !important;color:#00bfa5 !important;border:1px solid rgba(0,210,180,.26) !important;}
        .section-label{color:#1b2d4d !important;}
        .section-label::after{background:rgba(67,96,151,.18) !important;}
        .field label,.field-hint,.subj-count{color:#2e4563 !important;}
        .field input,.field select,.field textarea{background:#ffffff !important;border:1px solid rgba(67,96,151,.24) !important;color:#0f3460 !important;}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:rgba(0,210,180,.55) !important;background:#ffffff !important;box-shadow:0 0 0 3px rgba(0,210,180,.1);}
        .field input::placeholder,.field textarea::placeholder,.prefix-txt{color:#4a6fa0 !important;}
        .field select option{background:#ffffff !important;color:#0f3460 !important;}
        .select-wrap::after{color:#2e4563 !important;}
        .mentor-card{background:rgba(255,255,255,.8) !important;border:1px solid rgba(67,96,151,.18) !important;}
        .mentor-copy strong{color:#0f3460 !important;}
        .mentor-copy span{color:#2e4563 !important;}
        .subj-pill{background:#f8fbff !important;border:1px solid rgba(67,96,151,.2) !important;color:#1f3260 !important;}
        .subj-pill.sel{background:rgba(0,210,180,.12) !important;border-color:rgba(0,210,180,.5) !important;color:#00bfa5 !important;}
        .danger-card{background:#fff7f7 !important;border:1px solid rgba(239,68,68,.24) !important;}
        .danger-text strong{color:#b42318 !important;}
        .danger-text span{color:#c2410c !important;}
        .error-box{background:#ffe6e6 !important;border:1.5px solid #ff6b6b !important;color:#c92a2a !important;}
        .save-row{border-top:1px solid rgba(67,96,151,.16) !important;}
        .btn-cancel{background:rgba(67,96,151,.08) !important;border:1px solid rgba(67,96,151,.22) !important;color:#1f3260 !important;}
        .btn-cancel:hover{background:rgba(67,96,151,.16) !important;}
        .success-toast{background:#e6f9f7 !important;border:1px solid #1ab394 !important;color:#0a6c5e !important;}

        @media(max-width:600px){.row-2{grid-template-columns:1fr;}.avatar-hero{flex-direction:column;align-items:flex-start;}.card{padding:22px 16px;}}
      `}</style>

      <div className="root">
        <div className="bg-grid" /><div className="bg-glow g1" /><div className="bg-glow g2" />

        {/* Topbar */}
        <div className="topbar">
          <a href="/dashboard" className="back-btn">← Dashboard</a>
          <div className="page-title">My Profile</div>
          <div style={{width:100}} />
        </div>

        {/* Avatar Hero */}
        <div className="avatar-hero">
          <div className="avatar-circle">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="avatar" /> : "👤"}
          </div>
          <div className="avatar-info">
            <div className="avatar-name">{profile?.display_name || "Your Name"}</div>
            <div className="avatar-role">{profile?.job_role || "Student"} · {profile?.university || "University"}</div>
            <div className="portfolio-link-row">
              <span className="portfolio-url">uniflow.lk/p/{profile?.username}</span>
              <button className="copy-btn" onClick={copyPortfolioLink}>
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
              <a href={`/p/${profile?.username}`} target="_blank" style={{fontSize:12,color:"#00bfa5",textDecoration:"none",fontWeight:600}}>
                View →
              </a>
            </div>
          </div>
          <div className="pulse-badge">
            <div>
              <div className="pulse-num">{profile?.pulse_score ?? 0}</div>
              <div className="pulse-lbl">Pulse Score</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-wrap">
          {[
            { id:"info", icon:"👤", label:"Personal Info" },
            { id:"mentor", icon:"🎓", label:"Mentor & Skills" },
            { id:"account", icon:"⚙️", label:"Account" },
          ].map(t => (
            <button key={t.id} className={`tab-btn ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id as any)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="card">

          {/* ── TAB 1: Personal Info ── */}
          {activeTab === "info" && (
            <>
              <div className="card-section">
                <div className="section-label">Basic Info</div>
                <div className="field">
                  <label>Display Name</label>
                  <input type="text" placeholder="Your full name" value={profile?.display_name || ""} onChange={e=>set("display_name",e.target.value)} />
                </div>
                <div className="field">
                  <label>Username · Public Portfolio URL</label>
                  <div className="prefix-wrap">
                    <span className="prefix-txt">uniflow.lk/p/</span>
                    <input type="text" placeholder="your_username" value={profile?.username || ""} onChange={e=>set("username",e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} />
                  </div>
                  <div className="field-hint">3–20 chars · lowercase letters, numbers, underscores</div>
                </div>
              </div>

              <div className="card-section">
                <div className="section-label">Academic Info</div>
                <div className="field">
                  <label>University / Institute</label>
                  <input type="text" placeholder="e.g. University of Moratuwa" value={profile?.university || ""} onChange={e=>set("university",e.target.value)} />
                </div>
                <div className="row-2">
                  <div className="field">
                    <label>Year of Study</label>
                    <div className="select-wrap">
                      <select value={profile?.year_of_study || ""} onChange={e=>set("year_of_study",e.target.value)}>
                        <option value="">Select year…</option>
                        {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Target Job Role</label>
                    <div className="select-wrap">
                      <select value={profile?.job_role || ""} onChange={e=>set("job_role",e.target.value)}>
                        <option value="">Select role…</option>
                        {JOB_ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── TAB 2: Mentor & Skills ── */}
          {activeTab === "mentor" && (
            <>
              <div className="card-section">
                <div className="section-label">Mentor Mode</div>
                <div className={`mentor-card ${profile?.is_mentor?"on":""}`} onClick={()=>set("is_mentor",!profile?.is_mentor)}>
                  <div className="mentor-icon">🎓</div>
                  <div className="mentor-copy">
                    <strong>Available to Mentor</strong>
                    <span>{profile?.is_mentor ? "You are visible to peers who need help" : "Turn on to help peers and earn Community Impact points"}</span>
                  </div>
                  <div className={`tog ${profile?.is_mentor?"on":""}`} />
                </div>

                {profile?.is_mentor && (
                  <div style={{padding:"14px 16px",background:"rgba(0,210,180,.05)",borderRadius:12,border:"1px solid rgba(0,210,180,.12)",marginBottom:20}}>
                    <div style={{fontSize:12,color:"#00bfa5",fontWeight:600,marginBottom:4}}>Mentor mode is ON</div>
                    <div style={{fontSize:12,color:"#2e4563"}}>Peers can now find and request sessions with you. Each successful session adds to your Pulse Score.</div>
                  </div>
                )}
              </div>

              <div className="card-section">
                <div className="section-label">Strong Subjects</div>
                <div style={{fontSize:13,color:"#2e4563",marginBottom:14}}>
                  Select up to 5 subjects you're confident in. These appear on your public portfolio.
                </div>
                <div className="subjects-grid">
                  {SUBJECTS.map(s=>(
                    <button key={s} className={`subj-pill ${(profile?.mentor_subjects||[]).includes(s)?"sel":""}`} onClick={()=>toggleSubject(s)}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="subj-count">{(profile?.mentor_subjects||[]).length}/5 selected</div>
              </div>
            </>
          )}

          {/* ── TAB 3: Account ── */}
          {activeTab === "account" && (
            <>
              <div className="card-section">
                <div className="section-label">Account Details</div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" value={profile?.email || ""} disabled style={{opacity:.5,cursor:"not-allowed"}} />
                  <div className="field-hint">Email cannot be changed. It is linked to your Google account.</div>
                </div>
                <div style={{padding:"14px 16px",background:"rgba(67,96,151,.06)",borderRadius:12,border:"1px solid rgba(67,96,151,.18)",marginBottom:8}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#1f3260",marginBottom:4}}>Pulse Score</div>
                  <div style={{fontSize:28,fontWeight:800,fontFamily:"'Syne',sans-serif",color:"#00d2b4",letterSpacing:"-.04em"}}>{profile?.pulse_score ?? 0}<span style={{fontSize:14,color:"#2e4563",fontFamily:"'DM Sans',sans-serif",fontWeight:500,marginLeft:6}}>/ 100</span></div>
                  <div style={{fontSize:12,color:"#2e4563",marginTop:4}}>Complete KPIs, submit projects, and mentor peers to increase your score.</div>
                </div>
              </div>

              <div className="card-section">
                <div className="section-label">Portfolio</div>
                <div style={{padding:"16px 20px",background:"rgba(67,96,151,.06)",borderRadius:14,border:"1px solid rgba(67,96,151,.18)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1f3260",marginBottom:4}}>Your public portfolio</div>
                    <div style={{fontSize:13,color:"#00bfa5",fontFamily:"'DM Sans',sans-serif"}}>uniflow.lk/p/{profile?.username}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="copy-btn" onClick={copyPortfolioLink}>{copied?"✓ Copied!":"Copy Link"}</button>
                    <a href={`/p/${profile?.username}`} target="_blank" style={{padding:"5px 14px",borderRadius:8,background:"rgba(67,96,151,.1)",border:"1px solid rgba(67,96,151,.2)",color:"#1f3260",fontSize:12,fontWeight:600,textDecoration:"none"}}>View →</a>
                  </div>
                </div>
              </div>

              <div className="card-section">
                <div className="section-label">Danger Zone</div>
                <div className="danger-card">
                  <div className="danger-text">
                    <strong>Sign out of UniFlow</strong>
                    <span>You will be redirected to the login page.</span>
                  </div>
                  <button className="danger-btn" onClick={async()=>{await supabase.auth.signOut();router.push("/login");}}>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && <div className="error-box">{error}</div>}

          {/* Save row — hidden on account tab */}
          {activeTab !== "account" && (
            <div className="save-row">
              <button className="btn-cancel" onClick={()=>router.push("/dashboard")}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner"/>Saving…</> : "Save Changes ✓"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="success-toast">
          ✓ Profile updated successfully!
        </div>
      )}
    </>
  );
}