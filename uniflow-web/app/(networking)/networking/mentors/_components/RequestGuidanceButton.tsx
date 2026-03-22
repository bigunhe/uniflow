"use client";

import { useEffect, useMemo, useState } from "react";
import { mentorButtonClassName } from "./MentorButton";
import {
  createGuidanceRequest,
  getRequestByMentor,
  GuidanceRequest,
} from "./guidanceRequests";

type RequestGuidanceButtonProps = {
  mentorSlug: string;
  mentorName: string;
};

function getButtonState(request: GuidanceRequest | undefined) {
  if (!request) {
    return {
      label: "Request Guidance",
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
}: RequestGuidanceButtonProps) {
  const [request, setRequest] = useState<GuidanceRequest | undefined>(undefined);

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

  const buttonState = useMemo(() => getButtonState(request), [request]);

  return (
    <div className="space-y-1">
      <button
        type="button"
        className={buttonState.className}
        disabled={buttonState.disabled}
        onClick={() => {
          const next = createGuidanceRequest({ mentorSlug, mentorName });
          setRequest(next);
        }}
      >
        {buttonState.label}
      </button>
      {buttonState.helperText ? (
        <p className="text-[11px] text-slate-500">{buttonState.helperText}</p>
      ) : null}
    </div>
  );
}
