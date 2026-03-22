"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveUserRoleProfile,
  UserRole,
  getUserRoleProfile,
} from "../_components/userRoleProfile";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  const [expertise, setExpertise] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const profile = getUserRoleProfile();
    if (profile) {
      router.replace("/networking/mentors/home");
    }
  }, [router]);

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to UniFlow Mentors</h1>
      <p className="mt-2 text-sm text-slate-600">
        Before entering Home, choose your role and fill in your details.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            role === "student"
              ? "border-sky-600 bg-sky-50 text-sky-700"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          I am a Student
        </button>
        <button
          type="button"
          onClick={() => setRole("mentor")}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            role === "mentor"
              ? "border-sky-600 bg-sky-50 text-sky-700"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          I am a Mentor
        </button>
      </div>

      <form
        className="mt-6 grid grid-cols-12 gap-4"
        onSubmit={(event) => {
          event.preventDefault();

          if (role === "student") {
            saveUserRoleProfile({
              role,
              fullName,
              university,
              program,
              yearLevel,
            });
          } else {
            saveUserRoleProfile({
              role,
              fullName,
              expertise,
              yearsOfExperience,
              bio,
            });
          }

          router.push("/networking/mentors/home");
        }}
      >
        <label className="col-span-12 text-sm font-medium text-slate-700">
          Full Name
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 focus:ring-2"
            placeholder="Enter your name"
          />
        </label>

        {role === "student" ? (
          <>
            <label className="col-span-12 text-sm font-medium text-slate-700 md:col-span-6">
              University
              <input
                required
                value={university}
                onChange={(event) => setUniversity(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 focus:ring-2"
                placeholder="University name"
              />
            </label>

            <label className="col-span-12 text-sm font-medium text-slate-700 md:col-span-6">
              Program
              <input
                required
                value={program}
                onChange={(event) => setProgram(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 focus:ring-2"
                placeholder="e.g. Computer Science"
              />
            </label>

            <label className="col-span-12 text-sm font-medium text-slate-700 md:col-span-6">
              Year Level
              <input
                required
                value={yearLevel}
                onChange={(event) => setYearLevel(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 focus:ring-2"
                placeholder="e.g. Year 2"
              />
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
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 focus:ring-2"
                placeholder="e.g. Data Structures"
              />
            </label>

            <label className="col-span-12 text-sm font-medium text-slate-700 md:col-span-6">
              Years of Experience
              <input
                required
                value={yearsOfExperience}
                onChange={(event) => setYearsOfExperience(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 focus:ring-2"
                placeholder="e.g. 5"
              />
            </label>

            <label className="col-span-12 text-sm font-medium text-slate-700">
              Short Bio
              <textarea
                required
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
                placeholder="Tell students about your mentoring style"
              />
            </label>
          </>
        )}

        <div className="col-span-12 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Continue to Home
          </button>
        </div>
      </form>
    </section>
  );
}
