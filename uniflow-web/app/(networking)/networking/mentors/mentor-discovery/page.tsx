import MentorCard from "../_components/mentorCard";
import { mentorProfiles } from "../_components/mentorData";

export default function MentorDiscoveryPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mentor Listing</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Compare mentor expertise, pricing, and availability. Follow the standard flow:
          Home, Mentors, Details, then Booking.
        </p>

        <div className="mt-6 grid grid-cols-12 gap-3">
          <input
            type="search"
            placeholder="Search mentor by name, expertise, or skill"
            className="col-span-12 h-11 rounded-lg border border-slate-300 px-4 text-sm outline-none ring-sky-500 transition focus:ring-2 md:col-span-6"
          />
          <select className="col-span-6 h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 transition focus:ring-2 md:col-span-2">
            <option>All Skills</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>UX Design</option>
          </select>
          <select className="col-span-6 h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 transition focus:ring-2 md:col-span-2">
            <option>Any Budget</option>
            <option>Under $50/hr</option>
            <option>$50 - $70/hr</option>
          </select>
          <select className="col-span-12 h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none ring-sky-500 transition focus:ring-2 md:col-span-2">
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Most Reviewed</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mentorProfiles.map((mentor) => (
          <MentorCard key={mentor.slug} mentor={mentor} />
        ))}
      </section>
    </div>
  );
}
