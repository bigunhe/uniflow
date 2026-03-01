import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-2">UniFlow</h1>
      <p className="mb-4 text-gray-600">Welcome.</p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Login
        </Link>
        <Link
          href="/profile-setup"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Profile setup
        </Link>
        <Link
          href="/networking"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Networking (Mentors & Alumni)
        </Link>
      </div>
    </main>
  );
}
