import Link from "next/link";
import { notFound } from "next/navigation";
import { mentorButtonClassName } from "../_components/MentorButton";
import { getMentorBySlug, mentorProfiles } from "../_components/mentorData";

type MentorDetailsPageProps = {
  params: {
    mentorId: string;
  };
};

export default function MentorDetailsPage({ params }: MentorDetailsPageProps) {
  const mentor = getMentorBySlug(params.mentorId);

  if (!mentor) {
    notFound();
  }

  const relatedMentors = mentorProfiles.filter((m) => m.slug !== mentor.slug).slice(0, 2);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="col-span-12 lg:col-span-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Mentor Profile</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{mentor.name}</h1>
          <p className="mt-2 text-base font-medium text-indigo-700">{mentor.expertise}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">{mentor.about}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {mentor.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
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

        <aside className="col-span-12 rounded-2xl bg-slate-50 p-6 lg:col-span-4">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="h-24 w-24 rounded-2xl object-cover"
          />
          <div className="mt-5 space-y-3 text-sm text-slate-700">
            <p><span className="font-semibold">Rating:</span> {mentor.rating.toFixed(1)} ({mentor.reviews} reviews)</p>
            <p><span className="font-semibold">Rate:</span> ${mentor.ratePerHour}/hour</p>
            <p><span className="font-semibold">Availability:</span> {mentor.availability}</p>
            <p><span className="font-semibold">Languages:</span> {mentor.languages.join(", ")}</p>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {relatedMentors.map((related) => (
          <div key={related.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Also explore {related.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{related.bio}</p>
            <Link
              href={`/networking/mentors/${related.slug}`}
              className="mt-4 inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-800"
            >
              View profile
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
