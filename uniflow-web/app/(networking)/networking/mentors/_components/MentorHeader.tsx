"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mentorButtonClassName } from "./MentorButton";
import { getUserRoleProfile, clearUserRoleProfile } from "./userRoleProfile";

const navItems = [
  { label: "Home", href: "/networking/mentors/home" },
  { label: "Mentors", href: "/networking/mentors/mentor-discovery" },
  { label: "Messages", href: "/networking/mentors/messages" },
  { label: "AI Assistant", href: "/networking/mentors/ai-assistant" },
  { label: "Dashboard", href: "/networking/mentors/mentor-dashboard" },
];

export function MentorHeader() {
  const router = useRouter();
  const [profile, setProfile] = useState(getUserRoleProfile());
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const userProfile = getUserRoleProfile();
    setProfile(userProfile);
    if (userProfile) {
      setFullName(userProfile.fullName);
    }
  }, []);

  const handleLogout = () => {
    clearUserRoleProfile();
    router.push("/networking/mentors");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/networking/mentors/home" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
            UF
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">UniFlow Mentors</p>
            <p className="text-xs text-slate-500">
              {profile?.role === "mentor" ? "Mentor Suite" : "Student Hub"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/networking/mentors/messages"
            className={mentorButtonClassName({ variant: "ghost", size: "sm" })}
          >
            Messages
          </Link>
          <Link
            href="/networking/mentors/ai-assistant"
            className={mentorButtonClassName({ variant: "ghost", size: "sm" })}
          >
            AI Assistant
          </Link>
          <Link
            href="/networking/mentors/mentor-discovery"
            className={mentorButtonClassName({ variant: "ghost", size: "sm" })}
          >
            Browse
          </Link>
          {profile ? (
            <>
              <span className="text-sm text-slate-600 px-2">{fullName}</span>
              <button
                onClick={handleLogout}
                className={mentorButtonClassName({ variant: "secondary", size: "sm" })}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/networking/mentors/ava-thompson/booking"
              className={mentorButtonClassName({ size: "sm" })}
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
