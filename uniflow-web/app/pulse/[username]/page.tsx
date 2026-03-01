import Link from "next/link";
import { getProfileByUsername } from "@/app/(auth)/actions";

export default async function PulsePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfileByUsername(params.username);

  if (!profile) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Profile not found.</p>
        <div className="flex flex-col gap-1 mt-2">
          <Link href="/" className="text-blue-600 hover:underline w-fit">
            ← Home
          </Link>
          <Link href="/networking" className="text-blue-600 hover:underline w-fit">
            Networking (Mentors & Alumni)
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md">
      <div className="mb-4 flex flex-col gap-1">
        <Link href="/" className="text-blue-600 hover:underline w-fit">
          ← Home
        </Link>
        <Link href="/networking" className="text-blue-600 hover:underline w-fit">
          Networking (Mentors & Alumni)
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-2">{profile.display_name}</h1>
      <p className="text-gray-600">@{profile.username}</p>
      {profile.email && (
        <p className="text-gray-600 mt-1">{profile.email}</p>
      )}
    </main>
  );
}
