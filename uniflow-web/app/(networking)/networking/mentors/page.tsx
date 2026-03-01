import { getMentors, createMentor, deleteMentor } from "./actions";
import Link from "next/link";

export default async function MentorsPage() {
  const mentors = await getMentors();

  return (
    <main className="p-6 max-w-lg">
      <div className="mb-4">
        <Link href="/networking" className="text-blue-600 hover:underline">
          ← Networking
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Mentors</h1>

      <form action={createMentor} className="flex flex-col gap-2 mb-6">
        <input
          name="name"
          placeholder="Name"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded w-fit">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {mentors.map((m) => (
          <li key={m.id} className="flex items-center justify-between border-b pb-2">
            <span>{m.name} — {m.email ?? "(no email)"}</span>
            <form action={deleteMentor.bind(null, m.id)}>
              <button type="submit" className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      {mentors.length === 0 && <p className="text-gray-500">No mentors yet. Add one above.</p>}
    </main>
  );
}
