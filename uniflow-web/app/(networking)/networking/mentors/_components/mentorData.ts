export type MentorProfile = {
  id: number;
  slug: string;
  name: string;
  expertise: string;
  bio: string;
  ratePerHour: number;
  rating: number;
  reviews: number;
  image: string;
  availability: string;
  languages: string[];
  highlights: string[];
  about: string;
};

export const mentorProfiles: MentorProfile[] = [
  {
    id: 1,
    slug: "ava-thompson",
    name: "Ava Thompson",
    expertise: "Frontend Engineering",
    bio: "Helps students build polished React and Next.js portfolios.",
    ratePerHour: 52,
    rating: 4.9,
    reviews: 128,
    image: "https://i.pravatar.cc/200?img=11",
    availability: "Mon-Fri, 6:00 PM - 10:00 PM",
    languages: ["English"],
    highlights: ["React", "Next.js", "UI Architecture", "Career Coaching"],
    about:
      "Ava has mentored over 400 learners transitioning into frontend development. Her sessions focus on practical project work, clear code quality standards, and portfolio readiness.",
  },
  {
    id: 2,
    slug: "liam-garcia",
    name: "Liam Garcia",
    expertise: "Data Structures and Algorithms",
    bio: "Guides interview prep with structured DSA roadmaps.",
    ratePerHour: 48,
    rating: 4.8,
    reviews: 96,
    image: "https://i.pravatar.cc/200?img=15",
    availability: "Tue-Sat, 9:00 AM - 1:00 PM",
    languages: ["English", "Spanish"],
    highlights: ["LeetCode", "Problem Solving", "Mock Interviews", "Java"],
    about:
      "Liam specializes in helping students master algorithmic thinking through step-by-step frameworks and live problem-solving sessions with detailed feedback.",
  },
  {
    id: 3,
    slug: "noah-khan",
    name: "Noah Khan",
    expertise: "Backend Systems",
    bio: "Teaches APIs, databases, and scalable system fundamentals.",
    ratePerHour: 56,
    rating: 4.9,
    reviews: 143,
    image: "https://i.pravatar.cc/200?img=33",
    availability: "Mon-Thu, 5:00 PM - 9:00 PM",
    languages: ["English", "Urdu"],
    highlights: ["Node.js", "PostgreSQL", "System Design", "Cloud Basics"],
    about:
      "Noah mentors aspiring backend engineers on production-grade architecture, API design best practices, and real deployment workflows.",
  },
  {
    id: 4,
    slug: "mia-park",
    name: "Mia Park",
    expertise: "Product Design and UX",
    bio: "Pairs design systems with practical prototyping skills.",
    ratePerHour: 46,
    rating: 4.7,
    reviews: 82,
    image: "https://i.pravatar.cc/200?img=25",
    availability: "Weekends, 10:00 AM - 4:00 PM",
    languages: ["English", "Korean"],
    highlights: ["Figma", "UX Research", "Design Systems", "Prototyping"],
    about:
      "Mia works with learners to improve product thinking, wireframing quality, and interface consistency across web and mobile surfaces.",
  },
];

export function getMentorBySlug(slug: string) {
  return mentorProfiles.find((mentor) => mentor.slug === slug);
}
