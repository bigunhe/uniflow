import Link from "next/link";
import { mentorButtonClassName } from "./MentorButton";
import RequestGuidanceButton from "./RequestGuidanceButton";
import { MentorProfile } from "./mentorData";

type MentorCardProps = {
  mentor: MentorProfile;
};

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="p-6">
        <div className="mb-5 flex items-start gap-4">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="h-16 w-16 rounded-xl object-cover ring-2 ring-slate-100"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{mentor.name}</h3>
            <p className="text-sm font-medium text-sky-700">{mentor.expertise}</p>
            <p className="mt-1 text-xs text-slate-500">
              {mentor.rating.toFixed(1)} rating ({mentor.reviews} reviews)
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-600">{mentor.bio}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {mentor.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between text-sm">
          <p className="font-semibold text-slate-800">${mentor.ratePerHour}/hr</p>
          <p className="text-slate-500">{mentor.availability}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/networking/mentors/${mentor.slug}`}
            className={mentorButtonClassName({ variant: "secondary" })}
          >
            View Profile
          </Link>
          <RequestGuidanceButton mentorSlug={mentor.slug} mentorName={mentor.name} />
        </div>
      </div>
    </article>
  );
}
