import Link from "next/link";
import { SPECIALIZATIONS, JOB_ROLES, MENTORS, MentorProfile } from "../../../../../_data/mockData";
import MentorCard from "../../../../../_components/student-flow/MentorCard";
import AIChatbot from "../../../../../_components/student-flow/AIChatbot";
import { notFound } from "next/navigation";
import { getAlumniNetworkProfilesByRole } from "../../../../../alumni/network-actions";

export default async function MentorsPage({ params }: { params: Promise<{ specialization: string, role: string }> }) {
  const { specialization, role: roleId } = await params;
  const spec = SPECIALIZATIONS.find(s => s.id === specialization);
  const role = JOB_ROLES.find(r => r.id === roleId && r.specializationId === specialization);
  
  if (!spec || !role) {
    notFound();
  }

  // Fetch real mentors from database
  const realProfiles = await getAlumniNetworkProfilesByRole("alumni");
  
  // Filter real mentors based on specialization (programme) 
  // We'll show all registered alumni for this specialization, or if their current role matches
  const realMentorsMapped: MentorProfile[] = realProfiles
    .filter(p => {
      const specMatch = p.programme?.toLowerCase() === spec.title.toLowerCase();
      const roleMatch = p.current_role?.toLowerCase().includes(role.title.toLowerCase());
      return specMatch || roleMatch;
    })
    .map(p => ({
      id: p.id,
      name: p.full_name,
      roleId: role.id,
      company: p.company || "Independent",
      experience: "Experienced Professional", 
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name)}&background=random`,
      online: true,
    }));

  const mockMentors = MENTORS.filter(m => m.roleId === role.id);
  
  // Combine real and mock mentors, avoiding duplicates by name just in case
  const allMentors = [...realMentorsMapped, ...mockMentors].filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

  return (
    <div className="brand-dark-shell min-h-[calc(100vh-4rem)] bg-[#080c14] text-[#d4dde8]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <header className="mb-10">
          <p className="mb-4 text-sm text-[#00d2b4]">
            <Link href={`/networking/specializations/${spec.id}/roles`} className="hover:underline">
              &larr; Back to {spec.title} Roles
            </Link>
          </p>
          <div className="flex flex-col gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f59e0b]">
              Mentors for {role.title}
            </span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Connect with Mentors
            </h1>
          </div>
          <p className="mt-4 text-base text-[rgba(168,184,208,0.9)] max-w-2xl">
            {allMentors.length > 0 
              ? `Found ${allMentors.length} mentor(s) experienced as a ${role.title}. Reach out to them for guidance, portfolio reviews, or interview preparation.` 
              : `Currently, there are no available mentors specifically for ${role.title}. Try exploring other roles within ${spec.title}.`}
          </p>
        </header>

        {allMentors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-[rgba(255,255,255,0.02)] p-8 text-center">
            <div className="mb-4 text-4xl opacity-50">👥</div>
            <h3 className="mb-2 text-xl font-bold text-white">No Mentors Found</h3>
            <p className="text-sm text-[rgba(168,184,208,0.85)] max-w-md mx-auto">
              We are constantly onboarding new professionals. Check back later or look for mentors in related job roles.
            </p>
            <Link 
              href={`/networking/specializations/${spec.id}/roles`}
              className="mt-6 rounded-xl bg-[rgba(255,255,255,0.08)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgba(255,255,255,0.12)]"
            >
              Browse Other Roles
            </Link>
          </div>
        )}
      </div>

      <AIChatbot />
    </div>
  );
}
