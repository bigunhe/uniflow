import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CircleDollarSign,
  GraduationCap,
  Quote,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

const lifecycleSteps = [
  {
    title: "Query AI Engine",
    description: "Ask for foundational help. If complex, AI prepares context for your mentor.",
    icon: Bot,
  },
  {
    title: "Smart Match",
    description: "We alert mentors with relevant expertise. They review context and accept instantly.",
    icon: Sparkles,
  },
  {
    title: "Collaborative Session",
    description: "Solve in real-time. Get personalized insights from top industry experts.",
    icon: Video,
  },
];

export default function MentorsEntryPage() {
  return (
    <div className="space-y-0 pb-8">
      <section id="home" className="rounded-t-[2rem] border-x border-t border-slate-200 bg-[#f3f5f9] px-6 py-12 sm:px-10 lg:px-12">
        <div className="grid grid-cols-12 items-center gap-10">
          <div className="col-span-12 space-y-7 lg:col-span-6">
            <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
              Intelligent Knowledge Transfer
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl">
              The Global
              <br />
              Network for <span className="text-indigo-600">Expert</span> Growth.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600">
              Bridge the gap with AI-assisted human expertise.
              <br />
              Master complex skills through curated 1-on-1 sessions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/networking/mentors/start" className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.25)] transition hover:bg-indigo-700">
                <Sparkles className="mr-2 h-4 w-4" /> Find Mentor
              </Link>
              <Link
                href="/networking/mentors/start"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-5 text-base font-semibold text-slate-800 transition hover:bg-slate-200"
              >
                <Briefcase className="mr-2 h-4 w-4" /> Join as Mentor
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-800/40 bg-[radial-gradient(circle_at_10%_10%,#1f4a5f_0%,#0b1f33_70%)] p-2 shadow-[0_18px_35px_rgba(15,23,42,0.2)]">
                <Image
                  src="/images/123.jpg"
                  alt="Student learning with live mentor session illustration"
                  width={1152}
                  height={768}
                  className="h-auto w-full rounded-xl object-cover"
                  priority
                />
              </div>

              <div className="absolute -bottom-4 right-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white bg-slate-900 text-[9px] font-semibold text-white">A</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white bg-indigo-500 text-[9px] font-semibold text-white">M</span>
                  </div>
                  <div className="text-[10px]">
                    <p className="font-semibold text-slate-900">5k+ Experts</p>
                    <p className="text-slate-500">Globally Networked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-x border-t border-slate-200 bg-[#e8ebf2] px-6 py-14 sm:px-10 lg:px-12">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">The Lifecycle of a Breakthrough</h2>
          <p className="mt-2 text-sm text-slate-600">From query to high-value session, streamlined for efficiency.</p>
        </div>
        <div className="relative mt-10 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16.66%] right-[16.66%] top-5 hidden h-px bg-slate-300 md:block" />
          {lifecycleSteps.map((step, index) => (
            <article key={step.title} className="relative text-center">
              <div className={index === 0
                ? "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-[0_8px_16px_rgba(15,23,42,0.08)]"
                : index === 1
                  ? "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_8px_22px_rgba(79,70,229,0.28)]"
                  : "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-[0_8px_22px_rgba(15,23,42,0.24)]"}>
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="students" className="border-x border-t border-slate-200 bg-[#f5f7fb] px-6 py-14 sm:px-10 lg:px-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-6 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">For Students</p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-950">Accelerate Your Learning Curve</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI-Human Hybrid Flow</p>
                  <p className="mt-1 text-sm text-slate-600">AI handles routine questions instantly, saving human time for complex shifts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Verified Experts Only</p>
                  <p className="mt-1 text-sm text-slate-600">Every mentor undergoes rigorous technical and teaching validation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="rounded-[1.2rem] border border-slate-200 bg-[#eef2fa] p-6">
              <div className="rounded-xl bg-white p-5 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.16)]">
                <div className="space-y-3">
                  <div className="h-2.5 w-36 rounded-full bg-indigo-100" />
                  <div className="h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-2.5 w-4/5 rounded-full bg-slate-100" />
                  <div className="h-2.5 w-3/5 rounded-full bg-slate-100" />
                  <div className="flex items-center justify-between pt-5">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Matching...</div>
                    <span className="inline-flex h-4 w-9 items-center rounded-full bg-indigo-100 p-0.5">
                      <span className="h-3 w-3 rounded-full bg-indigo-500" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="mentors" className="mt-12 grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-4 lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <article className="rounded-xl bg-[#0f1f39] p-4">
                <p className="text-3xl font-black text-white">$4.2k</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">Avg Monthly Earnings</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-[#edf1f7] p-4">
                <p className="text-3xl font-black text-slate-900">9.8/10</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Satisfaction Rate</p>
              </article>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#edf1f7] p-4">
              <p className="text-[11px] font-semibold text-slate-700">Weekly Influence</p>
              <p className="text-right text-[9px] font-semibold uppercase tracking-wide text-indigo-600">+19% Growth</p>
              <div className="mt-2 flex h-16 items-end gap-2 rounded-lg bg-[#dde4f0] p-2">
                <span className="w-1/5 rounded-sm bg-slate-300" style={{ height: "42%" }} />
                <span className="w-1/5 rounded-sm bg-slate-300" style={{ height: "63%" }} />
                <span className="w-1/5 rounded-sm bg-indigo-600" style={{ height: "86%" }} />
                <span className="w-1/5 rounded-sm bg-slate-300" style={{ height: "57%" }} />
                <span className="w-1/5 rounded-sm bg-slate-300" style={{ height: "68%" }} />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">For Experts</p>
            <h2 className="mt-2 text-5xl font-black leading-[0.95] tracking-tight text-slate-950">Monetize Your Experience. Impact Careers.</h2>
            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <CircleDollarSign className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Premium Compensation</p>
                  <p className="mt-1 text-sm text-slate-600">Set your own rates and get paid for high-fidelity 1-on-1 time.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Scale Your Influence</p>
                  <p className="mt-1 text-sm text-slate-600">Use analytics to refine your teaching and reach more top talent.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-x border-t border-slate-200 bg-[#eceff4] px-6 py-14 sm:px-10 lg:px-12">
        <h2 className="text-center text-4xl font-black italic tracking-tight text-slate-900">Voices of the Network</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-[#f6f8fc] p-6 text-sm text-slate-700">
            <Quote className="mb-3 h-4 w-4 text-indigo-300" />
            "The AI context-packet is a game changer. When my mentor joined, he already knew exactly where I was stuck. No time wasted."
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Sarah Jenkins</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Engineering @ Vercel</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-[#f6f8fc] p-6 text-sm text-slate-700">
            <Quote className="mb-3 h-4 w-4 text-indigo-300" />
            "I've mentored on many platforms, but Aether is the first that respects my time. The quality of matches is remarkably high."
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">David Chen</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Staff Engineer @ Stripe</p>
          </article>
        </div>
      </section>

      <section id="pricing" className="rounded-b-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_20%_20%,#4f46e5_0%,#4338ca_40%,#312e81_100%)] px-6 py-14 text-center text-white sm:px-10 lg:px-12">
        <h2 className="text-5xl font-black tracking-tight">Ready to evolve?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-indigo-100">
          Select your path and start your journey with the world's smartest mentorship network.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/networking/mentors/start" className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
            I want to Learn <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/networking/mentors/start" className="inline-flex items-center rounded-xl border border-white/30 bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400">
            I want to Mentor
          </Link>
        </div>
      </section>
    </div>
  );
}
