import Link from "next/link";
import { notFound } from "next/navigation";
import { mentorButtonClassName } from "../../_components/MentorButton";
import { getMentorBySlug } from "../../_components/mentorData";

type MentorBookingPageProps = {
  params: {
    mentorId: string;
  };
};

export default function MentorBookingPage({ params }: MentorBookingPageProps) {
  const mentor = getMentorBySlug(params.mentorId);

  if (!mentor) {
    notFound();
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12 rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-8 shadow-sm lg:col-span-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Book a Session</h1>
        <p className="mt-2 text-sm text-slate-400">
          Final step in the mentor flow. Select a date, format, and goals before confirming.
        </p>

        <form className="mt-7 grid grid-cols-12 gap-4">
          <label className="col-span-12 text-sm font-medium text-slate-300 md:col-span-6">
            Session Type
            <select className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 focus:ring-2">
              <option>1:1 Mentorship</option>
              <option>Project Review</option>
              <option>Interview Prep</option>
            </select>
          </label>

          <label className="col-span-12 text-sm font-medium text-slate-300 md:col-span-6">
            Duration
            <select className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 focus:ring-2">
              <option>60 Minutes</option>
              <option>90 Minutes</option>
              <option>120 Minutes</option>
            </select>
          </label>

          <label className="col-span-12 text-sm font-medium text-slate-300 md:col-span-6">
            Preferred Date
            <input
              type="date"
              className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 focus:ring-2"
            />
          </label>

          <label className="col-span-12 text-sm font-medium text-slate-300 md:col-span-6">
            Preferred Time
            <input
              type="time"
              className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 focus:ring-2"
            />
          </label>

          <label className="col-span-12 text-sm font-medium text-slate-300">
            Session Goals
            <textarea
              rows={4}
              placeholder="Share what you want to accomplish in this session"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 outline-none ring-teal-500/50 focus:ring-2 placeholder-slate-500"
            />
          </label>

          <div className="col-span-12 flex flex-wrap gap-3 pt-2">
            <button type="submit" className={mentorButtonClassName({ size: "lg" })}>
              Confirm Booking
            </button>
            <Link
              href={`/networking/mentors/${mentor.slug}`}
              className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
            >
              Back to Profile
            </Link>
          </div>
        </form>
      </section>

      <aside className="col-span-12 rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-6 shadow-sm lg:col-span-4">
        <h2 className="text-lg font-semibold text-slate-50">Booking Summary</h2>
        <div className="mt-4 flex items-start gap-3">
          <img src={mentor.image} alt={mentor.name} className="h-14 w-14 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-slate-50">{mentor.name}</p>
            <p className="text-sm text-slate-400">{mentor.expertise}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-slate-400">
          <p><span className="font-semibold">Rate:</span> ${mentor.ratePerHour}/hour</p>
          <p><span className="font-semibold">Estimated Total:</span> ${mentor.ratePerHour}</p>
          <p><span className="font-semibold">Timezone:</span> GMT+8 (Auto-detected)</p>
        </div>
      </aside>
    </div>
  );
}
