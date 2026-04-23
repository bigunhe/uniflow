"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAlumniNetworkProfileForSession,
  submitAlumniNetworkProfile,
  type AlumniNetworkProfileFormData,
} from "../network-actions";

type NetworkRole = "alumni" | "student";

const ROLE_DATA: Record<
  NetworkRole,
  { icon: string; title: string; highlight: string; description: string; image: string; alt: string }
> = {
  alumni: {
    icon: "🎓",
    title: "Share your",
    highlight: "graduate perspective",
    description:
      "Help current students with career context, interviews, and how your degree maps to industry—not the same flow as peer mentors.",
    image: "/images/456.jpg",
    alt: "Graduate mentor",
  },
  student: {
    icon: "✨",
    title: "Connect with",
    highlight: "alumni mentors",
    description:
      "Tell us about your programme and goals so alumni can understand how to help you in this network.",
    image: "/images/4493.jpg",
    alt: "Student planning their path",
  },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

type Props = {
  initialProfile?: AlumniNetworkProfileFormData | null;
  /** Role from URL (server); used to load the correct row when session is client-only. */
  roleFromUrl: NetworkRole;
};

function hydrateFromProfile(p: AlumniNetworkProfileFormData) {
  return {
    role: p.role,
    fullName: p.full_name,
    email: p.email,
    phone: p.phone?.replace(/\D/g, "").slice(0, 10) ?? "",
    programme: p.programme ?? "",
    graduationYear: p.graduation_year ?? "",
    currentRole: p.current_role ?? "",
    company: p.company ?? "",
    expertise: p.expertise ?? "",
    bio: p.bio ?? "",
    topicsHelp: p.topics_help ?? "",
    yearLevel: p.year_level ?? "",
    focusAreas: p.focus_areas ?? "",
  };
}

export function AlumniRegisterForm({ initialProfile = null, roleFromUrl }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loadedProfile, setLoadedProfile] = useState<AlumniNetworkProfileFormData | null>(
    initialProfile
  );
  const [profileLoading, setProfileLoading] = useState(false);

  const [role, setRole] = useState<NetworkRole>(initialProfile?.role ?? roleFromUrl);
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [email, setEmail] = useState(initialProfile?.email ?? "");
  const [phone, setPhone] = useState(
    initialProfile?.phone?.replace(/\D/g, "").slice(0, 10) ?? ""
  );
  const [programme, setProgramme] = useState(initialProfile?.programme ?? "");
  const [graduationYear, setGraduationYear] = useState(initialProfile?.graduation_year ?? "");
  const [currentRole, setCurrentRole] = useState(initialProfile?.current_role ?? "");
  const [company, setCompany] = useState(initialProfile?.company ?? "");
  const [expertise, setExpertise] = useState(initialProfile?.expertise ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [topicsHelp, setTopicsHelp] = useState(initialProfile?.topics_help ?? "");
  const [yearLevel, setYearLevel] = useState(initialProfile?.year_level ?? "");
  const [focusAreas, setFocusAreas] = useState(initialProfile?.focus_areas ?? "");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setProfileLoading(true);
      setFormError(null);
      try {
        const fromSession = await getAlumniNetworkProfileForSession(roleFromUrl);
        const p = fromSession ?? initialProfile;
        if (cancelled) return;
        if (p && p.id) {
          setLoadedProfile(p);
          const h = hydrateFromProfile(p);
          setRole(h.role);
          setFullName(h.fullName);
          setEmail(h.email);
          setPhone(h.phone);
          setProgramme(h.programme);
          setGraduationYear(h.graduationYear);
          setCurrentRole(h.currentRole);
          setCompany(h.company);
          setExpertise(h.expertise);
          setBio(h.bio);
          setTopicsHelp(h.topicsHelp);
          setYearLevel(h.yearLevel);
          setFocusAreas(h.focusAreas);
        } else {
          setLoadedProfile(null);
          setRole(roleFromUrl);
          setFullName("");
          setEmail("");
          setPhone("");
          setProgramme("");
          setGraduationYear("");
          setCurrentRole("");
          setCompany("");
          setExpertise("");
          setBio("");
          setTopicsHelp("");
          setYearLevel("");
          setFocusAreas("");
        }
      } catch {
        if (!cancelled) {
          setFormError("Could not load your profile. Try refreshing the page.");
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roleFromUrl, initialProfile?.id ?? ""]);

  useEffect(() => {
    if (loadedProfile?.id) return;
    const q = searchParams.get("role");
    if (q === "student" || q === "alumni") setRole(q);
  }, [searchParams, loadedProfile?.id]);

  useEffect(() => {
    setFieldErrors({});
    setFormError(null);
  }, [role]);

  const isEditing = Boolean(loadedProfile?.id);

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";
    const em = email.trim();
    if (!em) errors.email = "Email is required";
    else if (!emailRegex.test(em)) errors.email = "Enter a valid email";
    if (!phone || phone.length !== 10) errors.phone = "Phone number must be exactly 10 digits";

    if (role === "alumni") {
      if (!programme.trim()) errors.programme = "Programme / degree is required";
      if (!graduationYear.trim()) errors.graduationYear = "Graduation year is required";
      if (!currentRole.trim()) errors.currentRole = "Current role is required";
    } else {
      if (!programme.trim()) errors.programme = "Programme is required";
      if (!yearLevel.trim()) errors.yearLevel = "Year level is required";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setFormError("Please fix the highlighted fields.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setPending(true);
    setFormError(null);
    const fd = new FormData();
    fd.set("role", role);
    fd.set("fullName", fullName.trim());
    fd.set("email", email.trim());
    fd.set("phone", phone);
    fd.set("programme", programme.trim());
    if (role === "alumni") {
      fd.set("graduationYear", graduationYear.trim());
      fd.set("currentRole", currentRole.trim());
      fd.set("company", company.trim());
      fd.set("expertise", expertise.trim());
      fd.set("bio", bio.trim());
      fd.set("topicsHelp", topicsHelp.trim());
    } else {
      fd.set("yearLevel", yearLevel.trim());
      fd.set("focusAreas", focusAreas.trim());
    }

    if (loadedProfile?.id) {
      fd.set("profileId", loadedProfile.id);
    }

    const result = await submitAlumniNetworkProfile(fd);
    setPending(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    router.push(result.nextPath);
  };

  const current = ROLE_DATA[role];

  return (
    <section className="min-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] shadow-xl">
      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-2">
        <div className="relative flex items-center justify-center bg-[radial-gradient(circle_at_18%_16%,rgba(0,210,180,0.12),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(99,102,241,0.14),transparent_30%),linear-gradient(180deg,rgba(10,14,22,0.98),rgba(8,12,20,0.98))] px-8 py-12 lg:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -left-12 top-16 h-40 w-40 rounded-full bg-[#00d2b4]/18 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-[#6366f1]/18 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-md text-center lg:text-left">
            <p className="mb-4 text-left text-sm text-[#00d2b4]">
              <Link href="/networking/alumni" className="hover:underline">
                ← Alumni network hub
              </Link>
            </p>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-md lg:mx-0">
              <span className="text-2xl">{current.icon}</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-[#f0f4fb] md:text-5xl">
              {current.title}{" "}
              <span className="text-[#00d2b4]">{current.highlight}</span>
            </h1>
            <p className="mt-4 text-base text-[rgba(232,238,248,0.88)]">{current.description}</p>

            <div className="mt-8 rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4 shadow-lg backdrop-blur">
              <div className="relative h-56 overflow-hidden rounded-xl bg-white/5">
                <Image
                  key={role}
                  src={current.image}
                  alt={current.alt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[rgba(255,255,255,0.02)] px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm sm:p-8">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#00d2b4]">
                Alumni network
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#f0f4fb]">
                {isEditing ? "Edit profile" : "Profile details"}
              </h2>
              <p className="mt-2 text-sm text-[rgba(168,184,208,0.85)]">
                {isEditing
                  ? "Update your alumni network details. Changes are saved to your existing profile."
                  : "This is not your main UniFlow login—it only stores information for the alumni mentoring flow."}
              </p>
              {profileLoading ? (
                <p className="mt-2 text-xs text-[rgba(0,210,180,0.85)]">Loading your profile…</p>
              ) : null}
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isEditing}
                onClick={() => setRole("alumni")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                  role === "alumni"
                    ? "scale-[1.02] border-[#00d2b4] bg-[#00d2b4]/15 text-white shadow-md"
                    : "border-white/10 bg-white/5 text-[rgba(232,238,248,0.84)] hover:border-[#00d2b4]/30"
                }`}
              >
                Alumni / graduate
              </button>
              <button
                type="button"
                disabled={isEditing}
                onClick={() => setRole("student")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                  role === "student"
                    ? "scale-[1.02] border-[#00d2b4] bg-[#00d2b4]/15 text-white shadow-md"
                    : "border-white/10 bg-white/5 text-[rgba(232,238,248,0.84)] hover:border-[#00d2b4]/30"
                }`}
              >
                Student
              </button>
            </div>
            {isEditing ? (
              <p className="mb-4 text-center text-xs text-[rgba(168,184,208,0.75)]">
                Role is fixed while editing. Start a new registration to use the other role.
              </p>
            ) : null}

            <form className="grid grid-cols-12 gap-4" onSubmit={handleSubmit}>
              {formError ? (
                <div className="col-span-12 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {formError}
                </div>
              ) : null}

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                Full name
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                  placeholder="Your name"
                />
                {fieldErrors.fullName ? (
                  <p className="mt-1 text-xs text-rose-300">{fieldErrors.fullName}</p>
                ) : null}
              </label>

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                Email
                {isEditing ? (
                  <span className="mt-0.5 block text-[11px] font-normal text-[rgba(168,184,208,0.65)]">
                    Email is the profile key and cannot be changed here.
                  </span>
                ) : null}
                <input
                  required
                  type="email"
                  value={email}
                  readOnly={isEditing}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2 read-only:cursor-not-allowed read-only:opacity-80"
                  placeholder="name@email.com"
                  autoComplete="email"
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-xs text-rose-300">{fieldErrors.email}</p>
                ) : null}
              </label>

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                Phone (10 digits)
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                  placeholder="0712345678"
                />
                {fieldErrors.phone ? (
                  <p className="mt-1 text-xs text-rose-300">{fieldErrors.phone}</p>
                ) : null}
              </label>

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                Programme / degree
                <select
                  required
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition focus:bg-white/8 focus:ring-2 appearance-none [&>option]:bg-[#080c14] [&>option]:text-[#f0f4fb]"
                >
                  <option value="" disabled>Select a programme</option>
                  <option value="Bachelor of Information Technology">Bachelor of Information Technology</option>
                  <option value="Bachelor of Cyber Security">Bachelor of Cyber Security</option>
                  <option value="Bachelor of Computer Science">Bachelor of Computer Science</option>
                  <option value="Bachelor of Computer Networking">Bachelor of Computer Networking</option>
                  <option value="Bachelor of Data Science">Bachelor of Data Science</option>
                  <option value="Bachelor of Information Technology Engineering">Bachelor of Information Technology Engineering</option>
                  <option value="Bachelor of Interactive Media">Bachelor of Interactive Media</option>
                  <option value="Bachelor of Software Engineering">Bachelor of Software Engineering</option>
                </select>
                {fieldErrors.programme ? (
                  <p className="mt-1 text-xs text-rose-300">{fieldErrors.programme}</p>
                ) : null}
              </label>

              {role === "alumni" ? (
                <>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Graduation year
                    <input
                      required
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. 2024"
                    />
                    {fieldErrors.graduationYear ? (
                      <p className="mt-1 text-xs text-rose-300">{fieldErrors.graduationYear}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Current role / title
                    <input
                      required
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Software Engineer"
                    />
                    {fieldErrors.currentRole ? (
                      <p className="mt-1 text-xs text-rose-300">{fieldErrors.currentRole}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Company (optional)
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Employer or independent"
                    />
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Areas of expertise
                    <textarea
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Skills and domains you can speak to"
                    />
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Short bio
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="A few sentences about your path"
                    />
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Topics I can help with
                    <textarea
                      value={topicsHelp}
                      onChange={(e) => setTopicsHelp(e.target.value)}
                      rows={2}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Interviews, CVs, choosing roles, etc."
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Year level
                    <select
                      required
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition focus:bg-white/8 focus:ring-2 appearance-none [&>option]:bg-[#080c14] [&>option]:text-[#f0f4fb]"
                    >
                      <option value="" disabled>Select year level</option>
                      <option value="1st year 1st sem">1st year 1st sem</option>
                      <option value="1st year 2nd sem">1st year 2nd sem</option>
                      <option value="2nd year 1st sem">2nd year 1st sem</option>
                      <option value="2nd year 2nd sem">2nd year 2nd sem</option>
                      <option value="3rd year 1st sem">3rd year 1st sem</option>
                      <option value="3rd year 2nd sem">3rd year 2nd sem</option>
                      <option value="4th year 1st sem">4th year 1st sem</option>
                      <option value="4th year 2nd sem">4th year 2nd sem</option>
                    </select>
                    {fieldErrors.yearLevel ? (
                      <p className="mt-1 text-xs text-rose-300">{fieldErrors.yearLevel}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    What you are looking for
                    <textarea
                      value={focusAreas}
                      onChange={(e) => setFocusAreas(e.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Career questions, interview prep, module vs industry, etc."
                    />
                  </label>
                </>
              )}

              <div className="col-span-12 mt-2 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#00d2b4] px-5 py-3 text-sm font-semibold text-[#080c14] transition hover:bg-[#33ddc4] disabled:opacity-60"
                >
                  {pending ? "Saving…" : isEditing ? "Update profile" : "Save profile"}
                </button>
                <Link
                  href="/networking/alumni"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-semibold text-[#f0f4fb] hover:bg-white/5"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
