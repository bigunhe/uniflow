export type RequestUrgency = "low" | "medium" | "high" | "urgent";
export type RequestStatus = "open" | "pending" | "accepted" | "rejected" | "completed";

export type GuidanceRequest = {
  id: string;
  student_id: string;
  mentor_id: string | null;
  topic: string;
  description: string;
  urgency: RequestUrgency;
  preferred_time: string | null;
  status: RequestStatus;
  subject_tags: string[];
  session_id: string | null;
  created_at: string;
  updated_at: string;
};
