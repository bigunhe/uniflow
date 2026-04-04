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
      <section id="home" className="rounded-t-[2rem] border border-white/8 bg-[rgba(255,255,255,0.03)] px-6 py-12 sm:px-10 lg:px-12">
        <div className="grid grid-cols-12 items-center gap-10">
          <div className="col-span-12 space-y-7 lg:col-span-6">
            <p className="inline-flex rounded-full border border-[#00d2b4]/20 bg-[#00d2b4]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#00d2b4]">
              Intelligent Knowledge Transfer
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-[#f0f4fb] sm:text-6xl">
              The Global
              <br />
              Network for <span className="text-[#00d2b4]">Expert</span> Growth.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[rgba(232,238,248,0.9)]">
              Bridge the gap with AI-assisted human expertise.
              <br />
              Master complex skills through curated 1-on-1 sessions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/networking/mentors/start" className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-5 text-base font-semibold text-white shadow-[0_10px_24px_rgba(0,210,180,0.22)] transition hover:opacity-90">
                <Sparkles className="mr-2 h-4 w-4" /> Find Mentor
              </Link>
              <Link
                href="/networking/mentors/start"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-base font-semibold text-[rgba(232,238,248,0.88)] transition hover:bg-white/8"
              >
                <Briefcase className="mr-2 h-4 w-4" /> Join as Mentor
              </Link>
              <Link
                href="/networking/mentors/messages"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#00d2b4]/20 bg-[#00d2b4]/10 px-5 text-base font-semibold text-[#00d2b4] transition hover:bg-[#00d2b4]/15"
              >
                Open Messages
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

              <div className="absolute -bottom-4 right-3 rounded-xl border border-white/10 bg-[rgba(10,14,22,0.92)] px-3 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#091413] text-[9px] font-semibold text-white">A</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#00d2b4] to-[#6366f1] text-[9px] font-semibold text-white">M</span>
                  </div>
                  <div className="text-[10px]">
                    <p className="font-semibold text-[#f0f4fb]">5k+ Experts</p>
                    <p className="text-[rgba(168,184,208,0.85)]">Globally Networked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-x border-t border-white/8 bg-[rgba(255,255,255,0.02)] px-6 py-14 sm:px-10 lg:px-12">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight text-[#f0f4fb]">The Lifecycle of a Breakthrough</h2>
          <p className="mt-2 text-sm text-[rgba(168,184,208,0.85)]">From query to high-value session, streamlined for efficiency.</p>
        </div>
        <div className="relative mt-10 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16.66%] right-[16.66%] top-5 hidden h-px bg-white/10 md:block" />
          {lifecycleSteps.map((step, index) => (
            <article key={step.title} className="relative text-center">
              <div className={index === 0
                ? "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-[#00d2b4] shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
                : index === 1
                  ? "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d2b4] to-[#6366f1] text-white shadow-[0_8px_22px_rgba(0,210,180,0.2)]"
                  : "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#091413] text-white shadow-[0_8px_22px_rgba(0,0,0,0.24)]"}>
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#f0f4fb]">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-[rgba(168,184,208,0.85)]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="students" className="border-x border-t border-white/8 bg-[rgba(255,255,255,0.02)] px-6 py-14 sm:px-10 lg:px-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-6 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7f91b6]">For Students</p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-tight text-[#f0f4fb]">Accelerate Your Learning Curve</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00d2b4]/15 text-[#00d2b4]">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#f0f4fb]">AI-Human Hybrid Flow</p>
                  <p className="mt-1 text-sm text-[rgba(168,184,208,0.85)]">AI handles routine questions instantly, saving human time for complex shifts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/20 text-[#9ea6ff]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#f0f4fb]">Verified Experts Only</p>
                  <p className="mt-1 text-sm text-[rgba(168,184,208,0.85)]">Every mentor undergoes rigorous technical and teaching validation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="rounded-[1.2rem] border border-white/8 bg-[rgba(255,255,255,0.03)] p-6">
              <div className="rounded-xl bg-[rgba(10,14,22,0.86)] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="space-y-3">
                  <div className="h-2.5 w-36 rounded-full bg-[#6366f1]/45" />
                  <div className="h-2.5 w-full rounded-full bg-white/10" />
                  <div className="h-2.5 w-4/5 rounded-full bg-white/10" />
                  <div className="h-2.5 w-3/5 rounded-full bg-white/10" />
                  <div className="flex items-center justify-between pt-5">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(168,184,208,0.8)]">Matching...</div>
                    <span className="inline-flex h-4 w-9 items-center rounded-full bg-white/10 p-0.5">
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
              <article className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-3xl font-black text-[#f0f4fb]">9.8/10</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[rgba(168,184,208,0.85)]">Satisfaction Rate</p>
              </article>
            </div>

            <div className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
              <p className="text-[11px] font-semibold text-[rgba(232,238,248,0.9)]">Weekly Influence</p>
              <p className="text-right text-[9px] font-semibold uppercase tracking-wide text-[#00d2b4]">+19% Growth</p>
              <div className="mt-2 flex h-16 items-end gap-2 rounded-lg bg-[rgba(10,14,22,0.86)] p-2">
                <span className="w-1/5 rounded-sm bg-white/20" style={{ height: "42%" }} />
                <span className="w-1/5 rounded-sm bg-white/20" style={{ height: "63%" }} />
                <span className="w-1/5 rounded-sm bg-indigo-600" style={{ height: "86%" }} />
                <span className="w-1/5 rounded-sm bg-white/20" style={{ height: "57%" }} />
                <span className="w-1/5 rounded-sm bg-white/20" style={{ height: "68%" }} />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7f91b6]">For Experts</p>
            <h2 className="mt-2 text-5xl font-black leading-[0.95] tracking-tight text-[#f0f4fb]">Monetize Your Experience. Impact Careers.</h2>
            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/20 text-[#9ea6ff]">
                  <CircleDollarSign className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#f0f4fb]">Premium Compensation</p>
                  <p className="mt-1 text-sm text-[rgba(168,184,208,0.85)]">Set your own rates and get paid for high-fidelity 1-on-1 time.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/20 text-[#9ea6ff]">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#f0f4fb]">Scale Your Influence</p>
                  <p className="mt-1 text-sm text-[rgba(168,184,208,0.85)]">Use analytics to refine your teaching and reach more top talent.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-x border-t border-white/8 bg-[rgba(255,255,255,0.02)] px-6 py-14 sm:px-10 lg:px-12">
        <h2 className="text-center text-4xl font-black italic tracking-tight text-[#f0f4fb]">Voices of the Network</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 text-sm text-[rgba(232,238,248,0.88)]">
            <Quote className="mb-3 h-4 w-4 text-[#9ea6ff]" />
            "The AI context-packet is a game changer. When my mentor joined, he already knew exactly where I was stuck. No time wasted."
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[rgba(168,184,208,0.85)]">Sarah Jenkins</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(127,145,182,0.9)]">Engineering @ Vercel</p>
          </article>
          <article className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 text-sm text-[rgba(232,238,248,0.88)]">
            <Quote className="mb-3 h-4 w-4 text-[#9ea6ff]" />
            "I've mentored on many platforms, but Aether is the first that respects my time. The quality of matches is remarkably high."
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[rgba(168,184,208,0.85)]">David Chen</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(127,145,182,0.9)]">Staff Engineer @ Stripe</p>
          </article>
        </div>
      </section>

      <section id="pricing" className="rounded-b-[2rem] border border-white/8 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.8)_0%,rgba(50,36,128,0.9)_40%,rgba(8,12,20,0.95)_100%)] px-6 py-14 text-center text-white sm:px-10 lg:px-12">
        <h2 className="text-5xl font-black tracking-tight text-[#f0f4fb]">Ready to evolve?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[rgba(220,228,240,0.9)]">
          Select your path and start your journey with the world's smartest mentorship network.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/networking/mentors/start" className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,210,180,0.22)] hover:opacity-90">
            I want to Learn <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/networking/mentors/start" className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-[#f0f4fb] hover:bg-white/15">
            I want to Mentor
          </Link>
        </div>
      </section>
    </div>
  );
}
