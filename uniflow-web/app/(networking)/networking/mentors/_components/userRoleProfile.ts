"use client";

export type UserRole = "student" | "mentor";

export type StudentRoleProfile = {
  role: "student";
  fullName: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  yearLevel: string;
};

export type MentorRoleProfile = {
  role: "mentor";
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  yearsOfExperience: string;
  bio: string;
};

export type UserRoleProfile = StudentRoleProfile | MentorRoleProfile;

const STORAGE_KEY = "uniflow-role-profile";

function hasCommonFields(profile: any) {
  return (
    typeof profile.fullName === "string" &&
    typeof profile.email === "string" &&
    typeof profile.phone === "string"
  );
}

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

    if (
      parsed.role === "student" &&
      hasCommonFields(parsed) &&
      typeof parsed.university === "string" &&
      typeof parsed.program === "string" &&
      typeof parsed.yearLevel === "string"
    ) {
      return parsed;
    }

    if (
      parsed.role === "mentor" &&
      hasCommonFields(parsed) &&
      typeof parsed.expertise === "string" &&
      typeof parsed.yearsOfExperience === "string" &&
      typeof parsed.bio === "string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function saveUserRoleProfile(profile: UserRoleProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("uniflow-role-profile-updated"));
}

export function clearUserRoleProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("uniflow-role-profile-updated"));
}
