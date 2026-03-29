const metrics = [
  { label: "Global satisfaction", value: "4.9 / 5.0", sub: "Based on 128 recent reviews" },
  { label: "Response time", value: "12 min", sub: "Faster than 82% peers" },
  { label: "Would rebook", value: "91%", sub: "Past 30 sessions" },
];

const weeklyTrend = [
  { day: "Mon", score: 4.6 },
  { day: "Tue", score: 4.7 },
  { day: "Wed", score: 4.8 },
  { day: "Thu", score: 4.9 },
  { day: "Fri", score: 4.7 },
  { day: "Sat", score: 4.8 },
  { day: "Sun", score: 4.9 },
];

const studentVoices = [
  {
    name: "Elena Rodriguez",
    time: "2h ago",
    note: "Your metaphors for differential equations made it click. Feel ready for the midterm!",
    tags: ["Metaphorical teaching", "Time well-spent"],
  },
  {
    name: "Marcus Chen",
    time: "Yesterday",
    note: "Great session, just wish we had 15 more minutes on the lab report format.",
    tags: ["Thorough content", "Lab work"],
  },
];

const topModules = [
  { title: "Quantum Mechanics Intro", score: 5.0, sessions: 18 },
  { title: "Statistical Thermodynamics", score: 4.8, sessions: 24 },
  { title: "Macroeconomics 101", score: 4.7, sessions: 16 },
];

export default function TutorAnalyticsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Mentor Feedback</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Insights</h1>
          <p className="text-sm text-slate-600">A quick readout of what students are saying and how you’re trending.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-xs text-slate-500">{metric.sub}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sentiment trend</p>
              <h2 className="text-lg font-bold text-slate-900">Weekly movement</h2>
            </div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700">Week</span>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-3">
            {weeklyTrend.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-600">
                <div className="flex h-28 w-full items-end justify-center rounded-lg bg-slate-50 p-1">
                  <div
                    className="w-full rounded-md bg-indigo-500"
                    style={{ height: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent student voices</p>
              <h2 className="text-lg font-bold text-slate-900">What they said</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">Updated daily</span>
          </div>
          <div className="mt-4 space-y-3">
            {studentVoices.map((voice) => (
              <div key={voice.name} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>{voice.name}</span>
                  <span className="text-[11px] text-slate-500">{voice.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">“{voice.note}”</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-indigo-700">
                  {voice.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1 ring-1 ring-indigo-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Top performing modules</h2>
          <p className="text-sm text-slate-600">Sessions this month with average ratings.</p>
          <div className="mt-4 space-y-3">
            {topModules.map((item) => (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>{item.title}</span>
                  <span>{item.score.toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${item.score / 5 * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">{item.sessions} sessions this month</p>
              </div>
            ))}
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Optimization tip</h2>
            <p className="text-sm text-slate-600">Students praise visuals in macro topics.</p>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p className="font-semibold text-indigo-800">Try next</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Add one diagram per concept.</li>
              <li>Reserve 10 min for Q&A.</li>
              <li>Share a 3-link recap.</li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}
