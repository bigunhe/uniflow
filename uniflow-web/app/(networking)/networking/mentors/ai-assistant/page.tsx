export default function MentorAiAssistantPage() {
  return (
    <div className="mx-auto max-w-5xl rounded-sm border border-sky-500 bg-[#f7f8fb] shadow-sm">
      <div className="border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              S
            </span>
            <p className="text-sm font-semibold text-slate-900">Study Guidance Hub</p>
          </div>
          <nav className="flex items-center gap-5 text-xs font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900">Dashboard</a>
            <a href="#" className="text-blue-700">AI Help</a>
            <a href="#" className="hover:text-slate-900">Tutors</a>
            <a href="#" className="hover:text-slate-900">Resources</a>
          </nav>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-5 border border-dashed border-sky-400 p-3 sm:p-4">
          <section className="border border-dashed border-sky-400 bg-white px-4 py-7 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">AI Study Assistant</h1>
            <p className="mt-2 text-sm text-slate-500">
              Instant answers and deep explanations for any academic subject.
            </p>
          </section>

          <section className="border border-dashed border-sky-400 bg-white p-4 sm:p-5">
            <p className="mb-2 text-xs font-medium text-slate-700">Ask your doubt here</p>
            <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4">
              <p className="text-sm text-slate-400">
                e.g. Can you explain the difference between mitosis and meiosis in simple terms?
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="text-sm">paperclip</span>
                <span className="text-sm">image</span>
              </div>
              <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Get AI Help
              </button>
            </div>
          </section>

          <section className="border border-dashed border-sky-400 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <h2 className="text-sm font-semibold text-slate-800">AI Response</h2>
            </div>
            <div className="p-4">
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                <h3 className="text-base font-bold text-blue-700">Understanding Mitosis vs. Meiosis</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  The key difference is that <strong>mitosis</strong> creates two identical daughter cells for growth and repair,
                  while <strong>meiosis</strong> creates four unique sex cells (gametes) for reproduction.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-800">
                  <li><strong>Mitosis:</strong> One division, result is 2 diploid cells (identical).</li>
                  <li><strong>Meiosis:</strong> Two divisions, result is 4 haploid cells (genetically different).</li>
                </ul>
                <div className="mt-4 rounded-lg border-l-2 border-blue-500 bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  Pro-tip: Think of "Mitosis" for "My-Toes" (body cells) and "Meiosis" as "Me-iosis" (making a new me).
                </div>
              </article>
            </div>
          </section>

          <section className="border border-dashed border-sky-400 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">Recommended Resources</h2>
              <a href="#" className="text-xs font-semibold text-blue-700">View all</a>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-8">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-[#dfe5f8] text-slate-500">video</div>
                  <h3 className="text-xs font-semibold text-slate-900">Cell Division Masterclass</h3>
                  <p className="mt-1 text-[11px] text-slate-500">Video - 12 mins</p>
                  <a href="#" className="mt-2 inline-block text-[11px] font-semibold text-blue-700">Watch Now</a>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-[#dfe5f8] text-slate-500">pdf</div>
                  <h3 className="text-xs font-semibold text-slate-900">Biology Exam Summary PDF</h3>
                  <p className="mt-1 text-[11px] text-slate-500">PDF - 5 pages</p>
                  <a href="#" className="mt-2 inline-block text-[11px] font-semibold text-blue-700">Download</a>
                </article>
              </div>

              <aside className="md:col-span-4">
                <h3 className="mb-3 text-xs font-semibold text-slate-900">Online Tutors</h3>
                <div className="space-y-3">
                  <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/48?img=32"
                        alt="Sarah Miller"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Sarah Miller</p>
                        <p className="text-[11px] text-slate-500">4.9 | 174 reviews</p>
                      </div>
                    </div>
                    <button className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-200">
                      Book
                    </button>
                  </article>

                  <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/48?img=12"
                        alt="Dr. David Chen"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Dr. David Chen</p>
                        <p className="text-[11px] text-slate-500">5.0 | 109 reviews</p>
                      </div>
                    </div>
                    <button className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-200">
                      Book
                    </button>
                  </article>
                </div>
              </aside>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-xl bg-blue-700 px-4 py-9 text-center text-white">
            <div className="absolute -left-12 -top-8 h-20 w-40 rounded-full bg-white" />
            <div className="absolute -right-12 -bottom-7 h-20 w-44 rounded-full bg-white" />
            <h2 className="relative text-3xl font-bold tracking-tight">Can't find what you're looking for?</h2>
            <p className="relative mt-2 text-sm text-blue-100">
              Get personalized 1-on-1 guidance from our top-rated academic experts.
            </p>
            <button className="relative mt-5 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-blue-700 shadow-sm hover:bg-slate-100">
              Still Need a Tutor?
            </button>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          © 2024 Study Guidance Hub. Powered by Advanced AI.
        </p>
      </div>
    </div>
  );
}
