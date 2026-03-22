"use client";

export type UserRole = "student" | "mentor";

export type StudentRoleProfile = {
  role: "student";
  fullName: string;
  university: string;
  program: string;
  yearLevel: string;
};

export type MentorRoleProfile = {
  role: "mentor";
  fullName: string;
  expertise: string;
  yearsOfExperience: string;
  bio: string;
};

export type UserRoleProfile = StudentRoleProfile | MentorRoleProfile;

const STORAGE_KEY = "uniflow-role-profile";

export function getUserRoleProfile(): UserRoleProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as UserRoleProfile;
    if (!parsed || (parsed.role !== "student" && parsed.role !== "mentor")) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveUserRoleProfile(profile: UserRoleProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearUserRoleProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
