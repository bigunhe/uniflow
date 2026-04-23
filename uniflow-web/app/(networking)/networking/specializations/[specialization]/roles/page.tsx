import Link from "next/link";
import { SPECIALIZATIONS, JOB_ROLES } from "../../../_data/mockData";
import JobRoleCard from "../../../_components/student-flow/JobRoleCard";
import AIChatbot from "../../../_components/student-flow/AIChatbot";
import { notFound } from "next/navigation";

export default async function JobRolesPage({ params }: { params: Promise<{ specialization: string }> }) {
  const { specialization } = await params;
  const spec = SPECIALIZATIONS.find(s => s.id === specialization);
  
  if (!spec) {
    notFound();
  }

  const roles = JOB_ROLES.filter(r => r.specializationId === spec.id);

  return (
    <div className="brand-dark-shell min-h-[calc(100vh-4rem)] bg-[#080c14] text-[#d4dde8]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <header className="mb-10">
          <p className="mb-4 text-sm text-[#00d2b4]">
            <Link href="/networking/specializations" className="hover:underline">
              &larr; Back to Specializations
            </Link>
          </p>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{spec.icon}</span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Job Roles in {spec.title}
            </h1>
          </div>
          <p className="mt-4 text-base text-[rgba(168,184,208,0.9)] max-w-2xl">
            Explore {roles.length} roles related to this specialization. Select a role to find mentors working in that specific field.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roles.map((role) => (
            <JobRoleCard key={role.id} role={role} specializationId={spec.id} />
          ))}
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
