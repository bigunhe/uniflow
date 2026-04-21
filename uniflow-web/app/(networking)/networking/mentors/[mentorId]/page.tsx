import Link from "next/link";
import { notFound } from "next/navigation";
import { mentorButtonClassName } from "../_components/MentorButton";
import { getMentorBySlug, mentorProfiles } from "../_components/mentorData";

type MentorDetailsPageProps = {
  params: Promise<{
    mentorId: string;
  }>;
};

export default async function MentorDetailsPage({ params }: MentorDetailsPageProps) {
  const resolvedParams = await params;
  const mentor = getMentorBySlug(resolvedParams.mentorId);

  if (!mentor) {
    notFound();
  }

  const relatedMentors = mentorProfiles.filter((m) => m.slug !== mentor.slug).slice(0, 2);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-12 gap-6 rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-8 shadow-sm">
        <div className="col-span-12 lg:col-span-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00d2b4]">Mentor Profile</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#f0f4fb] sm:text-4xl">{mentor.name}</h1>
          <p className="mt-2 text-base font-medium text-[rgba(232,238,248,0.88)]">{mentor.expertise}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[rgba(232,238,248,0.88)]">{mentor.about}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {mentor.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[rgba(232,238,248,0.88)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/networking/mentors/${mentor.slug}/booking`}
              className={mentorButtonClassName({ size: "lg" })}
            >
              Book Session
            </Link>
            <Link
              href="/networking/mentors/mentor-discovery"
              className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
            >
              Back to Mentors
            </Link>
          </div>
        </div>

        <aside className="col-span-12 rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 lg:col-span-4">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="h-24 w-24 rounded-2xl object-cover"
          />
          <div className="mt-5 space-y-3 text-sm text-[rgba(232,238,248,0.88)]">
            <p><span className="font-semibold">Rating:</span> {mentor.rating.toFixed(1)} ({mentor.reviews} reviews)</p>
            <p><span className="font-semibold">Rate:</span> ${mentor.ratePerHour}/hour</p>
            <p><span className="font-semibold">Availability:</span> {mentor.availability}</p>
            <p><span className="font-semibold">Languages:</span> {mentor.languages.join(", ")}</p>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {relatedMentors.map((related) => (
          <div key={related.slug} className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6">
            <h2 className="text-lg font-semibold text-[#f0f4fb]">Also explore {related.name}</h2>
            <p className="mt-2 text-sm text-[rgba(232,238,248,0.88)]">{related.bio}</p>
            <Link
              href={`/networking/mentors/${related.slug}`}
              className="mt-4 inline-flex text-sm font-semibold text-[#00d2b4] hover:text-white"
            >
              View profile
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
