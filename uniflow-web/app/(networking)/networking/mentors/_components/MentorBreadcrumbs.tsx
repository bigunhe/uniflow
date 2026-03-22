"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMentorBySlug } from "./mentorData";

const staticLabelMap: Record<string, string> = {
  "mentor-discovery": "Mentors",
  "mentor-dashboard": "Dashboard",
  "request-management": "Requests",
  messages: "Messages",
  "ai-assistant": "AI Assistant",
  "live-session": "Live Session",
  "session-workspace": "Session Workspace",
  "tutor-analytics": "Analytics",
  booking: "Booking",
};

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function MentorBreadcrumbs() {
  const pathname = usePathname();

  if (!pathname.startsWith("/networking/mentors")) {
    return null;
  }

  const pathParts = pathname.split("/").filter(Boolean);
  const mentorRootIndex = pathParts.findIndex((part) => part === "mentors");
  const mentorParts = pathParts.slice(mentorRootIndex + 1);

  if (mentorParts.length === 0) {
    return (
      <div className="mb-6 text-sm text-slate-500">
        <span className="font-medium text-slate-700">Home</span>
      </div>
    );
  }

  const crumbs = mentorParts.map((segment, index) => {
    const href = `/networking/mentors/${mentorParts.slice(0, index + 1).join("/")}`;
    const mentor = getMentorBySlug(segment);
    const label = mentor?.name ?? staticLabelMap[segment] ?? formatSegment(segment);
    const isLast = index === mentorParts.length - 1;

    return { href, label, isLast };
  });

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/networking/mentors" className="hover:text-slate-800">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          {crumb.isLast ? (
            <span className="font-medium text-slate-700">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-slate-800">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
