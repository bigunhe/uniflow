import Link from "next/link";
import RequestGuidanceButton from "./RequestGuidanceButton";
import { MentorProfile } from "./mentorData";

type MentorCardProps = {
  mentor: MentorProfile;
  onProfileClick?: (mentor: MentorProfile) => void;
};

export default function MentorCard({ mentor, onProfileClick }: MentorCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#00d2b4]/20 hover:shadow-[0_12px_28px_rgba(0,210,180,0.12)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/5"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold leading-tight text-[#f0f4fb]">{mentor.name}</h3>
            <p className="text-xs text-[rgba(168,184,208,0.85)]">{mentor.expertise}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-[#00d2b4]">★ {mentor.rating.toFixed(1)}</p>
          <p className="text-[11px] font-medium text-[rgba(168,184,208,0.85)]">{mentor.reviews} reviews</p>
        </div>
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-[rgba(232,238,248,0.88)]">{mentor.bio}</p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {mentor.highlights.slice(0, 3).map((highlight) => (
          <span
            key={highlight}
            className="rounded bg-white/5 px-2 py-1 text-[10px] font-semibold text-[#00d2b4]"
          >
            #{highlight.replace(/\s+/g, "")}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {onProfileClick ? (
          <button
            type="button"
            onClick={() => onProfileClick(mentor)}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-[var(--brand-dark-text)] transition hover:bg-white/8"
          >
            Profile
          </button>
        ) : (
          <Link
            href={`/networking/mentors/${mentor.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-[var(--brand-dark-text)] transition hover:bg-white/8"
          >
            Profile
          </Link>
        )}
        <RequestGuidanceButton
          mentorSlug={mentor.slug}
          mentorName={mentor.name}
          initialLabel="Book Now"
          hideHelperText
        />
      </div>

      <p className="mt-3 text-xs text-[rgba(168,184,208,0.85)]">{mentor.availability}</p>
    </article>
  );
}
