import Link from "next/link";
import { mentorButtonClassName } from "../_components/MentorButton";

const summaryCards = [
  { label: "Upcoming Sessions", value: "4" },
  { label: "Hours This Month", value: "16" },
  { label: "Learning Goals", value: "7" },
  { label: "Messages", value: "12" },
];

export default function MentorDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mentor Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track your sessions, tasks, and activity from one structured workspace.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <h2 className="text-lg font-semibold text-slate-900">Today</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="rounded-lg border border-slate-200 p-3">10:00 AM - Project review with Ava Thompson</li>
            <li className="rounded-lg border border-slate-200 p-3">2:00 PM - Mock interview session with Liam Garcia</li>
            <li className="rounded-lg border border-slate-200 p-3">4:30 PM - Portfolio feedback and planning</li>
          </ul>
        </div>

        <aside className="col-span-12 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/networking/mentors/mentor-discovery" className={mentorButtonClassName({ variant: "secondary" })}>
              Find More Mentors
            </Link>
            <Link href="/networking/mentors/request-management" className={mentorButtonClassName({ variant: "secondary" })}>
              Review Requests
            </Link>
            <Link href="/networking/mentors/messages" className={mentorButtonClassName({ variant: "secondary" })}>
              Open Messages
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
