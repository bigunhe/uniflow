export type StudentProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  university: string | null;
  program: string | null;
  year_level: number | null;
  learning_goals: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
};

export type MentorProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  expertise: string[];
  years_experience: number | null;
  current_role: string | null;
  company: string | null;
  mentoring_topics: string[];
  bio: string | null;
  availability: Record<string, unknown>;
  session_mode: string | null;
  rating: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
};

export type MentorshipRequestStatus = "pending" | "accepted" | "rejected";

export type MentorshipRequest = {
  id: string;
  student_id: string;
  mentor_id: string;
  status: MentorshipRequestStatus;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  meeting_link: string | null;
};

export type MentorshipMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  request_id: string;
  message: string;
  created_at: string;
};

export type MentorBadge = {
  id: string;
  mentor_id: string;
  badge_name: string;
  criteria: string | null;
  created_at: string;
};
