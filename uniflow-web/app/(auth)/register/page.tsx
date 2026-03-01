import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-2">Register</h1>
      <p className="mb-4 text-gray-600">
        Registration will use Google. Coming soon.
      </p>
      <div className="flex flex-col gap-1">
        <Link href="/login" className="text-blue-600 hover:underline w-fit">
          ← Back to Login
        </Link>
        <Link href="/" className="text-blue-600 hover:underline w-fit">
          Home
        </Link>
        <Link href="/networking" className="text-blue-600 hover:underline w-fit">
          Networking (Mentors & Alumni)
        </Link>
      </div>
    </main>
  );
}
