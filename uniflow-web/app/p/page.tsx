"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  is_mentor: boolean;
  job_role: string;
  pulse_score: number;
  mentor_subjects: string[];
  university?: string;
  year_of_study?: string;
};

type Submission = {
  id: string;
  module_id: string;
  github_url: string;
  live_url?: string;
  screenshot_url: string;
  reflection: string;
  challenges?: string;
  learned?: string;
  created_at: string;
};

const MOCK_BADGES = [
  { label: "Database Architect", icon: "🗄️" },
  { label: "API Builder", icon: "⚡" },
  { label: "Community Helper", icon: "🤝" },
];

function PulseArc({ score }: { score: number }) {
  const size = 160;
  const sw = 8;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(score), 400); return () => clearTimeout(t); }, [score]);
  const dash = (anim / 100) * circ;
  const color = score < 30 ? "#f59e0b" : score < 60 ? "#3b82f6" : "#00d2b4";
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)", filter:`drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:30, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#fff", letterSpacing:"-.04em", lineHeight:1 }}>{anim}</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,.3)", letterSpacing:".1em", textTransform:"uppercase", marginTop:3 }}>Pulse</div>
      </div>
    </div>
  );
}

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params?.username as string;
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects"|"about">("projects");

  useEffect(() => {
    if (!username) return;
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (!prof) { setNotFound(true); setLoading(false); return; }
      setProfile(prof);

      const { data: subs } = await supabase
        .from("project_submissions")
        .select("*")
        .eq("user_id", prof.id)
        .order("created_at", { ascending: false });

      setSubmissions(subs || []);
      setLoading(false);
    })();
  }, [username]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const score = profile?.pulse_score ?? 0;
  const scoreLabel = score < 30 ? "Starting Out" : score < 60 ? "Growing" : score < 80 ? "Strong" : "Elite";
  const scoreColor = score < 30 ? "#f59e0b" : score < 60 ? "#3b82f6" : "#00d2b4";

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"var(--app-bg-gradient)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid rgba(0,210,180,.2)", borderTopColor:"#00d2b4", animation:"spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (notFound) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ minHeight:"100vh", background:"var(--app-bg-gradient)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", gap:16 }}>
        <div style={{ fontSize:56 }}>🔍</div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#fff" }}>Portfolio not found</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,.35)" }}>No student with the username <strong style={{color:"rgba(255,255,255,.6)"}}>@{username}</strong> exists.</p>
        <a href="/" style={{ marginTop:8, padding:"10px 22px", borderRadius:10, background:"rgba(0,210,180,.1)", border:"1px solid rgba(0,210,180,.25)", color:"#00d2b4", fontSize:14, textDecoration:"none" }}>← Back to UniFlow</a>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

        body{background:var(--app-bg-gradient);}
        .root{min-height:100vh;background:var(--app-bg-gradient);font-family:'DM Sans',sans-serif;color:#fff;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px);background-size:48px 48px;z-index:0;}
        .bg-glow{position:fixed;pointer-events:none;border-radius:50%;filter:blur(120px);z-index:0;}
        .g1{width:600px;height:600px;background:radial-gradient(circle,rgba(0,210,180,.10) 0%,transparent 70%);top:-200px;right:-100px;}
        .g2{width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,.09) 0%,transparent 70%);bottom:-100px;left:-100px;}

        /* Nav */
        .nav{position:sticky;top:0;z-index:10;backdrop-filter:blur(20px);background:rgba(8,12,20,.8);border-bottom:1px solid rgba(255,255,255,.06);padding:0 32px;height:56px;display:flex;align-items:center;justify-content:space-between;}
        .nav-logo{display:flex;align-items:center;gap:8px;text-decoration:none;}
        .logo-mark{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,#00d2b4,#6366f1);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:12px;color:#fff;}
        .logo-name{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;color:#fff;}
        .logo-name span{color:#00d2b4;}
        .nav-right{display:flex;align-items:center;gap:10px;}
        .share-btn{display:flex;align-items:center;gap:7px;padding:7px 16px;border-radius:9px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.25);color:#00d2b4;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .share-btn:hover{background:rgba(0,210,180,.18);}
        .verified-chip{padding:5px 12px;border-radius:99px;background:rgba(0,210,180,.08);border:1px solid rgba(0,210,180,.2);font-size:11px;font-weight:600;color:#00d2b4;letter-spacing:.05em;}

        /* Hero */
        .hero{max-width:900px;margin:0 auto;padding:56px 32px 40px;display:flex;align-items:flex-start;gap:40px;position:relative;z-index:1;animation:fadeUp .5s ease both;}
        .hero-avatar{width:96px;height:96px;border-radius:50%;border:3px solid rgba(0,210,180,.35);overflow:hidden;background:#1a2030;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:36px;}
        .hero-avatar img{width:100%;height:100%;object-fit:cover;}
        .hero-info{flex:1;}
        .hero-name{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:#fff;letter-spacing:-.04em;margin-bottom:4px;}
        .hero-role{font-size:15px;color:rgba(255,255,255,.4);margin-bottom:12px;}
        .hero-meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;}
        .meta-chip{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);font-size:12px;color:rgba(255,255,255,.45);}
        .mentor-badge{background:rgba(0,210,180,.08);border-color:rgba(0,210,180,.2);color:#00d2b4;}
        .hero-pulse{flex-shrink:0;}

        /* Tabs */
        .tabs-wrap{max-width:900px;margin:0 auto;padding:0 32px;position:relative;z-index:1;border-bottom:1px solid rgba(255,255,255,.07);}
        .tabs{display:flex;gap:0;}
        .tab{padding:14px 20px;font-size:14px;font-weight:500;color:rgba(255,255,255,.3);cursor:pointer;border-bottom:2px solid transparent;transition:all .18s;margin-bottom:-1px;}
        .tab:hover{color:rgba(255,255,255,.6);}
        .tab.active{color:#fff;border-bottom-color:#00d2b4;}

        /* Content */
        .content{max-width:900px;margin:0 auto;padding:36px 32px 64px;position:relative;z-index:1;}

        /* Projects grid */
        .projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}
        .project-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:18px;overflow:hidden;transition:border-color .18s,transform .18s;animation:fadeUp .4s ease both;}
        .project-card:hover{border-color:rgba(0,210,180,.25);transform:translateY(-3px);}
        .project-img{width:100%;height:160px;object-fit:cover;background:rgba(255,255,255,.03);}
        .project-img-placeholder{width:100%;height:160px;background:linear-gradient(135deg,rgba(0,210,180,.07),rgba(99,102,241,.07));display:flex;align-items:center;justify-content:center;font-size:40px;}
        .project-body{padding:18px;}
        .project-subject{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(0,210,180,.7);margin-bottom:6px;}
        .project-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3;}
        .project-reflection{font-size:13px;color:rgba(255,255,255,.35);line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
        .project-links{display:flex;gap:8px;}
        .proj-link{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);font-size:12px;color:rgba(255,255,255,.5);text-decoration:none;transition:all .18s;}
        .proj-link:hover{background:rgba(255,255,255,.09);color:rgba(255,255,255,.8);}
        .proj-link.github{background:rgba(0,210,180,.08);border-color:rgba(0,210,180,.2);color:#00d2b4;}

        /* Empty state */
        .empty{text-align:center;padding:60px 20px;}
        .empty-icon{font-size:48px;margin-bottom:16px;opacity:.4;}
        .empty-text{font-size:14px;color:rgba(255,255,255,.25);}

        /* Badges */
        .badges-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:32px;}
        .badge{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;background:rgba(0,210,180,.07);border:1px solid rgba(0,210,180,.18);}
        .badge-icon{font-size:18px;}
        .badge-label{font-size:13px;font-weight:500;color:rgba(255,255,255,.6);}
        .badge-verified{font-size:10px;color:#00d2b4;font-weight:600;letter-spacing:.05em;}

        /* About */
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        .about-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px;}
        .about-card-title{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:14px;}
        .pillar-row{display:flex;flex-direction:column;gap:12px;}
        .pillar-item{display:flex;flex-direction:column;gap:5px;}
        .pillar-meta{display:flex;justify-content:space-between;font-size:12px;}
        .pillar-name{color:rgba(255,255,255,.4);}
        .pillar-val{font-weight:600;color:rgba(255,255,255,.6);}
        .pillar-bar{height:5px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;}
        .pillar-fill{height:100%;border-radius:99px;}
        .subj-list{display:flex;flex-wrap:wrap;gap:7px;}
        .subj-tag{padding:5px 12px;border-radius:99px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);font-size:12px;color:rgba(165,168,255,.7);}

        /* Footer */
        .port-footer{max-width:900px;margin:0 auto;padding:24px 32px;border-top:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;}
        .port-footer-text{font-size:12px;color:rgba(255,255,255,.2);}
        .port-footer-text a{color:rgba(0,210,180,.5);text-decoration:none;}

        @media(max-width:640px){
          .hero{flex-direction:column;gap:24px;padding:32px 20px 28px;}
          .hero-pulse{align-self:flex-start;}
          .content{padding:24px 20px 48px;}
          .about-grid{grid-template-columns:1fr;}
          .tabs-wrap{padding:0 20px;}
          .nav{padding:0 20px;}
        }
      `}</style>

      <div className="root">
        <div className="bg-grid" /><div className="bg-glow g1" /><div className="bg-glow g2" />

        {/* Nav */}
        <nav className="nav">
          <a href="/" className="nav-logo">
            <div className="logo-mark">U</div>
            <div className="logo-name">Uni<span>Flow</span></div>
          </a>
          <div className="nav-right">
            <span className="verified-chip">✓ Verified Portfolio</span>
            <button className="share-btn" onClick={copyLink}>
              {copied ? "✓ Copied!" : "🔗 Share"}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="hero">
          <div className="hero-avatar">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={profile.display_name} />
              : "👤"}
          </div>
          <div className="hero-info">
            <h1 className="hero-name">{profile?.display_name}</h1>
            <div className="hero-role">{profile?.job_role || "Student"}</div>
            <div className="hero-meta">
              <span className="meta-chip">@{profile?.username}</span>
              {profile?.university && <span className="meta-chip">🎓 {profile.university}</span>}
              {profile?.year_of_study && <span className="meta-chip">📅 {profile.year_of_study}</span>}
              {profile?.is_mentor && <span className="meta-chip mentor-badge">🎓 Available to Mentor</span>}
            </div>
            {/* Badges row */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {MOCK_BADGES.map((b,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:99, background:"rgba(0,210,180,.08)", border:"1px solid rgba(0,210,180,.18)", fontSize:12, color:"rgba(255,255,255,.55)" }}>
                  <span>{b.icon}</span><span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-pulse">
            <PulseArc score={score} />
            <div style={{ textAlign:"center", marginTop:8 }}>
              <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99, background:`${scoreColor}22`, border:`1px solid ${scoreColor}44`, color:scoreColor, fontWeight:600, letterSpacing:".05em" }}>
                {scoreLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-wrap">
          <div className="tabs">
            <div className={`tab ${activeTab==="projects"?"active":""}`} onClick={()=>setActiveTab("projects")}>
              📁 Projects ({submissions.length})
            </div>
            <div className={`tab ${activeTab==="about"?"active":""}`} onClick={()=>setActiveTab("about")}>
              📊 About & Score
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">

          {activeTab === "projects" && (
            submissions.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📂</div>
                <div className="empty-text">No project submissions yet.</div>
              </div>
            ) : (
              <div className="projects-grid">
                {submissions.map((s, i) => (
                  <div key={s.id} className="project-card" style={{ animationDelay:`${i*0.07}s` }}>
                    {s.screenshot_url
                      ? <img src={s.screenshot_url} className="project-img" alt="screenshot" />
                      : <div className="project-img-placeholder">🖼️</div>}
                    <div className="project-body">
                      <div className="project-subject">{s.module_id}</div>
                      <div className="project-title">Project Evidence</div>
                      <div className="project-reflection">{s.reflection}</div>
                      <div className="project-links">
                        <a href={s.github_url} target="_blank" rel="noreferrer" className="proj-link github">
                          <span>⚡</span> GitHub
                        </a>
                        {s.live_url && (
                          <a href={s.live_url} target="_blank" rel="noreferrer" className="proj-link">
                            <span>🔗</span> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === "about" && (
            <>
              {/* Score pillars */}
              <div className="about-grid" style={{ marginBottom:24 }}>
                <div className="about-card">
                  <div className="about-card-title">Pulse Score Breakdown</div>
                  <div className="pillar-row">
                    {[
                      { label:"Academic Mastery", val:Math.min(100,Math.round(score*0.3*3.33)), color:"#00d2b4", weight:"30%" },
                      { label:"Practical Projects", val:Math.min(100,Math.round(score*0.4*2.5)), color:"#6366f1", weight:"40%" },
                      { label:"Community Impact", val:Math.min(100,Math.round(score*0.3*3.33)), color:"#f59e0b", weight:"30%" },
                    ].map(p => (
                      <div key={p.label} className="pillar-item">
                        <div className="pillar-meta">
                          <span className="pillar-name">{p.label} <span style={{color:"rgba(255,255,255,.2)",fontSize:10}}>({p.weight})</span></span>
                          <span className="pillar-val">{p.val}%</span>
                        </div>
                        <div className="pillar-bar">
                          <div className="pillar-fill" style={{ width:`${p.val}%`, background:p.color, boxShadow:`0 0 8px ${p.color}66` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="about-card">
                  <div className="about-card-title">Verified Badges</div>
                  <div className="badges-row" style={{ marginBottom:0 }}>
                    {MOCK_BADGES.map((b,i) => (
                      <div key={i} className="badge">
                        <span className="badge-icon">{b.icon}</span>
                        <div>
                          <div className="badge-label">{b.label}</div>
                          <div className="badge-verified">VERIFIED ✓</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mentor subjects */}
              {profile?.is_mentor && (profile?.mentor_subjects ?? []).length > 0 && (
                <div className="about-card" style={{ marginBottom:24 }}>
                  <div className="about-card-title">Available to Mentor In</div>
                  <div className="subj-list">
                    {profile.mentor_subjects.map(s => (
                      <span key={s} className="subj-tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="port-footer">
          <div className="port-footer-text">
            Powered by <a href="/">UniFlow</a> · Verified evidence-based portfolio
          </div>
          <div className="port-footer-text">
            uniflow.lk/p/{profile?.username}
          </div>
        </div>
      </div>
    </>
  );
}