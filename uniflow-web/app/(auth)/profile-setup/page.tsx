"use client";

import { createClient } from "@/lib/supabase/client";
import { userDataWriteBody } from "@/lib/supabase/user-data-write";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** IT-degree topics for learning/mentoring picks (keep in sync with user_data text[] fields). */
const SUBJECTS = [
  "Programming fundamentals",
  "Object-oriented design",
  "Data structures & algorithms",
  "Database systems",
  "Computer networks",
  "Operating systems",
  "Web application development",
  "Mobile application development",
  "Cloud & distributed systems",
  "Information security",
  "Software engineering & SDLC",
  "Human–computer interaction",
  "AI & machine learning fundamentals",
  "Data engineering & analytics",
  "Systems integration & APIs",
];

const YEAR_SEMESTERS = [
  "Y1S1","Y1S2","Y2S1","Y2S2","Y3S1","Y3S2","Y4S1","Y4S2",
];

const SPECIALIZATIONS = [
  "Information Technology",
  "Data Science",
  "Software Engineering",
  "Cyber Security",
  "Information Systems Engineering",
  "Computer Systems and Network Engineering",
  "Computer Science",
];

const JOB_ROLES = [
  "Software Engineer","Data Analyst","Data Scientist","Frontend Developer",
  "Backend Developer","Full Stack Developer","DevOps Engineer","UI/UX Designer",
  "Cybersecurity Analyst","Machine Learning Engineer","Product Manager",
  "Business Analyst","Network Engineer","Cloud Engineer","Mobile Developer",
];

