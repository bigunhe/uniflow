import { Suspense } from "react";
import { AlumniRegisterForm } from "../_components/AlumniRegisterForm";
import {
  getAlumniNetworkProfileById,
  getAlumniNetworkProfileForSession,
} from "../network-actions";

/** Always load session on the server so prefilled data works when cookies are available. */
export const dynamic = "force-dynamic";

function RegisterFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-[rgba(168,184,208,0.9)]">
      Loading form…
    </div>
  );
}

async function RegisterFormLoader({
  role,
  profileId,
}: {
  role: "alumni" | "student";
  profileId?: string;
}) {
  const initialProfile = profileId
    ? await getAlumniNetworkProfileById(profileId)
    : await getAlumniNetworkProfileForSession(role);
  return (
    <AlumniRegisterForm
      key={`${role}-${profileId ?? initialProfile?.id ?? "new"}`}
      initialProfile={initialProfile}
      roleFromUrl={role}
    />
  );
}

export default async function AlumniNetworkRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; profileId?: string }>;
}) {
  const params = await searchParams;
  const q = params.role;
  const profileId = params.profileId?.trim() || undefined;
  const role = q === "student" ? "student" : "alumni";

  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterFormLoader role={role} profileId={profileId} />
    </Suspense>
  );
}
