export type SessionStatus = "active" | "completed" | "cancelled";

export type MentoringSession = {
  id: string;
  mentor_id: string;
  student_id: string;
  request_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  notes: string | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
};
