"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Profile = {
  display_name: string;
  username: string;
  is_mentor: boolean;
  job_role: string;
  pulse_score: number;
  mentor_subjects: string[];
  learning_subjects: string[];
  academic_year: string;
  specialization: string;
};

type Activity = { label: string; time: string; points: number; icon: string };

const MOCK_ACTIVITIES: Activity[] = [
  { label: "Completed KPI: Arrays & Sorting", time: "2h ago", points: 8, icon: "📘" },
  { label: "Submitted Project: REST API", time: "Yesterday", points: 15, icon: "🔗" },
  { label: "Mentored: Database Design", time: "2d ago", points: 10, icon: "🎓" },
  { label: "Completed KPI: SQL Joins", time: "3d ago", points: 6, icon: "📘" },
];

const MOCK_BADGES = [
  { label: "Database Architect", icon: "🗄️", earned: true },
  { label: "API Builder", icon: "⚡", earned: true },
  { label: "Community Helper", icon: "🤝", earned: true },
  { label: "Full Stack Dev", icon: "🚀", earned: false },
  { label: "ML Explorer", icon: "🧠", earned: false },
];

// Pulse ring SVG component
function PulseRing({ score }: { score: number }) {
  const size = 200;
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
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
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        {/* Glow layer */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth + 4}
          strokeDasharray={`${animDash} ${circ}`}
          strokeLinecap="round"
          style={{ opacity: 0.15, transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
        {/* Main arc */}
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${animDash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      {/* Center content */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize: 42, fontWeight: 800, fontFamily:"'Inter',sans-serif", color: "#fff", letterSpacing: "-0.04em", lineHeight:1 }}>
          {animated}
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform:"uppercase", marginTop: 4 }}>
          Pulse
        </div>
        <div style={{ marginTop: 8, padding: "3px 10px", borderRadius: 99, background: `${color}22`, border: `1px solid ${color}55`, fontSize: 11, fontWeight: 600, color: color, letterSpacing:"0.05em" }}>
          {score < 30 ? "STARTING" : score < 60 ? "GROWING" : score < 80 ? "STRONG" : "ELITE"}
        </div>
      </div>
    </div>
  );
}

