export default function SessionWorkspacePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Session Workspace</h1>
        <p className="mt-2 text-sm text-slate-600">
          Shared space for notes, tasks, and progress during ongoing mentorship sessions.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Session Notes</h2>
          <p className="mt-3 text-sm text-slate-600">
            Capture key takeaways, decisions, and tasks. This area can later connect to collaborative editing.
          </p>
        </article>
        <aside className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Task Checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="rounded-lg bg-slate-50 p-3">Review architecture notes</li>
            <li className="rounded-lg bg-slate-50 p-3">Implement mentor feedback</li>
            <li className="rounded-lg bg-slate-50 p-3">Prepare next questions</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
