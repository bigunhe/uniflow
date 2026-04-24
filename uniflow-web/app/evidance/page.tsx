"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Module = { id: string; title: string; subject: string };

const MOCK_MODULES: Module[] = [
  { id: "m1", title: "Arrays & Sorting Algorithms", subject: "Computer Science" },
  { id: "m2", title: "REST API Design", subject: "Web Development" },
  { id: "m3", title: "Database Normalization", subject: "Database Systems" },
  { id: "m4", title: "React Hooks & State Management", subject: "Web Development" },
  { id: "m5", title: "Machine Learning Fundamentals", subject: "Machine Learning" },
  { id: "m6", title: "Network Security Basics", subject: "Cybersecurity" },
];

export default function SubmitEvidencePage() {
  const supabase = createClient();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    moduleId: "",
    githubUrl: "",
    liveUrl: "",
    screenshotFile: null as File | null,
    reflection: "",
    challenges: "",
    learned: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
    });
  }, []);

  const set = (k: string, v: string | File | null) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (file: File | null) => {
    if (!file) return;
    set("screenshotFile", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const validate = () => {
    if (step === 1 && !form.moduleId) return "Please select a project module.";
    if (step === 2) {
      if (!form.githubUrl.startsWith("https://github.com")) return "Enter a valid GitHub URL (https://github.com/...)";
      if (!form.screenshotFile) return "Please upload a screenshot of your project.";
    }
    if (step === 3) {
      if (form.reflection.trim().length < 30) return "Write at least 30 characters in your reflection.";
    }
    return "";
  };

  const next = () => { const e = validate(); if (e) { setError(e); return; } setError(""); setStep(s => s + 1); };
  const back = () => { setError(""); setStep(s => s - 1); };

  const handleSubmit = async () => {
    const e = validate(); if (e) { setError(e); return; }
    setSaving(true); setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setError("Your session expired. Please log in again.");
      router.push("/login");
      return;
    }

    const activeUserId = user.id;
    if (userId !== activeUserId) setUserId(activeUserId);

    const { data: profileRow, error: profileCheckErr } = await supabase
      .from("user_data")
      .select("id")
      .eq("id", activeUserId)
      .maybeSingle();

    if (profileCheckErr || !profileRow) {
      setSaving(false);
      setError("Please complete your profile setup first, then submit evidence.");
      router.push("/profile-setup");
      return;
    }

    let screenshotUrl = "";

    // Upload screenshot to Supabase Storage if available
    if (form.screenshotFile) {
      const ext = form.screenshotFile.name.split(".").pop();
      const path = `${activeUserId}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("project-screenshots")
        .upload(path, form.screenshotFile, { upsert: true });
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from("project-screenshots").getPublicUrl(path);
        screenshotUrl = urlData.publicUrl;
      }
    }

    const { error: dbErr } = await supabase.from("user_project_submission").insert({
      user_id: activeUserId,
      module_id: form.moduleId,
      github_url: form.githubUrl,
      live_url: form.liveUrl,
      screenshot_url: screenshotUrl,
      reflection: form.reflection,
      challenges: form.challenges,
      learned: form.learned,
    });

    if (dbErr) {
      const isFkErr = /foreign key|project_submissions_user_id_fkey|user_project_submission.*fkey/i.test(dbErr.message || "");
      const isRlsErr = /row-level security|violates row-level security policy/i.test(dbErr.message || "");
      setError(
        isRlsErr
          ? "Submission blocked by database policy. Run docs/USER-PROJECT-SUBMISSION.sql in Supabase SQL Editor, then try again."
          : isFkErr
          ? "Profile link missing. Please finish profile setup and try again."
          : dbErr.message
      );
      setSaving(false);
      return;
    }

    // Recalculate pulse score (increment project weight)
    const { data: profile } = await supabase.from("user_data").select("pulse_score").eq("id", activeUserId).single();
    if (profile) {
      const newScore = Math.min(100, (profile.pulse_score || 0) + 15);
      await supabase.from("user_data").update({ pulse_score: newScore }).eq("id", activeUserId);
    }

    setSaving(false);
    setSuccess(true);
  };

  const selectedModule = MOCK_MODULES.find(m => m.id === form.moduleId);

  const steps = [
    { n: 1, label: "Select Module" },
    { n: 2, label: "Add Proof" },
    { n: 3, label: "Reflect" },
  ];

  if (success) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#080c14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:24 }}>
        <div style={{ textAlign:"center", maxWidth:440 }}>
          <div style={{ fontSize:72, animation:"pop .6s cubic-bezier(.4,0,.2,1) both", marginBottom:24 }}>🎉</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#e8eef8", marginBottom:12, animation:"fadeUp .5s .2s both" }}>Evidence Submitted!</h1>
          <p style={{ fontSize:15, color:"rgba(168,184,208,.88)", lineHeight:1.7, marginBottom:32, animation:"fadeUp .5s .3s both" }}>
            Your project for <strong style={{color:"#e8eef8"}}>{selectedModule?.title}</strong> has been verified.<br/>Your Pulse Score has been updated.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", animation:"fadeUp .5s .4s both" }}>
            <button onClick={()=>router.push("/dashboard")} style={{ padding:"12px 24px", borderRadius:12, background:"linear-gradient(135deg,#00d2b4,#6366f1)", border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:"#fff", cursor:"pointer" }}>
              ← Back to Dashboard
            </button>
            <button onClick={()=>{setSuccess(false);setStep(1);setForm({moduleId:"",githubUrl:"",liveUrl:"",screenshotFile:null,reflection:"",challenges:"",learned:""});setPreviewUrl(null);}} style={{ padding:"12px 24px", borderRadius:12, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.12)", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:"rgba(212,221,232,.9)", cursor:"pointer" }}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .root{min-height:100vh;background:#080c14;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;align-items:center;padding:40px 16px 64px;position:relative;overflow:hidden;color:#e8eef8;}
        .root p,.root span,.root li{color:rgba(168,184,208,.95) !important;}
        .root label{color:rgba(212,221,232,.95) !important;font-weight:700;}
        .root strong{color:#e8eef8 !important;font-weight:600;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:fixed;pointer-events:none;border-radius:50%;filter:blur(100px);}
        .g1{width:500px;height:500px;background:radial-gradient(circle,rgba(16,185,129,.14) 0%,transparent 70%);top:-150px;right:-100px;}
        .g2{width:420px;height:420px;background:radial-gradient(circle,rgba(59,130,246,.13) 0%,transparent 70%);bottom:-120px;left:-120px;}

        /* Header */
        .topbar{width:100%;max-width:720px;display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;position:relative;z-index:1;}
        .back-btn{display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.14);color:rgba(212,221,232,.95) !important;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;}
        .back-btn:hover{background:rgba(255,255,255,.08);color:#e8eef8 !important;border-color:rgba(0,210,180,.35);}
        .page-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#e8eef8 !important;}

        /* Step indicator */
        .step-bar{width:100%;max-width:720px;display:flex;align-items:center;margin-bottom:36px;position:relative;z-index:1;}
        .step-node{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;}
        .step-circle{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:2px solid rgba(255,255,255,.24);color:rgba(168,184,208,.95) !important;transition:all .3s;position:relative;z-index:1;background:rgba(255,255,255,.05);}
        .step-circle.done{background:rgba(0,210,180,.15);border-color:rgba(0,210,180,.5);color:#00d2b4;}
        .step-circle.active{background:linear-gradient(135deg,#00d2b4,#6366f1);border-color:transparent;color:#fff;box-shadow:0 0 20px rgba(0,210,180,.35);}
        .step-name{font-size:11px;color:rgba(168,184,208,.9) !important;font-weight:700;letter-spacing:.04em;}
        .step-circle.active~.step-name,.step-circle.done~.step-name{color:#00d2b4 !important;}
        .step-line{flex:1;height:1px;background:rgba(255,255,255,.2);margin:0 -12px;margin-bottom:22px;position:relative;}
        .step-line.done{background:linear-gradient(90deg,#00d2b4,rgba(0,210,180,.3));}

        /* Card */
        .card{width:100%;max-width:720px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:36px;position:relative;z-index:1;animation:fadeUp .4s ease both;backdrop-filter:blur(14px);box-shadow:0 18px 60px -26px rgba(0,0,0,.65);}
        .card-header{margin-bottom:28px;}
        .card-eyebrow{display:inline-flex;align-items:center;gap:6px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.2);border-radius:99px;padding:3px 12px;font-size:11px;font-weight:500;letter-spacing:.08em;color:#00d2b4;text-transform:uppercase;margin-bottom:12px;}
        .card-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#e8eef8 !important;letter-spacing:-.03em;margin-bottom:6px;}
        .card-sub{font-size:14px;color:rgba(168,184,208,.92) !important;line-height:1.6;}

        /* Module grid */
        .module-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px;}
        .module-card{padding:16px;border-radius:14px;border:1.5px solid rgba(255,255,255,.16);background:rgba(255,255,255,.03);cursor:pointer;transition:all .18s;}
        .module-card:hover{border-color:rgba(0,210,180,.35);background:rgba(16,185,129,.07);}
        .module-card.selected{border-color:rgba(0,210,180,.5);background:rgba(0,210,180,.08);}
        .module-subject{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(0,210,180,.7);margin-bottom:6px;}
        .module-title{font-size:14px;font-weight:600;color:#e8eef8 !important;line-height:1.4;}
        .module-check{float:right;font-size:16px;margin-top:-2px;}

        /* Fields */
        .field{margin-bottom:20px;}
        .field label{display:block;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#415987 !important;margin-bottom:8px;}
        .field input, .field textarea{width:100%;padding:13px 16px;background:rgba(8,12,20,.9);border:1px solid rgba(255,255,255,.2);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#e8eef8;outline:none;transition:border-color .2s,background .2s;resize:vertical;}
        .field input:focus,.field textarea:focus{border-color:rgba(0,210,180,.55);background:rgba(8,12,20,.98);box-shadow:0 0 0 3px rgba(0,210,180,.12);}
        .field input::placeholder,.field textarea::placeholder{color:rgba(168,184,208,.78);font-weight:500;}
        .field-hint{font-size:12px;color:rgba(168,184,208,.9) !important;margin-top:6px;font-weight:500;}
        .char-count{font-size:11px;color:rgba(168,184,208,.9) !important;text-align:right;margin-top:4px;font-weight:500;}
        .row-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

        /* Upload zone */
        .upload-zone{border:2px dashed rgba(255,255,255,.25);border-radius:14px;padding:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;min-height:160px;background:rgba(255,255,255,.03);}
        .upload-zone:hover,.upload-zone.drag{border-color:rgba(0,210,180,.4);background:rgba(0,210,180,.04);}
        .upload-zone.has-file{border-color:rgba(0,210,180,.35);background:rgba(0,210,180,.05);}
        .upload-preview{width:100%;max-height:220px;object-fit:contain;border-radius:8px;}
        .upload-icon{font-size:32px;opacity:.7;}
        .upload-label{font-size:13px;color:rgba(212,221,232,.95) !important;text-align:center;font-weight:600;}
        .upload-label strong{color:rgba(0,210,180,.7);}
        .upload-sub{font-size:11px;color:rgba(168,184,208,.88) !important;font-weight:500;}
        .upload-change{position:absolute;top:10px;right:10px;padding:5px 10px;border-radius:8px;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15);font-size:11px;color:rgba(255,255,255,.5);cursor:pointer;}

        /* Error */
        .error-box{background:rgba(239,68,68,.08);border:1.5px solid rgba(248,113,113,.45);border-radius:10px;padding:11px 14px;font-size:13px;color:#fecaca;margin-bottom:20px;font-weight:600;}

        /* Buttons */
        .btn-row{display:flex;gap:12px;margin-top:28px;}
        .btn-back{padding:13px 22px;border-radius:12px;background:rgba(67,96,151,.08);border:1px solid rgba(67,96,151,.2);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#0f3460 !important;cursor:pointer;transition:all .18s;}
        .btn-back:hover{background:rgba(67,96,151,.14);color:#000000 !important;}
        .btn-primary{flex:1;padding:13px 24px;border-radius:12px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#fff;cursor:pointer;transition:opacity .18s,transform .18s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .btn-primary:hover:not(:disabled){opacity:.88;transform:translateY(-1px);}
        .btn-primary:disabled{opacity:.5;cursor:not-allowed;}
        .spinner{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:spin .7s linear infinite;}

        /* Summary strip */
        .summary-strip{display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:12px;margin-bottom:24px;}
        .summary-icon{font-size:20px;}
        .summary-text{font-size:13px;color:rgba(212,221,232,.95) !important;line-height:1.5;font-weight:500;}
        .summary-text strong{color:#e8eef8 !important;font-weight:700;}

        @media(max-width:600px){
          .module-grid{grid-template-columns:1fr;}
          .row-2{grid-template-columns:1fr;}
          .card{padding:24px 18px;}
        }
      `}</style>

      <div className="root">
        <div className="bg-grid" /><div className="bg-glow g1" /><div className="bg-glow g2" />

        {/* Topbar */}
        <div className="topbar">
          <button className="back-btn" onClick={()=>router.push("/dashboard")}>← Dashboard</button>
          <div className="page-title">Submit Evidence</div>
          <div style={{width:100}} />
        </div>

        {/* Step bar */}
        <div className="step-bar">
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "contents" }}>
              <div className="step-node">
                <div className={`step-circle ${step > s.n ? "done" : step === s.n ? "active" : ""}`}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className="step-name">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`step-line ${step > s.n ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        <div className="card">

          {/* ── STEP 1: Select Module ── */}
          {step === 1 && (
            <>
              <div className="card-header">
                <div className="card-eyebrow">Step 1 of 3</div>
                <h2 className="card-title">Which project are you verifying?</h2>
                <p className="card-sub">Select the module this project evidence is linked to.</p>
              </div>
              <div className="module-grid">
                {MOCK_MODULES.map(m => (
                  <div key={m.id} className={`module-card ${form.moduleId === m.id ? "selected" : ""}`}
                    onClick={() => set("moduleId", m.id)}>
                    {form.moduleId === m.id && <span className="module-check">✅</span>}
                    <div className="module-subject">{m.subject}</div>
                    <div className="module-title">{m.title}</div>
                  </div>
                ))}
              </div>
              {error && <div className="error-box" style={{marginTop:16}}>{error}</div>}
              <div className="btn-row">
                <button className="btn-primary" onClick={next} disabled={!form.moduleId}>
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Add Proof ── */}
          {step === 2 && (
            <>
              <div className="card-header">
                <div className="card-eyebrow">Step 2 of 3</div>
                <h2 className="card-title">Show your proof of work</h2>
                <p className="card-sub">Link your GitHub repository and upload a screenshot of your working project.</p>
              </div>

              {selectedModule && (
                <div className="summary-strip">
                  <span className="summary-icon">📦</span>
                  <div className="summary-text">Submitting evidence for: <strong>{selectedModule.title}</strong></div>
                </div>
              )}

              <div className="row-2">
                <div className="field">
                  <label>GitHub Repository URL *</label>
                  <input type="url" placeholder="https://github.com/you/project"
                    value={form.githubUrl} onChange={e=>set("githubUrl",e.target.value)} />
                  <div className="field-hint">Must be a public GitHub repo</div>
                </div>
                <div className="field">
                  <label>Live Demo URL (optional)</label>
                  <input type="url" placeholder="https://yourproject.vercel.app"
                    value={form.liveUrl} onChange={e=>set("liveUrl",e.target.value)} />
                  <div className="field-hint">Deployed URL if available</div>
                </div>
              </div>

              <div className="field">
                <label>Project Screenshot *</label>
                <input type="file" ref={fileRef} accept="image/*" style={{display:"none"}}
                  onChange={e=>handleFile(e.target.files?.[0]||null)} />
                <div className={`upload-zone ${previewUrl?"has-file":""} ${dragOver?"drag":""}`}
                  onClick={()=>!previewUrl && fileRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleDrop}>
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} className="upload-preview" alt="preview" />
                      <button className="upload-change" onClick={e=>{e.stopPropagation();setPreviewUrl(null);set("screenshotFile",null);fileRef.current?.click();}}>
                        Change
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon">🖼️</div>
                      <div className="upload-label">Drag & drop or <strong>click to upload</strong></div>
                      <div className="upload-sub">PNG, JPG, WEBP · Max 5MB</div>
                    </>
                  )}
                </div>
              </div>

              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button className="btn-back" onClick={back}>← Back</button>
                <button className="btn-primary" onClick={next}>Continue →</button>
              </div>
            </>
          )}

          {/* ── STEP 3: Reflection ── */}
          {step === 3 && (
            <>
              <div className="card-header">
                <div className="card-eyebrow">Step 3 of 3</div>
                <h2 className="card-title">Reflect on your journey</h2>
                <p className="card-sub">This reflection becomes part of your public portfolio — be honest and specific.</p>
              </div>

              {selectedModule && (
                <div className="summary-strip">
                  <span className="summary-icon">📦</span>
                  <div className="summary-text">
                    <strong>{selectedModule.title}</strong> · {form.githubUrl.replace("https://","")}{form.screenshotFile ? " · screenshot attached ✓" : ""}
                  </div>
                </div>
              )}

              <div className="field">
                <label>Overall Reflection *</label>
                <textarea rows={4} placeholder="Describe what you built, how it works, and what you're most proud of..."
                  value={form.reflection} onChange={e=>set("reflection",e.target.value)} />
                <div className="char-count">{form.reflection.length} chars (min 30)</div>
              </div>

              <div className="row-2">
                <div className="field">
                  <label>Challenges Faced</label>
                  <textarea rows={3} placeholder="What was the hardest part? How did you overcome it?"
                    value={form.challenges} onChange={e=>set("challenges",e.target.value)} />
                </div>
                <div className="field">
                  <label>Key Learnings</label>
                  <textarea rows={3} placeholder="What new skills or concepts did you gain from this project?"
                    value={form.learned} onChange={e=>set("learned",e.target.value)} />
                </div>
              </div>

              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button className="btn-back" onClick={back}>← Back</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                  {saving ? <><span className="spinner"/>Submitting…</> : "Submit Evidence 🚀"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}