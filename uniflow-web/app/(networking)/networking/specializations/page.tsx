import Link from "next/link";
import { SPECIALIZATIONS } from "../_data/mockData";
import SpecializationCard from "../_components/student-flow/SpecializationCard";
import AIChatbot from "../_components/student-flow/AIChatbot";

export default function SpecializationsPage() {
  return (
    <div className="brand-dark-shell min-h-[calc(100vh-4rem)] bg-[#080c14] text-[#d4dde8]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <header className="mb-10">
          <p className="mb-4 text-sm text-[#00d2b4]">
            <Link href="/networking/dashboard" className="hover:underline">
              &larr; Back to Dashboard
            </Link>
          </p>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Choose Your Specialization
          </h1>
          <p className="mt-4 text-base text-[rgba(168,184,208,0.9)] max-w-2xl">
            Select an area of interest to explore related job roles and find mentors who can guide your career path.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SPECIALIZATIONS.map((spec) => (
            <SpecializationCard key={spec.id} specialization={spec} />
          ))}
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
