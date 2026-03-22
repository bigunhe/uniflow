import Link from "next/link";
import { mentorButtonClassName } from "./_components/MentorButton";

export default function MentorsEntryPage() {
  return (
    <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
      <div className="col-span-12 space-y-5 lg:col-span-8">
        <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-wide text-sky-800">
          Welcome Space
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Welcome to UniFlow Mentors
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">
          Start by registering as a user so we can personalize your mentor marketplace experience.
          After registration, you will continue to your mentors home.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/networking/mentors/start" className={mentorButtonClassName({ size: "lg" })}>
            Register as User
          </Link>
          <Link
            href="/networking/mentors/home"
            className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
          >
            Skip to Home
          </Link>
        </div>
      </div>

      <div className="col-span-12 rounded-2xl bg-slate-50 p-6 lg:col-span-4">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
        <ol className="mt-3 space-y-3 text-sm text-slate-600">
          <li>1. Register your role and profile details.</li>
          <li>2. Access your personalized mentors home.</li>
          <li>3. Discover mentors and request guidance.</li>
        </ol>
      </div>
    </section>
  );
}
