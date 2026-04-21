"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mentorButtonClassName } from "./MentorButton";
import {
  createGuidanceRequest,
  getRequestByMentor,
  GuidanceRequest,
  removeGuidanceRequestByMentor,
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
      disabled: false,
      className: mentorButtonClassName({ variant: "secondary" }),
      helperText: "Click again to cancel this request.",
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
          if (request?.status === "pending") {
            removeGuidanceRequestByMentor(mentorSlug);
            setRequest(undefined);
            return;
          }

          const studentName =
            profile?.role === "student" && profile.fullName ? profile.fullName : undefined;
          const next = createGuidanceRequest({ mentorSlug, mentorName, studentName });
          setRequest(next);
        }}
      >
        {buttonState.label}
      </button>
      {request?.status === "rejected" ? (
        <div className="space-y-2 rounded-lg border border-dashed border-white/10 bg-white/3 p-3">
          <p className="text-xs font-semibold text-[#f0f4fb]">Try another tutor</p>
          <div className="flex flex-wrap gap-2">
            {alternativeMentors.map((mentor) => (
              <Link
                key={mentor.slug}
                href={`/networking/mentors/${mentor.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#00d2b4] ring-1 ring-white/10 transition hover:bg-white/8"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {mentor.name}
              </Link>
            ))}
            <Link
              href="/networking/mentors/mentor-discovery"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-3 py-1 text-[11px] font-semibold text-white transition hover:opacity-90"
            >
              View all mentors
            </Link>
          </div>
        </div>
      ) : !hideHelperText && buttonState.helperText ? (
        <p className="text-[11px] text-[rgba(168,184,208,0.85)]">{buttonState.helperText}</p>
      ) : null}
    </div>
  );
}
