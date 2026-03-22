export default function MentorLiveSessionPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Session</h1>
        <p className="mt-2 text-sm text-slate-600">
          Join scheduled sessions with shared notes, agenda, and progress tracking.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Current Session</h2>
          <p className="mt-2 text-sm text-slate-600">No session is currently active.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="rounded-lg bg-slate-50 p-3">Tue, 3:00 PM - Frontend architecture review</li>
            <li className="rounded-lg bg-slate-50 p-3">Thu, 10:00 AM - Backend API deep dive</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