export default function ProfileSetupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    academicYear: "",
    specialization: "",
    jobRole: "",
    isMentor: false,
    learningSubjects: [] as string[],
    mentorSubjects: [] as string[],
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      const name = (user.user_metadata?.full_name as string) || "";
      setForm(f => ({
        ...f,
        displayName: name,
        email: user.email || "",
        username: name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
      }));

      const { data: row } = await supabase
        .from("user_data")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (row?.onboarding_complete) {
        router.replace("/dashboard");
      }
    });
  }, [router, supabase]);

  const toggleLearning = (s: string) =>
    setForm(f => ({
      ...f,
      learningSubjects: f.learningSubjects.includes(s)
        ? f.learningSubjects.filter(x => x !== s)
        : f.learningSubjects.length < 5 ? [...f.learningSubjects, s] : f.learningSubjects,
    }));

  const toggleMentoring = (s: string) =>
    setForm(f => ({
      ...f,
      mentorSubjects: f.mentorSubjects.includes(s)
        ? f.mentorSubjects.filter(x => x !== s)
        : f.mentorSubjects.length < 5 ? [...f.mentorSubjects, s] : f.mentorSubjects,
    }));

  const handleSave = async () => {
    if (form.isMentor && form.mentorSubjects.length === 0) {
      setError("Choose at least one topic you can help others with.");
      return;
    }
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: dbErr } = await supabase.from("user_data").upsert(
      userDataWriteBody({
        id: user.id,
        email: form.email.trim() || user.email,
        display_name: form.displayName.trim(),
        username: form.username.trim(),
        is_mentor: form.isMentor,
        mentor_subjects: form.mentorSubjects,
        learning_subjects: form.learningSubjects,
        job_role: form.jobRole || null,
        year_of_study: form.academicYear || null,
        specialization: form.specialization || null,
        university: null,
        pulse_score: 0,
        onboarding_complete: true,
      }),
      { onConflict: "id" }
    );

    if (dbErr) {
      const isRls =
        /row-level security|violates row-level security policy/i.test(dbErr.message || "");
      const pg = dbErr as { message: string; details?: string; hint?: string; code?: string };
      const diagnostic = [pg.message, pg.details, pg.hint].filter(Boolean).join(" · ");
      const withCode = pg.code ? `${diagnostic} (${pg.code})`.trim() : diagnostic;
      setError(
        isRls
          ? "Profile save is blocked by database policy. Run the SQL in docs/PROFILES-TABLE.sql in Supabase SQL Editor, then try again."
          : withCode || pg.message
      );
      if (typeof console !== "undefined" && console.error) {
        console.error("[profile-setup] user_data upsert failed", dbErr);
      }
      setSaving(false);
      return;
    }

    router.push("/dashboard");
  };

  const canStep1 =
    form.displayName.trim().length > 0 && /^[a-z0-9_]{3,20}$/.test(form.username);
  const canStep2 = form.academicYear !== "" && form.specialization !== "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .root{min-height:100vh;background:#080c14;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;padding:32px 16px;position:relative;overflow:hidden;}
        .bg-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.025) 1px,transparent 1px);background-size:48px 48px;}
        .bg-glow{position:fixed;pointer-events:none;border-radius:50%;filter:blur(100px);}
        .g1{width:500px;height:500px;background:radial-gradient(circle,rgba(0,210,180,.12) 0%,transparent 70%);top:-150px;left:-150px;}
        .g2{width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%);bottom:-100px;right:-100px;}
        .logo{display:flex;align-items:center;gap:10px;margin-bottom:40px;position:relative;z-index:1;}
        .logo-mark{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#00d2b4,#6366f1);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:#fff;}
        .logo-name{font-family:'Syne',sans-serif;font-weight:700;font-size:19px;color:var(--brand-dark-heading,#f0f4fb);letter-spacing:-.02em;}
        .logo-name span{color:#00d2b4;}
        .progress-wrap{width:100%;max-width:520px;display:flex;gap:8px;margin-bottom:32px;position:relative;z-index:1;}
        .prog-seg{flex:1;height:3px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;position:relative;}
        .prog-seg::after{content:'';position:absolute;inset:0;border-radius:99px;background:linear-gradient(90deg,#00d2b4,#6366f1);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.4,0,.2,1);}
        .prog-seg.done::after{transform:scaleX(1);}
        .card{width:100%;max-width:520px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:40px 40px 36px;position:relative;z-index:1;backdrop-filter:blur(20px);}
        .step-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(0,210,180,.1);border:1px solid rgba(0,210,180,.22);border-radius:99px;padding:3px 12px;font-size:11px;font-weight:500;letter-spacing:.08em;color:#00d2b4;text-transform:uppercase;margin-bottom:16px;}
        .card-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:var(--brand-dark-heading,#f0f4fb);letter-spacing:-.03em;margin-bottom:6px;}
        .card-sub{font-size:14px;color:var(--brand-dark-muted,#a8b8d0);line-height:1.6;margin-bottom:32px;}
        .field{margin-bottom:20px;}
        .field label{display:block;font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-dark-muted,#a8b8d0);margin-bottom:8px;}
        .field input{width:100%;padding:13px 16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--brand-dark-heading,#f0f4fb);outline:none;transition:border-color .2s,background .2s;}
        .field input:focus{border-color:rgba(0,210,180,.55);background:rgba(0,210,180,.08);}
        .field input::placeholder{color:rgba(255,255,255,.32);}
        .field input:disabled{opacity:.72;}
        .field-hint{font-size:12px;color:var(--brand-dark-subtle,#7d8fa8);margin-top:6px;}
        .prefix-wrap{position:relative;}
        .prefix{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--brand-dark-muted,#a8b8d0);pointer-events:none;}
        .prefix-wrap input{padding-left:130px;}
        .select-wrap{position:relative;margin-bottom:20px;}
        .select-wrap select{width:100%;padding:13px 16px;appearance:none;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--brand-dark-heading,#f0f4fb);outline:none;cursor:pointer;transition:border-color .2s;}
        .select-wrap select:focus{border-color:rgba(0,210,180,.55);}
        .select-wrap select option{background:#131928;color:#fff;}
        .select-arrow{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--brand-dark-muted,#a8b8d0);pointer-events:none;font-size:12px;}
        .select-label{display:block;font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-dark-muted,#a8b8d0);margin-bottom:8px;}
        .mentor-toggle-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px;cursor:pointer;transition:border-color .2s,background .2s;}
        .mentor-toggle-card.active{border-color:rgba(0,210,180,.4);background:rgba(0,210,180,.08);}
        .toggle-copy{flex:1;min-width:0;}
        .toggle-copy strong{display:block;font-size:15px;font-weight:600;color:var(--brand-dark-heading,#f0f4fb);margin-bottom:4px;}
        .toggle-copy span{font-size:13px;color:var(--brand-dark-muted,#a8b8d0);line-height:1.45;}
        .toggle-switch{width:44px;height:24px;border-radius:99px;background:rgba(255,255,255,.14);position:relative;transition:background .2s;flex-shrink:0;}
        .toggle-switch.on{background:linear-gradient(90deg,#00d2b4,#6366f1);}
        .toggle-switch::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .22s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 4px rgba(0,0,0,.3);}
        .toggle-switch.on::after{transform:translateX(20px);}
        .section-label{font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--brand-dark-muted,#a8b8d0);margin-bottom:12px;line-height:1.4;}
        .section-optional{font-size:11px;font-weight:400;text-transform:none;letter-spacing:0;color:var(--brand-dark-subtle,#7d8fa8);margin-left:6px;}
        .subjects-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;}
        .subj-pill{padding:8px 14px;border-radius:99px;font-size:13px;cursor:pointer;border:1px solid rgba(255,255,255,.16);color:var(--brand-dark-text,#d4dde8);background:rgba(255,255,255,.04);font-family:'DM Sans',sans-serif;font-weight:500;transition:all .18s;text-align:left;}
        .subj-pill:hover{border-color:rgba(0,210,180,.45);color:var(--brand-dark-heading,#f0f4fb);}
        .subj-pill.selected{background:rgba(0,210,180,.22);border-color:rgba(0,210,180,.55);color:#e8fffb;}
        .subj-count{font-size:12px;color:var(--brand-dark-subtle,#7d8fa8);margin-bottom:20px;}
        .subj-section{margin-bottom:8px;}
        .mentor-required-note{font-size:13px;color:#fcd34d;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);border-radius:8px;padding:10px 14px;margin-bottom:16px;line-height:1.45;}
        .error-box{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);border-radius:10px;padding:11px 14px;font-size:13px;color:#fecaca;margin-bottom:20px;}
        .btn-row{display:flex;gap:12px;}
        .btn-back{padding:14px 22px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:var(--brand-dark-text,#d4dde8);cursor:pointer;transition:all .18s;}
        .btn-back:hover{background:rgba(255,255,255,.1);color:var(--brand-dark-heading,#f0f4fb);}
        .btn-next{flex:1;padding:14px 24px;border-radius:12px;background:linear-gradient(135deg,#00d2b4,#6366f1);border:none;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;color:#fff;cursor:pointer;transition:opacity .18s,transform .18s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .btn-next:hover:not(:disabled){opacity:.92;transform:translateY(-1px);}
        .btn-next:disabled{opacity:.45;cursor:not-allowed;}
        .spinner{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:560px){.card{padding:28px 20px 24px;}.btn-row{flex-direction:column;}.btn-back{order:2;}}
      `}</style>

      <div className="root brand-dark-shell">
        <div className="bg-grid" /><div className="bg-glow g1" /><div className="bg-glow g2" />
        <div className="logo">
          <div className="logo-mark">U</div>
          <div className="logo-name">Uni<span>Flow</span></div>
        </div>

        <div className="progress-wrap">
          <div className={`prog-seg ${step >= 1 ? "done" : ""}`} />
          <div className={`prog-seg ${step >= 2 ? "done" : ""}`} />
          <div className={`prog-seg ${step >= 3 ? "done" : ""}`} />
        </div>

        <div className="card">
          {step === 1 && (
            <>
              <div className="step-chip">Step 1 of 3</div>
              <h1 className="card-title">Set up your profile</h1>
              <p className="card-sub">This is how other students and employers will see you on UniFlow.</p>
              <div className="field">
                <label>Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kamal Perera"
                  value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} readOnly disabled />
                <div className="field-hint">Tied to your magic-link sign-in.</div>
              </div>
              <div className="field">
                <label>Username</label>
                <div className="prefix-wrap">
                  <span className="prefix">uniflow.lk/p/</span>
                  <input
                    type="text"
                    placeholder="kamal_perera"
                    value={form.username}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                      }))
                    }
                  />
                </div>
                <div className="field-hint">3–20 chars, lowercase, numbers, underscores.</div>
              </div>
              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button
                  type="button"
                  className="btn-next"
                  disabled={!canStep1}
                  onClick={() => {
                    setError("");
                    setStep(2);
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="step-chip">Step 2 of 3</div>
              <h1 className="card-title">Your academic profile</h1>
              <p className="card-sub">Helps match you with peers, mentors, and opportunities.</p>

              <label className="select-label">Year &amp; Semester</label>
              <div className="select-wrap">
                <select
                  value={form.academicYear}
                  onChange={e => setForm(f => ({ ...f, academicYear: e.target.value }))}
                >
                  <option value="">Select your current year &amp; semester…</option>
                  {YEAR_SEMESTERS.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>

              <label className="select-label">Specialization</label>
              <div className="select-wrap">
                <select
                  value={form.specialization}
                  onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                >
                  <option value="">Select your specialization…</option>
                  {SPECIALIZATIONS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>

              <label className="select-label">
                Target Job Role <span className="section-optional">(optional)</span>
              </label>
              <div className="select-wrap">
                <select
                  value={form.jobRole}
                  onChange={e => setForm(f => ({ ...f, jobRole: e.target.value }))}
                >
                  <option value="">Select a target role…</option>
                  {JOB_ROLES.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>

              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button type="button" className="btn-back" onClick={() => { setError(""); setStep(1); }}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-next"
                  disabled={!canStep2}
                  onClick={() => {
                    setError("");
                    setStep(3);
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="step-chip">Step 3 of 3</div>
              <h1 className="card-title">Focus areas</h1>
              <p className="card-sub">
                Choose modules you care about. If you want to support others, turn on mentoring and pick where you can help.
              </p>

              <div
                className={`mentor-toggle-card ${form.isMentor ? "active" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setForm(f => ({ ...f, isMentor: !f.isMentor }))}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setForm(f => ({ ...f, isMentor: !f.isMentor }));
                  }
                }}
              >
                <div className="toggle-copy">
                  <strong>Open to helping other students?</strong>
                  <span>
                    Turn this on if you are happy to mentor on topics you already know well. You can leave it off and only pick what you want to learn.
                  </span>
                </div>
                <div className={`toggle-switch ${form.isMentor ? "on" : ""}`} aria-hidden />
              </div>

              <div className="subj-section">
                <div className="section-label">
                  Topics you want to grow in<span className="section-optional">(optional, up to 5)</span>
                </div>
                <div className="subjects-grid">
                  {SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`subj-pill ${form.learningSubjects.includes(s) ? "selected" : ""}`}
                      onClick={() => toggleLearning(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="subj-count">{form.learningSubjects.length}/5 selected</div>
              </div>

              {form.isMentor && (
                <div className="subj-section">
                  <div className="section-label">
                    Topics you can help with<span className="section-optional">(up to 5)</span>
                  </div>
                  {form.mentorSubjects.length === 0 && (
                    <div className="mentor-required-note">
                      Select at least one topic you can help others with, or turn mentoring off.
                    </div>
                  )}
                  <div className="subjects-grid">
                    {SUBJECTS.map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`subj-pill ${form.mentorSubjects.includes(s) ? "selected" : ""}`}
                        onClick={() => toggleMentoring(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="subj-count">{form.mentorSubjects.length}/5 selected</div>
                </div>
              )}

              {error && <div className="error-box">{error}</div>}
              <div className="btn-row">
                <button type="button" className="btn-back" onClick={() => { setError(""); setStep(2); }}>
                  Back
                </button>
                <button type="button" className="btn-next" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner" />
                      Saving…
                    </>
                  ) : (
                    "Complete setup"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
