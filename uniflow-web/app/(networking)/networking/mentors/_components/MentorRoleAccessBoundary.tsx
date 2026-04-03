"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserRoleProfile } from "./userRoleProfile";

type MentorRoleAccessBoundaryProps = {
  children: ReactNode;
};

const MENTOR_ONLY_ROUTES = new Set([
  "request-management",
  "mentor-dashboard",
]);

const STUDENT_ONLY_STATIC_ROUTES = new Set([
  "mentor-discovery",
  "ai-assistant",
]);

const SHARED_ROUTES = new Set([
  "home",
  "messages",
  "session-workspace",
  "live-session",
  "tutor-analytics",
]);

const PUBLIC_ROUTES = new Set(["", "start"]);

const KNOWN_STATIC_ROUTES = new Set([
  ...Array.from(MENTOR_ONLY_ROUTES),
  ...Array.from(STUDENT_ONLY_STATIC_ROUTES),
  ...Array.from(SHARED_ROUTES),
  ...Array.from(PUBLIC_ROUTES),
]);

function getFirstSegment(pathname: string) {
  const base = "/networking/mentors";
  const remainder = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  const segment = remainder.split("/").filter(Boolean)[0];
  return segment || "";
}

function isStudentDetailRoute(firstSegment: string) {
  return firstSegment !== "" && !KNOWN_STATIC_ROUTES.has(firstSegment);
}

export function MentorRoleAccessBoundary({ children }: MentorRoleAccessBoundaryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  const firstSegment = useMemo(() => getFirstSegment(pathname), [pathname]);

  useEffect(() => {
    const profile = getUserRoleProfile();

    if (!profile) {
      if (PUBLIC_ROUTES.has(firstSegment)) {
        setIsAllowed(true);
        return;
      }

      setIsAllowed(false);
      router.replace("/networking/mentors/start");
      return;
    }

    if (firstSegment === "") {
      setIsAllowed(true);
      return;
    }

    if (firstSegment === "start") {
      setIsAllowed(false);
      router.replace("/networking/mentors/home");
      return;
    }

    if (profile.role === "student") {
      if (MENTOR_ONLY_ROUTES.has(firstSegment)) {
        setIsAllowed(false);
        router.replace("/networking/mentors/home");
        return;
      }

      setIsAllowed(true);
      return;
    }

    if (profile.role === "mentor") {
      if (STUDENT_ONLY_STATIC_ROUTES.has(firstSegment) || isStudentDetailRoute(firstSegment)) {
        setIsAllowed(false);
        router.replace("/networking/mentors/home");
        return;
      }

      setIsAllowed(true);
      return;
    }

    setIsAllowed(false);
    router.replace("/networking/mentors/start");
  }, [firstSegment, router]);

  if (!isAllowed) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Checking access...
      </section>
    );
  }

  return <>{children}</>;
}
