"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mentorButtonClassName } from "./MentorButton";
import {
  createGuidanceRequest,
  getRequestByMentor,
  GuidanceRequest,
} from "./guidanceRequests";
import { mentorProfiles } from "./mentorData";
import { getUserRoleProfile, UserRoleProfile } from "./userRoleProfile";

type RequestGuidanceButtonProps = {
  mentorSlug: string;
  mentorName: string;
  initialLabel?: string;
  hideHelperText?: boolean;
};

function getButtonState(
  request: GuidanceRequest | undefined,
  initialLabel: string,
) {
  if (!request) {
    return {
      label: initialLabel,
      disabled: false,
      className: mentorButtonClassName({ variant: "primary" }),
      helperText: "",
    };
  }

  if (request.status === "pending") {
    return {
      label: "Request Pending",
      disabled: true,
      className: mentorButtonClassName({ variant: "secondary" }),
      helperText: "Waiting for mentor to accept or reject.",
    };
  }

  if (request.status === "accepted") {
    return {
      label: "Guidance Accepted",
      disabled: true,
      className: mentorButtonClassName({ variant: "secondary" }),
      helperText: "Messages are now activated for both parties.",
    };
  }

  return {
    label: "Rejected - Try Another",
    disabled: false,
    className: mentorButtonClassName({ variant: "ghost" }),
    helperText: "You can request another mentor.",
  };
}

export default function RequestGuidanceButton({
  mentorSlug,
  mentorName,
  initialLabel = "Request Guidance",
  hideHelperText = false,
}: RequestGuidanceButtonProps) {
  const [request, setRequest] = useState<GuidanceRequest | undefined>(undefined);
  const [profile, setProfile] = useState<UserRoleProfile | null>(null);

  useEffect(() => {
    const syncState = () => {
      setRequest(getRequestByMentor(mentorSlug));
    };

    syncState();
    window.addEventListener("guidance-requests-updated", syncState);

    return () => {
      window.removeEventListener("guidance-requests-updated", syncState);
    };
  }, [mentorSlug]);

  useEffect(() => {
    const syncProfile = () => {
      setProfile(getUserRoleProfile());
    };

    syncProfile();
    window.addEventListener("uniflow-role-profile-updated", syncProfile);

    return () => {
      window.removeEventListener("uniflow-role-profile-updated", syncProfile);
    };
  }, []);

  const buttonState = useMemo(
    () => getButtonState(request, initialLabel),
    [request, initialLabel],
  );

  const alternativeMentors = useMemo(() => {
    if (request?.status !== "rejected") return [];
    return mentorProfiles.filter((mentor) => mentor.slug !== mentorSlug).slice(0, 2);
  }, [request?.status, mentorSlug]);

  return (
    <div className="space-y-1">
      <button
        type="button"
        className={buttonState.className}
        disabled={buttonState.disabled}
        onClick={() => {
          const studentName =
            profile?.role === "student" && profile.fullName ? profile.fullName : undefined;
          const next = createGuidanceRequest({ mentorSlug, mentorName, studentName });
          setRequest(next);
        }}
      >
        {buttonState.label}
      </button>
      {request?.status === "rejected" ? (
        <div className="space-y-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-800">Try another tutor</p>
          <div className="flex flex-wrap gap-2">
            {alternativeMentors.map((mentor) => (
              <Link
                key={mentor.slug}
                href={`/networking/mentors/${mentor.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-slate-200 transition hover:bg-indigo-50"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {mentor.name}
              </Link>
            ))}
            <Link
              href="/networking/mentors/mentor-discovery"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-indigo-700"
            >
              View all mentors
            </Link>
          </div>
        </div>
      ) : !hideHelperText && buttonState.helperText ? (
        <p className="text-[11px] text-slate-500">{buttonState.helperText}</p>
      ) : null}
    </div>
  );
}
