import { UserProfile } from "@/models/user";

function overlapCount(source: string[], target: string[]) {
  const targetSet = new Set(target.map((item) => item.toLowerCase()));
  return source.reduce((count, item) => {
    return targetSet.has(item.toLowerCase()) ? count + 1 : count;
  }, 0);
}

export function scoreMentorProfile(
  mentor: UserProfile,
  desiredTags: string[],
  urgencyWeight = 1,
) {
  const tagMatch = overlapCount(desiredTags, mentor.subject_tags);
  const ratingBoost = mentor.rating * 2;
  const experienceBoost = Math.min(mentor.sessions_completed / 10, 10);
  const responseBoost = Math.max(0, 10 - mentor.avg_response_seconds / 30);

  return tagMatch * 8 + ratingBoost + experienceBoost + responseBoost * urgencyWeight;
}

export function rankMentors(
  mentors: UserProfile[],
  desiredTags: string[],
  urgencyWeight = 1,
) {
  return [...mentors]
    .sort(
      (left, right) =>
        scoreMentorProfile(right, desiredTags, urgencyWeight) -
        scoreMentorProfile(left, desiredTags, urgencyWeight),
    )
    .slice(0, 8);
}
