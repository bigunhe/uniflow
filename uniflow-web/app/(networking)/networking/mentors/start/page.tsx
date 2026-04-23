"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveUserRoleProfile,
  UserRole,
  getUserRoleProfile,
} from "../_components/userRoleProfile";
import Image from "next/image";

// Configuration for dynamic content based on role
const ROLE_DATA = {
  student: {
    icon: "🎓",
    title: "Build Your",
    highlight: "Knowledge With Mentors",
    description: "Join a focused space where students and mentors connect, collaborate, and grow together.",
    image: "/images/4493.jpg", // Ensure this exists in your public/images folder
    alt: "Student studying and collaborating",
  },
  mentor: {
    icon: "🤝",
    title: "Share Your",
    highlight: "Expertise & Wisdom",
    description: "Empower the next generation of talent by sharing your experience and guiding students toward success.",
    image: "/images/456.jpg", // Ensure this exists in your public/images folder
    alt: "Mentor providing guidance",
  },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const programRegex = /^[A-Za-z ]+$/;

type FieldErrors = Record<string, string>;

type StudentValidated = {
  role: "student";
  fullName: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  yearLevel: string;
};

type MentorValidated = {
  role: "mentor";
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  yearsOfExperience: string;
  bio: string;
};

function validateCommonFields(input: { fullName: string; email: string; phone: string }) {
  const errors: FieldErrors = {};

  const trimmedFullName = input.fullName.trim();
  if (!trimmedFullName) {
    errors.fullName = "Full name is required";
  } else if (trimmedFullName !== input.fullName) {
    errors.fullName = "Remove leading or trailing spaces";
  }

  const trimmedEmail = input.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (trimmedEmail !== input.email) {
    errors.email = "Remove leading or trailing spaces";
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = "Enter a valid email";
  }

  const trimmedPhone = input.phone.trim();
  if (!trimmedPhone) {
    errors.phone = "Phone number is required";
  } else if (trimmedPhone !== input.phone) {
    errors.phone = "Phone number cannot include spaces";
  } else if (!phoneRegex.test(trimmedPhone)) {
    errors.phone = "Phone number must be exactly 10 digits (numbers only)";
  }

  return { errors, trimmedFullName, trimmedEmail, trimmedPhone };
}

function validateStudentForm(input: {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  yearLevel: string;
}): { errors: FieldErrors; data?: StudentValidated } {
  const { errors, trimmedFullName, trimmedEmail, trimmedPhone } = validateCommonFields(input);

  const trimmedUniversity = input.university.trim();
  if (!trimmedUniversity) {
    errors.university = "University is required";
  } else if (trimmedUniversity.length > 100) {
    errors.university = "University must be 100 characters or less";
  }

  const trimmedProgram = input.program.trim();
  if (!trimmedProgram) {
    errors.program = "Program is required";
  } else if (!programRegex.test(trimmedProgram)) {
    errors.program = "Program must contain only letters and spaces";
  }

  const trimmedYear = input.yearLevel.trim();
  if (!trimmedYear) {
    errors.yearLevel = "Year level is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    data: {
      role: "student",
      fullName: trimmedFullName,
      email: trimmedEmail,
      phone: trimmedPhone,
      university: trimmedUniversity,
      program: trimmedProgram,
      yearLevel: trimmedYear,
    },
  };
}

function validateMentorForm(input: {
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  yearsOfExperience: string;
}): { errors: FieldErrors; data?: MentorValidated } {
  const { errors, trimmedFullName, trimmedEmail, trimmedPhone } = validateCommonFields(input);

  const expertiseItems = input.expertise
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (expertiseItems.length === 0) {
    errors.expertise = "Expertise is required (use a comma-separated list)";
  }

  const trimmedYears = input.yearsOfExperience.trim();
  const numericYears = Number(trimmedYears);
  if (!trimmedYears) {
    errors.yearsOfExperience = "Years of experience is required";
  } else if (!Number.isInteger(numericYears) || numericYears < 0) {
    errors.yearsOfExperience = "Years of experience must be a non-negative integer";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    data: {
      role: "mentor",
      fullName: trimmedFullName,
      email: trimmedEmail,
      phone: trimmedPhone,
      expertise: expertiseItems.join(", "),
      yearsOfExperience: String(numericYears),
      bio: "",
    },
  };
}

