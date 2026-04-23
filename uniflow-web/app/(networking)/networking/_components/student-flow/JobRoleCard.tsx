import Link from "next/link";
import { JobRole } from "../../_data/mockData";
import { Briefcase } from "lucide-react";

export default function JobRoleCard({ role, specializationId }: { role: JobRole, specializationId: string }) {
  return (
    <Link href={`/networking/specializations/${specializationId}/roles/${role.id}/mentors`} className="group">
      <div className="flex h-full flex-col rounded-2xl border border-[rgba(34,197,94,0.15)] bg-[rgba(255,255,255,0.03)] p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.06)] hover:shadow-md hover:ring-1 hover:ring-[rgba(34,197,94,0.35)]">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.1)] text-[#22c55e] shadow-sm ring-1 ring-[rgba(34,197,94,0.2)] group-hover:bg-[rgba(34,197,94,0.2)]">
          <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-[#f0f4fb]">{role.title}</h3>
        <p className="flex-1 text-sm text-[rgba(168,184,208,0.85)] leading-relaxed">
          {role.description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#22c55e] group-hover:text-[#4ade80]">
          Find Mentors <span>&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
