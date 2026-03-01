import Link from "next/link";

export default function NetworkingHubPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Networking</h1>
      <p className="mb-4 text-gray-600">Choose an area to work on.</p>
      <div className="flex gap-4">
        <Link
          href="/networking/mentors"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Mentors
        </Link>
        <Link
          href="/networking/alumni"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Alumni
        </Link>
      </div>
    </main>
  );
}
