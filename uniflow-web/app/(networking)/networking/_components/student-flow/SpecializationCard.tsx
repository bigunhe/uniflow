import Link from "next/link";
import { Specialization } from "../../_data/mockData";

export default function SpecializationCard({ specialization }: { specialization: Specialization }) {
  return (
    <Link href={`/networking/specializations/${specialization.id}/roles`} className="group">
      <div className="flex h-full flex-col rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[rgba(255,255,255,0.03)] p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.06)] hover:shadow-md hover:ring-1 hover:ring-[rgba(99,102,241,0.35)]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(99,102,241,0.1)] text-3xl shadow-sm ring-1 ring-[rgba(99,102,241,0.2)] group-hover:bg-[rgba(99,102,241,0.2)]">
          {specialization.icon}
        </div>
        <h3 className="mb-2 text-lg font-bold text-[#f0f4fb]">{specialization.title}</h3>
        <p className="flex-1 text-sm text-[rgba(168,184,208,0.85)] leading-relaxed">
          {specialization.description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#6366f1] group-hover:text-[#818cf8]">
          Explore Roles <span>&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