// Pillar bar
function PillarBar({ label, value, color, icon }: { label:string; value:number; color:string; icon:string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(()=>setW(value),400); return ()=>clearTimeout(t); }, [value]);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 6 }}>
        <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 13, color:"rgba(255,255,255,0.5)", fontWeight:400 }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:99, background: color, width:`${w}%`, transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 10px ${color}88` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mentorUpdating, setMentorUpdating] = useState(false);
  const [mentorError, setMentorError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      if (user) {
        setAvatarUrl(user.user_metadata?.avatar_url ?? "");
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) {
          setProfile(data);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleMentor = async () => {
    if (mentorUpdating) return;
    setMentorError(null);
    setMentorUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMentorError("Please sign in again to enable mentor mode.");
        return;
      }

      const previous = profile;
      const next = !(profile?.is_mentor ?? false);
      setProfile((p) =>
        p
          ? { ...p, is_mentor: next }
          : {
              display_name: user.user_metadata?.display_name ?? "Member",
              username: user.user_metadata?.username ?? user.email?.split("@")[0] ?? "member",
              is_mentor: next,
              job_role: "Student",
              pulse_score: 0,
              mentor_subjects: [],
              learning_subjects: [],
              academic_year: "",
              specialization: "",
            }
      );

      const payload = {
        id: user.id,
        is_mentor: next,
        display_name: previous?.display_name ?? user.user_metadata?.display_name ?? "Member",
        username: previous?.username ?? user.user_metadata?.username ?? user.email?.split("@")[0] ?? `member-${user.id.slice(0, 8)}`,
        mentor_subjects: previous?.mentor_subjects ?? [],
        job_role: previous?.job_role ?? "Student",
        pulse_score: previous?.pulse_score ?? 0,
      };

      const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (error) {
        // Revert optimistic toggle when persistence fails.
        setProfile(previous);
        setMentorError(error.message || "Could not update mentor mode.");
      }
    } catch {
      setMentorError("Could not update mentor mode right now.");
    } finally {
      setMentorUpdating(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48, height:48, borderRadius:"50%", border:"3px solid rgba(0,210,180,0.2)", borderTopColor:"#00d2b4", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>Loading your dashboard…</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const score = profile?.pulse_score ?? 0;
  const mastery = Math.min(100, Math.round(score * 0.3 * 3.33));
  const projects = Math.min(100, Math.round(score * 0.4 * 2.5));
  const community = Math.min(100, Math.round(score * 0.3 * 3.33));

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setSidebarOpen(false);
    const navigateShell = (href: string) => {
      if (typeof window !== "undefined" && window.location.pathname === href) {
        return;
      }
      // Sidebar menu is app-shell navigation; replace avoids back-stack bloat.
      router.replace(href);
    };

    if      (id === "dashboard")                          navigateShell("/dashboard");
    else if (id === "sync")                               navigateShell("/learning");
    else if (id === "projects")                           navigateShell("/projects");
    else if (id === "networking")                         navigateShell("/networking");
    else if (id === "portfolio" && profile?.username)     router.push(`/p/${profile.username}`);
    else if (id === "evidence")                           navigateShell("/evidance");
    else if (id === "pulse" && profile?.username)         router.push(`/pulse/${profile.username}`);
    else if (id === "profile")                            navigateShell("/profile-setup");
  };

  const navItems = [
    { id: "dashboard",  icon: "⚡", label: "Dashboard",       hasChildren: false },
    { id: "sync",       icon: "📚", label: "Learning",        hasChildren: true  },
    { id: "projects",   icon: "🛠️", label: "Projects",        hasChildren: false },
    { id: "networking", icon: "🌐", label: "Community",       hasChildren: false },
    { id: "portfolio",  icon: "🔗", label: "Portfolio",       hasChildren: false },
    { id: "evidence",   icon: "📁", label: "Submit Evidence", hasChildren: false },
    { id: "pulse",      icon: "📊", label: "Pulse Details",   hasChildren: false },
    { id: "profile",    icon: "👤", label: "Profile",         hasChildren: false },
  ];

  const navSubItems: Record<string, { id: string; label: string; href: string }[]> = {
    sync: [
      { id: "module-insights", label: "Module Insights", href: "/learning" },
      { id: "sync-files", label: "Sync Files", href: "/sync" },
    ],
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#080c14;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%,100%{opacity:1}50%{opacity:.5}}
        .dash-root{min-height:100vh;background:#080c14;display:flex;font-family:'DM Sans',sans-serif;position:relative;overflow-x:hidden;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px);background-size:48px 48px;z-index:0;}
        .bg-glow{position:fixed;pointer-events:none;border-radius:50%;filter:blur(120px);z-index:0;}
        .g1{width:600px;height:600px;background:radial-gradient(circle,rgba(0,210,180,.10) 0%,transparent 70%);top:-200px;left:-100px;}
        .g2{width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%);bottom:-150px;right:-100px;}

        /* Sidebar */
        .sidebar{width:240px;flex-shrink:0;background:rgba(255,255,255,.02);border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;padding:28px 16px;position:fixed;top:0;left:0;height:100vh;z-index:10;transition:transform .3s;}
        .sidebar-logo{display:flex;align-items:center;gap:10px;padding:0 8px;margin-bottom:40px;}
        .logo-mark{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#00d2b4,#6366f1);display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-weight:800;font-size:14px;color:#fff;flex-shrink:0;}
        .logo-name{font-family:'Inter',sans-serif;font-weight:700;font-size:17px;color:#fff;}
        .logo-name span{color:#00d2b4;}
        .nav-section-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.2);padding:0 12px;margin-bottom:8px;}
        .nav-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:14px;color:rgba(255,255,255,.4);transition:all .18s;margin-bottom:2px;border:1px solid transparent;}
        .nav-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);}
        .nav-item.active{background:rgba(0,210,180,.1);border-color:rgba(0,210,180,.2);color:#00d2b4;}
        .nav-icon{width:20px;text-align:center;font-size:15px;}
        .sidebar-bottom{margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);}
        .profile-btn:hover{background:rgba(0,210,180,.08)!important;border-color:rgba(0,210,180,.2)!important;}
        .signout-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:rgba(255,255,255,.25);transition:all .18s;width:100%;background:none;border:none;font-family:'DM Sans',sans-serif;}
        .signout-btn:hover{background:rgba(239,68,68,.08);color:#f87171;}

        /* Main */
        .main{flex:1;margin-left:240px;padding:32px 32px 48px;position:relative;z-index:1;}
        .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;}
        .topbar-left h1{font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.03em;}
        .topbar-left p{font-size:13px;color:rgba(255,255,255,.3);margin-top:2px;}
        .topbar-right{display:flex;align-items:center;gap:12px;}
        .portfolio-btn{display:flex;align-items:center;gap:8px;padding:9px 18px;border-radius:10px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.25);color:#00d2b4;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .portfolio-btn:hover{background:rgba(0,210,180,.18);}
        .avatar-btn{width:36px;height:36px;border-radius:50%;border:2px solid rgba(0,210,180,.3);overflow:hidden;cursor:pointer;background:#1a2030;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .avatar-btn img{width:100%;height:100%;object-fit:cover;}

        /* Grid */
        .grid-top{display:grid;grid-template-columns:auto 1fr 1fr;gap:20px;margin-bottom:20px;align-items:start;}
        .grid-bottom{display:grid;grid-template-columns:1fr 1fr;gap:20px;}

        /* Cards */
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:24px;animation:fadeUp .5s ease both;}
        .card-title{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;}

        /* Pulse card */
        .pulse-card{display:flex;flex-direction:column;align-items:center;gap:20px;min-width:264px;}
        .pulse-ring-wrap{position:relative;}
        .pulse-label-row{display:flex;gap:16px;}
        .pulse-pill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:99px;padding:5px 12px;}
        .pulse-pill-dot{width:7px;height:7px;border-radius:50%;}
        .pulse-pill-text{font-size:12px;color:rgba(255,255,255,.4);}
        .pulse-pill-val{font-size:12px;font-weight:600;color:rgba(255,255,255,.7);}

        /* Pillar card */
        .pillar-card{}

        /* Mentor card */
        .mentor-card{}
        .mentor-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;cursor:pointer;transition:all .2s;margin-bottom:16px;width:100%;text-align:left;font-family:'DM Sans',sans-serif;color:inherit;}
        .mentor-toggle-row.on{background:rgba(0,210,180,.07);border-color:rgba(0,210,180,.25);}
        .mentor-toggle-row.busy{opacity:.75;pointer-events:none;}
        .mentor-label strong{display:block;font-size:14px;font-weight:500;color:rgba(255,255,255,.8);}
        .mentor-label span{font-size:12px;color:rgba(255,255,255,.3);}
        .toggle{width:40px;height:22px;border-radius:99px;background:rgba(255,255,255,.1);position:relative;flex-shrink:0;transition:background .2s;}
        .toggle.on{background:linear-gradient(90deg,#00d2b4,#6366f1);}
        .toggle::after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .22s;box-shadow:0 1px 4px rgba(0,0,0,.3);}
        .toggle.on::after{transform:translateX(18px);}
        .subjects-wrap{display:flex;flex-wrap:wrap;gap:6px;}
        .subj-tag{padding:4px 10px;border-radius:99px;font-size:11px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.25);color:rgba(165,168,255,.8);}

        /* Activity */
        .activity-list{display:flex;flex-direction:column;gap:10px;}
        .activity-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:12px;transition:background .18s;}
        .activity-item:hover{background:rgba(255,255,255,.045);}
        .act-icon{width:34px;height:34px;border-radius:9px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.15);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
        .act-label{font-size:13px;color:rgba(255,255,255,.65);flex:1;}
        .act-time{font-size:11px;color:rgba(255,255,255,.25);}
        .act-pts{font-size:12px;font-weight:600;color:#00d2b4;background:rgba(0,210,180,.1);padding:2px 8px;border-radius:99px;}

        /* Badges */
        .badges-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:10px;}
        .badge-item{display:flex;flex-direction:column;align-items:center;gap:7px;padding:14px 8px;border-radius:14px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);transition:all .18s;cursor:default;}
        .badge-item.earned{background:rgba(0,210,180,.06);border-color:rgba(0,210,180,.2);}
        .badge-item:hover.earned{background:rgba(0,210,180,.1);}
        .badge-icon{font-size:22px;filter:grayscale(0);}
        .badge-item:not(.earned) .badge-icon{filter:grayscale(1);opacity:.3;}
        .badge-label{font-size:10px;font-weight:500;color:rgba(255,255,255,.35);text-align:center;line-height:1.3;}
        .badge-item.earned .badge-label{color:rgba(255,255,255,.6);}
        .badge-lock{font-size:10px;color:rgba(255,255,255,.15);}

        /* Submit evidence CTA */
        .cta-card{background:linear-gradient(135deg,rgba(0,210,180,.1),rgba(99,102,241,.1));border:1px solid rgba(0,210,180,.2);border-radius:20px;padding:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;animation:fadeUp .5s ease both;}
        .cta-text h3{font-family:'Inter',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:4px;}
        .cta-text p{font-size:13px;color:rgba(255,255,255,.4);}
        .cta-btn{padding:10px 22px;border-radius:10px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#fff;cursor:pointer;white-space:nowrap;transition:opacity .18s,transform .18s;}
        .cta-btn:hover{opacity:.88;transform:translateY(-1px);}

        /* Sidebar accordion */
        .nav-item-row{display:flex;align-items:center;border-radius:10px;margin-bottom:2px;overflow:hidden;}
        .nav-chevron{width:24px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.25);font-size:10px;flex-shrink:0;transition:color .18s,transform .18s;border-left:1px solid rgba(255,255,255,.06);}
        .nav-chevron:hover{color:rgba(255,255,255,.6);}
        .nav-chevron.open{transform:rotate(90deg);color:rgba(0,210,180,.6);}
        .nav-sub{overflow:hidden;max-height:0;transition:max-height .25s ease;}
        .nav-sub.open{max-height:200px;}
        .nav-sub-item{display:flex;align-items:center;gap:10px;padding:7px 12px 7px 44px;font-size:13px;color:rgba(255,255,255,.35);cursor:pointer;border-radius:8px;transition:all .15s;margin-bottom:1px;}
        .nav-sub-item:hover{background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);}
        .nav-sub-item.active{color:#00d2b4;background:rgba(0,210,180,.07);}
        .nav-sub-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.6;}

        /* Hamburger for mobile */
        .hamburger{display:none;position:fixed;top:16px;left:16px;z-index:20;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);cursor:pointer;align-items:center;justify-content:center;font-size:18px;color:#fff;}
        .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9;}

        @media(max-width:1100px){
          .grid-top{grid-template-columns:1fr 1fr;}
          .pulse-card{grid-column:1/-1;flex-direction:row;justify-content:space-around;}
        }
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%);}
          .sidebar.open{transform:translateX(0);}
          .main{margin-left:0;padding:80px 16px 48px;}
          .hamburger{display:flex;}
          .sidebar-overlay{display:block;}
          .grid-top{grid-template-columns:1fr;}
          .grid-bottom{grid-template-columns:1fr;}
          .cta-card{flex-direction:column;align-items:flex-start;}
        }
      `}</style>

      <div className="dash-root">
        <div className="bg-grid" />
        <div className="bg-glow g1" />
        <div className="bg-glow g2" />

        {/* Mobile overlay */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)} />}

        {/* Hamburger */}
        <button className="hamburger" onClick={()=>setSidebarOpen(o=>!o)}>☰</button>

        {/* ── Sidebar ── */}
        <aside className={`sidebar ${sidebarOpen?"open":""}`}>
          <div className="sidebar-logo">
            <div className="logo-mark">U</div>
            <div className="logo-name">Uni<span>Flow</span></div>
          </div>

          <div className="nav-section-label">Menu</div>
          {navItems.map(n=>(
            <div key={n.id}>
              {/* Nav item row (label + optional chevron) */}
              <div className="nav-item-row">
                <div
                  className={`nav-item ${activeNav===n.id?"active":""}`}
                  style={{ flex:1, borderRadius: n.hasChildren ? "10px 0 0 10px" : "10px", marginBottom:0 }}
                  onClick={()=>handleNavClick(n.id)}
                >
                  <span className="nav-icon">{n.icon}</span>
                  <span>{n.label}</span>
                </div>
                {n.hasChildren && (
                  <div
                    className={`nav-chevron ${expandedNav===n.id?"open":""} ${activeNav===n.id?"active":""}`}
                    style={{ background: activeNav===n.id ? "rgba(0,210,180,.1)" : "transparent", borderRadius:"0 10px 10px 0" }}
                    onClick={(e)=>{
                      e.stopPropagation();
                      setExpandedNav(prev => prev===n.id ? null : n.id);
                    }}
                  >
                    ›
                  </div>
                )}
              </div>

              {/* Sub items */}
              {n.hasChildren && navSubItems[n.id] && (
                <div className={`nav-sub ${expandedNav===n.id?"open":""}`}>
                  {navSubItems[n.id].map(sub=>(
                    <div
                      key={sub.id}
                      className={`nav-sub-item ${activeNav===sub.id?"active":""}`}
                      onClick={()=>{
                        setActiveNav(sub.id);
                        setSidebarOpen(false);
                        if (typeof window !== "undefined" && window.location.pathname === sub.href) {
                          return;
                        }
                        router.replace(sub.href);
                      }}
                    >
                      <span className="nav-sub-dot" />
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="sidebar-bottom">
            {/* User row */}
            <button className="profile-btn" onClick={()=>handleNavClick("profile")} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", marginBottom:8, background:"transparent", border:"1px solid rgba(255,255,255,.08)", borderRadius:"8px", cursor:"pointer", transition:"all .18s", width:"100%" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", overflow:"hidden", background:"#1a2030", flexShrink:0 }}>
                {avatarUrl ? <img src={avatarUrl} alt="av" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <span style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:14}}>👤</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,.7)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{profile?.display_name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.25)" }}>{profile?.job_role || "Student"}</div>
              </div>
            </button>
            <button className="signout-btn" onClick={handleSignOut}>
              <span>🚪</span><span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="main">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <h1>Welcome back, {profile?.display_name?.split(" ")[0] ?? "there"} 👋</h1>
              <p>Here's your career progress at a glance</p>
            </div>
            <div className="topbar-right">
              <button className="portfolio-btn" onClick={()=>profile?.username && router.push(`/p/${profile.username}`)}>
                🔗 View Portfolio
              </button>
              <div className="avatar-btn" style={{cursor:"pointer"}} onClick={()=>handleNavClick("profile")}>
                {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : "👤"}
              </div>
            </div>
          </div>

          {/* CTA banner */}
          <div className="cta-card" style={{animationDelay:".05s"}}>
            <div className="cta-text">
              <h3>Submit your latest project evidence</h3>
              <p>Link your GitHub repo + screenshot to verify your skills and boost your Pulse Score.</p>
            </div>
            <button className="cta-btn" onClick={()=>handleNavClick("evidence")}>
              + Submit Evidence
            </button>
          </div>

          {/* Top grid */}
          <div className="grid-top">

            {/* Pulse ring card */}
            <div className="card pulse-card" style={{animationDelay:".1s"}}>
              <div className="card-title" style={{textAlign:"center"}}>Employability Pulse</div>
              <div className="pulse-ring-wrap">
                <PulseRing score={score} />
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginBottom:12 }}>
                  Score breakdown
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%", minWidth:160 }}>
                  <div className="pulse-pill">
                    <div className="pulse-pill-dot" style={{background:"#00d2b4"}} />
                    <span className="pulse-pill-text">Academic</span>
                    <span className="pulse-pill-val" style={{marginLeft:"auto"}}>{mastery}%</span>
                  </div>
                  <div className="pulse-pill">
                    <div className="pulse-pill-dot" style={{background:"#6366f1"}} />
                    <span className="pulse-pill-text">Projects</span>
                    <span className="pulse-pill-val" style={{marginLeft:"auto"}}>{projects}%</span>
                  </div>
                  <div className="pulse-pill">
                    <div className="pulse-pill-dot" style={{background:"#f59e0b"}} />
                    <span className="pulse-pill-text">Community</span>
                    <span className="pulse-pill-val" style={{marginLeft:"auto"}}>{community}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar breakdown */}
            <div className="card pillar-card" style={{animationDelay:".15s"}}>
              <div className="card-title">Score Pillars</div>
              <PillarBar label="Academic Mastery" value={mastery} color="#00d2b4" icon="📘" />
              <PillarBar label="Practical Projects" value={projects} color="#6366f1" icon="🔗" />
              <PillarBar label="Community Impact" value={community} color="#f59e0b" icon="🤝" />
              <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(255,255,255,.025)", borderRadius:12, border:"1px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginBottom:6 }}>How to improve</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.6 }}>
                  {projects < mastery && community < mastery
                    ? "Submit a project with GitHub evidence to boost your score the most (+40 pts)."
                    : community < 30
                    ? "Help a peer with a study session to earn Community Impact points (+10 pts)."
                    : "Complete more module KPIs in the Learning section to raise Academic Mastery."}
                </div>
              </div>
            </div>

            {/* Mentor toggle */}
            <div className="card mentor-card" style={{animationDelay:".2s"}}>
              <div className="card-title">Mentor Mode</div>
              <button
                type="button"
                className={`mentor-toggle-row ${profile?.is_mentor?"on":""} ${mentorUpdating?"busy":""}`}
                onClick={toggleMentor}
                aria-pressed={!!profile?.is_mentor}
                disabled={mentorUpdating}
              >
                <div className="mentor-label">
                  <strong>Available to Mentor</strong>
                  <span>{profile?.is_mentor ? "You are visible to peers" : "Toggle to help peers"}</span>
                </div>
                <div className={`toggle ${profile?.is_mentor?"on":""}`} />
              </button>
              {mentorError && (
                <div style={{ fontSize:12, color:"#f87171", marginBottom:12 }}>{mentorError}</div>
              )}
              {profile?.is_mentor && (
                <>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginBottom:10 }}>Your subjects</div>
                  <div className="subjects-wrap">
                    {(profile.mentor_subjects ?? []).length > 0
                      ? profile.mentor_subjects.map(s=>(
                          <span key={s} className="subj-tag">{s}</span>
                        ))
                      : <span style={{fontSize:12,color:"rgba(255,255,255,.25)"}}>No subjects set — edit your profile</span>
                    }
                  </div>
                </>
              )}
              {!profile?.is_mentor && (
                <div style={{ fontSize:13, color:"rgba(255,255,255,.25)", lineHeight:1.6 }}>
                  Mentoring others adds <strong style={{color:"rgba(255,255,255,.4)"}}>Community Impact</strong> to your Pulse Score and generates endorsements for your public portfolio.
                </div>
              )}
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid-bottom">

            {/* Recent activity */}
            <div className="card" style={{animationDelay:".25s"}}>
              <div className="card-title">Recent Activity (sample)</div>
              <div className="activity-list">
                {MOCK_ACTIVITIES.map((a,i)=>(
                  <div key={i} className="activity-item">
                    <div className="act-icon">{a.icon}</div>
                    <div className="act-label">{a.label}</div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <span className="act-pts">+{a.points}</span>
                      <span className="act-time">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="card" style={{animationDelay:".3s"}}>
              <div className="card-title">Skill Badges (sample)</div>
              <div className="badges-grid">
                {MOCK_BADGES.map((b,i)=>(
                  <div key={i} className={`badge-item ${b.earned?"earned":""}`}>
                    <span className="badge-icon">{b.icon}</span>
                    <span className="badge-label">{b.label}</span>
                    {!b.earned && <span className="badge-lock">🔒</span>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(255,255,255,.02)", borderRadius:10, border:"1px solid rgba(255,255,255,.05)", fontSize:12, color:"rgba(255,255,255,.25)", lineHeight:1.6 }}>
                🏆 Earn badges by completing KPIs, submitting projects, and helping peers.
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}