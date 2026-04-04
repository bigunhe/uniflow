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
  {
    id: 5,
    slug: "ethan-cole",
    name: "Ethan Cole",
    expertise: "Machine Learning",
    bio: "Breaks down ML workflows from feature prep to model deployment.",
    ratePerHour: 58,
    rating: 4.8,
    reviews: 104,
    image: "https://i.pravatar.cc/200?img=59",
    availability: "Mon-Wed, 7:00 PM - 10:00 PM",
    languages: ["English"],
    highlights: ["Python", "Scikit-learn", "Model Tuning", "MLOps Basics"],
    about:
      "Ethan helps students connect statistics, coding, and deployment with practical mentorship on end-to-end ML projects.",
  },
  {
    id: 6,
    slug: "sophia-njeri",
    name: "Sophia Njeri",
    expertise: "Mobile Development",
    bio: "Coaches students in building production-ready Flutter apps.",
    ratePerHour: 50,
    rating: 4.9,
    reviews: 117,
    image: "https://i.pravatar.cc/200?img=47",
    availability: "Tue-Fri, 4:00 PM - 8:00 PM",
    languages: ["English", "Swahili"],
    highlights: ["Flutter", "Firebase", "State Management", "App Architecture"],
    about:
      "Sophia mentors learners through UI implementation, backend integration, and release readiness for mobile products.",
  },
  {
    id: 7,
    slug: "oliver-chen",
    name: "Oliver Chen",
    expertise: "Cloud and DevOps",
    bio: "Teaches CI/CD, containerization, and cloud deployment fundamentals.",
    ratePerHour: 60,
    rating: 4.8,
    reviews: 91,
    image: "https://i.pravatar.cc/200?img=53",
    availability: "Sat-Sun, 11:00 AM - 3:00 PM",
    languages: ["English", "Mandarin"],
    highlights: ["Docker", "GitHub Actions", "AWS", "Observability"],
    about:
      "Oliver focuses on practical DevOps systems so students can deploy confidently and keep services stable in production.",
  },
];

export function getMentorBySlug(slug: string) {
  return mentorProfiles.find((mentor) => mentor.slug === slug);
}
