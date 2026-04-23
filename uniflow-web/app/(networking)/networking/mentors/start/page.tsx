"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveUserRoleProfile,
  UserRole,
} from "../_components/userRoleProfile";
import {
  getMyRoleProfile,
  upsertMentorProfile,
  upsertStudentProfile,
} from "@/services/mentorship";
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

const phoneRegex = /^\d{10}$/;
const programRegex = /^[A-Za-z ]+$/;

type FieldErrors = Record<string, string>;

type StudentValidated = {
  role: "student";
  fullName: string;
  phone: string;
  university: string;
  program: string;
  yearLevel: number;
  learningGoals: string;
  skills: string[];
};

type MentorValidated = {
  role: "mentor";
  fullName: string;
  phone: string;
  expertise: string[];
  yearsOfExperience: number;
  roleName: string;
  company: string;
  mentoringTopics: string[];
  bio: string;
  availability: string;
  sessionMode: string;
};

function parseMentorshipError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("auth session") || message.includes("magic-link login is not active")) {
      return "Your login session is not ready yet. Please open your latest magic link again and return to this page.";
    }

    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeError = error as { code?: unknown; message?: unknown; details?: unknown };
    const code = typeof maybeError.code === "string" ? maybeError.code : "";
    const message = typeof maybeError.message === "string" ? maybeError.message : "";
    const details = typeof maybeError.details === "string" ? maybeError.details : "";

    if (code === "42P01" || message.toLowerCase().includes("relation") && message.toLowerCase().includes("does not exist")) {
      return "Mentorship database tables are not created yet. Run the SQL migration 202604220001_peer_mentorship_schema.sql in your Supabase project, then try again.";
    }

    if (code === "42501" || message.toLowerCase().includes("row-level security")) {
      return "Database permissions for mentorship are missing. Apply the mentorship SQL migration so RLS policies are created.";
    }

    if (message) {
      return details ? `${message} (${details})` : message;
    }
  }

  return fallback;
}

function normalizeCsv(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateCommonFields(input: { fullName: string; phone: string }) {
  const errors: FieldErrors = {};

  const trimmedFullName = input.fullName.trim();
  if (!trimmedFullName) {
    errors.fullName = "Full name is required";
  } else if (trimmedFullName !== input.fullName) {
    errors.fullName = "Remove leading or trailing spaces";
  }

  const trimmedPhone = input.phone.trim();
  if (!trimmedPhone) {
    errors.phone = "Phone number is required";
  } else if (trimmedPhone !== input.phone) {
    errors.phone = "Phone number cannot include spaces";
  } else if (!phoneRegex.test(trimmedPhone)) {
    errors.phone = "Phone number must be exactly 10 digits (numbers only)";
  }

  return { errors, trimmedFullName, trimmedPhone };
}

function validateStudentForm(input: {
  fullName: string;
  phone: string;
  university: string;
  program: string;
  yearLevel: string;
  learningGoals: string;
  skills: string;
}): { errors: FieldErrors; data?: StudentValidated } {
  const { errors, trimmedFullName, trimmedPhone } = validateCommonFields(input);

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
  const numericYear = Number(trimmedYear);
  if (!trimmedYear) {
    errors.yearLevel = "Year level is required";
  } else if (!Number.isInteger(numericYear) || numericYear < 1 || numericYear > 5) {
    errors.yearLevel = "Year level must be between 1 and 5";
  }

  const trimmedLearningGoals = input.learningGoals.trim();
  if (!trimmedLearningGoals) {
    errors.learningGoals = "Learning goals are required";
  }

  const parsedSkills = normalizeCsv(input.skills);
  if (parsedSkills.length === 0) {
    errors.skills = "Add at least one skill";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    data: {
      role: "student",
      fullName: trimmedFullName,
      phone: trimmedPhone,
      university: trimmedUniversity,
      program: trimmedProgram,
      yearLevel: numericYear,
      learningGoals: trimmedLearningGoals,
      skills: parsedSkills,
    },
  };
}

function validateMentorForm(input: {
  fullName: string;
  phone: string;
  expertise: string;
  yearsOfExperience: string;
  roleName: string;
  company: string;
  mentoringTopics: string;
  bio: string;
  availability: string;
  sessionMode: string;
}): { errors: FieldErrors; data?: MentorValidated } {
  const { errors, trimmedFullName, trimmedPhone } = validateCommonFields(input);

  const expertiseItems = normalizeCsv(input.expertise);
  if (expertiseItems.length === 0) {
    errors.expertise = "Expertise is required (use a comma-separated list)";
  }

  const mentoringTopicsItems = normalizeCsv(input.mentoringTopics);
  if (mentoringTopicsItems.length === 0) {
    errors.mentoringTopics = "Add at least one mentoring topic";
  }

  const trimmedYears = input.yearsOfExperience.trim();
  const numericYears = Number(trimmedYears);
  if (!trimmedYears) {
    errors.yearsOfExperience = "Years of experience is required";
  } else if (!Number.isInteger(numericYears) || numericYears < 0) {
    errors.yearsOfExperience = "Years of experience must be a non-negative integer";
  }

  const trimmedRoleName = input.roleName.trim();
  if (!trimmedRoleName) {
    errors.roleName = "Role is required";
  }

  const trimmedSessionMode = input.sessionMode.trim();
  if (!trimmedSessionMode) {
    errors.sessionMode = "Session mode is required";
  }

  const trimmedAvailability = input.availability.trim();
  if (!trimmedAvailability) {
    errors.availability = "Availability is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    data: {
      role: "mentor",
      fullName: trimmedFullName,
      phone: trimmedPhone,
      expertise: expertiseItems,
      yearsOfExperience: numericYears,
      roleName: trimmedRoleName,
      company: input.company.trim(),
      mentoringTopics: mentoringTopicsItems,
      bio: input.bio.trim(),
      availability: trimmedAvailability,
      sessionMode: trimmedSessionMode,
    },
  };
}

