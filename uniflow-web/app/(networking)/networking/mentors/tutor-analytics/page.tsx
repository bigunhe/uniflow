const analytics = [
  { label: "Completion Rate", value: "88%" },
  { label: "Average Session Score", value: "4.7/5" },
  { label: "Response Time", value: "12m" },
  { label: "Retention", value: "91%" },
];

export default function TutorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tutor Analytics</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review activity signals and performance trends for mentorship quality.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {analytics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{metric.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