export default function RoleSelectionPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [expertise, setExpertise] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const profile = getUserRoleProfile();
    if (profile) {
      router.replace("/networking/mentors/home");
    }
  }, [router]);

  useEffect(() => {
    setFieldErrors({});
    setFormError(null);
  }, [role]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result =
      role === "student"
        ? validateStudentForm({
            fullName,
            email,
            phone,
            university,
            program,
            yearLevel,
          })
        : validateMentorForm({
            fullName,
            email,
            phone,
            expertise,
            yearsOfExperience,
          });

    if (!result.data) {
      setFieldErrors(result.errors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    saveUserRoleProfile(result.data);
    router.push("/networking/mentors/home");
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const currentContent = ROLE_DATA[role];

  return (
    <section className="min-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] shadow-xl">
      <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Dynamic Content */}
        <div className="relative flex items-center justify-center bg-[radial-gradient(circle_at_18%_16%,rgba(0,210,180,0.12),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(99,102,241,0.14),transparent_30%),linear-gradient(180deg,rgba(10,14,22,0.98),rgba(8,12,20,0.98))] px-8 py-12 lg:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -left-12 top-16 h-40 w-40 rounded-full bg-[#00d2b4]/18 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-[#6366f1]/18 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-md text-center lg:text-left">
            <div className="mx-auto flex h-16 w-16 animate-in fade-in zoom-in duration-500 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-md lg:mx-0">
              <span className="text-2xl">{currentContent.icon}</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-[#f0f4fb] md:text-5xl">
              {currentContent.title}
              <span className="text-[#00d2b4]"> {currentContent.highlight}</span>
            </h1>
            <p className="mt-4 text-base text-[rgba(232,238,248,0.88)] transition-all duration-300">
              {currentContent.description}
            </p>

            <div className="mt-8 rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4 shadow-lg backdrop-blur">
              <div className="relative h-56 overflow-hidden rounded-xl bg-white/5">
                <Image
                  key={role} // Key forces re-render for a fresh fade-in animation
                  src={currentContent.image}
                  alt={currentContent.alt}
                  fill
                  className="object-cover animate-in fade-in duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex items-center justify-center bg-[rgba(255,255,255,0.02)] px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm sm:p-8">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#00d2b4]">UniFlow Mentors</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#f0f4fb]">Create Profile</h2>
              <p className="mt-2 text-sm text-[rgba(168,184,208,0.85)]">Choose your role and complete your details to continue.</p>
            </div>

            {/* Role Switcher */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  role === "student"
                    ? "border-[#00d2b4] bg-[#00d2b4]/15 text-white shadow-md scale-[1.02]"
                      : "border-white/10 bg-white/5 text-[rgba(232,238,248,0.84)] hover:border-[#00d2b4]/30"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("mentor")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  role === "mentor"
                    ? "border-[#00d2b4] bg-[#00d2b4]/15 text-white shadow-md scale-[1.02]"
                      : "border-white/10 bg-white/5 text-[rgba(232,238,248,0.84)] hover:border-[#00d2b4]/30"
                }`}
              >
                Mentor
              </button>
            </div>

            <form
              className="grid grid-cols-12 gap-4"
              onSubmit={handleSubmit}
            >
              {formError ? (
                <div className="col-span-12 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {formError}
                </div>
              ) : null}

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                Full Name
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                  placeholder="Enter your name"
                />
                {fieldErrors.fullName ? (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                ) : null}
              </label>

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                  placeholder="name@email.com"
                  autoComplete="email"
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                ) : null}
              </label>

              <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                Phone Number
                <input
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                  placeholder="1234567890"
                />
                {fieldErrors.phone ? (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                ) : null}
              </label>

              {role === "student" ? (
                <>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    University
                    <input
                      required
                      value={university}
                      onChange={(event) => setUniversity(event.target.value)}
                      maxLength={100}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="University name"
                    />
                    {fieldErrors.university ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.university}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Program
                    <select
                      required
                      value={program}
                      onChange={(event) => setProgram(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition focus:bg-white/8 focus:ring-2 appearance-none [&>option]:bg-[#080c14] [&>option]:text-[#f0f4fb]"
                    >
                      <option value="" disabled>Select a program</option>
                      <option value="Bachelor of information technology">Bachelor of information technology</option>
                      <option value="Bachelor of cyber security">Bachelor of cyber security</option>
                      <option value="Bachelor of Computer Science">Bachelor of Computer Science</option>
                      <option value="Bachelor of computer Networking">Bachelor of computer Networking</option>
                      <option value="Bachelor of data Science">Bachelor of data Science</option>
                      <option value="Bachelor of information technology engineering">Bachelor of information technology engineering</option>
                      <option value="Bachelor of Interactive media">Bachelor of Interactive media</option>
                    </select>
                    {fieldErrors.program ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.program}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Year Level
                    <select
                      required
                      value={yearLevel}
                      onChange={(event) => setYearLevel(event.target.value)}
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
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.yearLevel}</p>
                    ) : null}
                  </label>
                </>
              ) : (
                <>
                  <label className="col-span-12 text-sm font-medium text-slate-700 md:col-span-6">
                    Expertise
                    <input
                      required
                      value={expertise}
                      onChange={(event) => setExpertise(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 transition focus:bg-white focus:ring-2"
                      placeholder="e.g. Data Structures"
                    />
                    {fieldErrors.expertise ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.expertise}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-slate-700 md:col-span-6">
                    Years of Experience
                    <input
                      required
                      value={yearsOfExperience}
                      onChange={(event) => setYearsOfExperience(event.target.value)}
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 transition focus:bg-white focus:ring-2"
                      placeholder="e.g. 5"
                    />
                    {fieldErrors.yearsOfExperience ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.yearsOfExperience}</p>
                    ) : null}
                  </label>
                </>
              )}

              <div className="col-span-12 pt-1">
                <button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                >
                  Continue to Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}