export default function RoleSelectionPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [skills, setSkills] = useState("");
  const [expertise, setExpertise] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [roleName, setRoleName] = useState("");
  const [company, setCompany] = useState("");
  const [mentoringTopics, setMentoringTopics] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [sessionMode, setSessionMode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        const profile = await getMyRoleProfile();

        if (profile.student) {
          setRole("student");
          setFullName(profile.student.full_name ?? "");
          setPhone(profile.student.phone ?? "");
          setUniversity(profile.student.university ?? "");
          setProgram(profile.student.program ?? "");
          setYearLevel(profile.student.year_level ? String(profile.student.year_level) : "");
          setLearningGoals(profile.student.learning_goals ?? "");
          setSkills((profile.student.skills || []).join(", "));
        }

        if (profile.mentor) {
          setRole("mentor");
          setFullName(profile.mentor.full_name ?? "");
          setPhone(profile.mentor.phone ?? "");
          setExpertise((profile.mentor.expertise || []).join(", "));
          setYearsOfExperience(
            typeof profile.mentor.years_experience === "number"
              ? String(profile.mentor.years_experience)
              : "",
          );
          setRoleName(profile.mentor.current_role ?? "");
          setCompany(profile.mentor.company ?? "");
          setMentoringTopics((profile.mentor.mentoring_topics || []).join(", "));
          setBio(profile.mentor.bio ?? "");
          setAvailability(
            Object.values(profile.mentor.availability || {}).join(", ") || "",
          );
          setSessionMode(profile.mentor.session_mode ?? "");
        }
      } catch (error) {
        setFormError(parseMentorshipError(error, "Could not load profile. Please refresh and try again."));
      } finally {
        setIsLoading(false);
      }
    };

    void loadExistingProfile();
  }, [router]);

  useEffect(() => {
    setFieldErrors({});
    setFormError(null);
  }, [role]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result =
      role === "student"
        ? validateStudentForm({
            fullName,
            phone,
            university,
            program,
            yearLevel,
            learningGoals,
            skills,
          })
        : validateMentorForm({
            fullName,
            phone,
            expertise,
            yearsOfExperience,
            roleName,
            company,
            mentoringTopics,
            bio,
            availability,
            sessionMode,
          });

    if (!result.data) {
      setFieldErrors(result.errors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      setFieldErrors({});
      setFormError(null);

      if (result.data.role === "student") {
        await upsertStudentProfile({
          fullName: result.data.fullName,
          phone: result.data.phone,
          university: result.data.university,
          program: result.data.program,
          yearLevel: result.data.yearLevel,
          learningGoals: result.data.learningGoals,
          skills: result.data.skills,
        });

        saveUserRoleProfile({
          role: "student",
          fullName: result.data.fullName,
          phone: result.data.phone,
          university: result.data.university,
          program: result.data.program,
          yearLevel: String(result.data.yearLevel),
          email: "",
        });
      } else {
        await upsertMentorProfile({
          fullName: result.data.fullName,
          phone: result.data.phone,
          expertise: result.data.expertise,
          yearsExperience: result.data.yearsOfExperience,
          role: result.data.roleName,
          company: result.data.company,
          mentoringTopics: result.data.mentoringTopics,
          bio: result.data.bio,
          availability: {
            schedule: result.data.availability,
          },
          sessionMode: result.data.sessionMode,
        });

        saveUserRoleProfile({
          role: "mentor",
          fullName: result.data.fullName,
          phone: result.data.phone,
          expertise: result.data.expertise.join(", "),
          yearsOfExperience: String(result.data.yearsOfExperience),
          bio: result.data.bio,
          email: "",
        });
      }

      router.push("/networking/mentors/home");
    } catch (error) {
      setFormError(parseMentorshipError(error, "Could not save profile."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const currentContent = ROLE_DATA[role];

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-10 text-sm text-[rgba(232,238,248,0.86)] shadow-xl">
        Loading profile setup...
      </section>
    );
  }

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
                    <input
                      required
                      value={program}
                      onChange={(event) => setProgram(event.target.value)}
                      pattern="[A-Za-z ]+"
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Computer Science"
                    />
                    {fieldErrors.program ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.program}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Year Level
                    <input
                      required
                      value={yearLevel}
                      onChange={(event) => setYearLevel(event.target.value)}
                      type="number"
                      min={1}
                      max={5}
                      inputMode="numeric"
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Year level (1-5)"
                    />
                    {fieldErrors.yearLevel ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.yearLevel}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Learning Goals
                    <textarea
                      required
                      value={learningGoals}
                      onChange={(event) => setLearningGoals(event.target.value)}
                      className="mt-2 min-h-[92px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Describe what you want to improve this semester"
                    />
                    {fieldErrors.learningGoals ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.learningGoals}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Skills (comma separated)
                    <input
                      required
                      value={skills}
                      onChange={(event) => setSkills(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Python, SQL, React"
                    />
                    {fieldErrors.skills ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.skills}</p>
                    ) : null}
                  </label>
                </>
              ) : (
                <>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Expertise (comma separated)
                    <input
                      required
                      value={expertise}
                      onChange={(event) => setExpertise(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Data Structures"
                    />
                    {fieldErrors.expertise ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.expertise}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Years of Experience
                    <input
                      required
                      value={yearsOfExperience}
                      onChange={(event) => setYearsOfExperience(event.target.value)}
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. 5"
                    />
                    {fieldErrors.yearsOfExperience ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.yearsOfExperience}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Current Role
                    <input
                      required
                      value={roleName}
                      onChange={(event) => setRoleName(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Senior Software Engineer"
                    />
                    {fieldErrors.roleName ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.roleName}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)] md:col-span-6">
                    Company
                    <input
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. UniFlow Labs"
                    />
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Mentoring Topics (comma separated)
                    <input
                      required
                      value={mentoringTopics}
                      onChange={(event) => setMentoringTopics(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Interview prep, Project architecture"
                    />
                    {fieldErrors.mentoringTopics ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.mentoringTopics}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Session Mode
                    <select
                      value={sessionMode}
                      onChange={(event) => setSessionMode(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition focus:bg-white/8 focus:ring-2"
                    >
                      <option value="">Select mode</option>
                      <option value="online">Online</option>
                      <option value="in-person">In-person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {fieldErrors.sessionMode ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.sessionMode}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Availability
                    <input
                      required
                      value={availability}
                      onChange={(event) => setAvailability(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="e.g. Mon-Fri 7 PM to 10 PM"
                    />
                    {fieldErrors.availability ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.availability}</p>
                    ) : null}
                  </label>
                  <label className="col-span-12 text-sm font-medium text-[rgba(232,238,248,0.88)]">
                    Bio
                    <textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      className="mt-2 min-h-[92px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] transition placeholder:text-[rgba(168,184,208,0.6)] focus:bg-white/8 focus:ring-2"
                      placeholder="Share your mentoring style and what students can expect"
                    />
                  </label>
                </>
              )}

              <div className="col-span-12 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                >
                  {isSubmitting ? "Saving Profile..." : "Continue to Home"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}