export type UserRole = "student" | "mentor";

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  headline: string | null;
  subject_tags: string[];
  goals: string | null;
  availability: string | null;
  rating: number;
  sessions_completed: number;
  avg_response_seconds: number;
  created_at: string;
  updated_at: string;
};
