import { getAlumni, createAlumni, deleteAlumni } from "./actions";
import Link from "next/link";

export default async function AlumniPage() {
  const alumni = await getAlumni();

  return (
    <main className="p-6 max-w-lg">
      <div className="mb-4">
        <Link href="/networking" className="text-blue-600 hover:underline">
          ← Networking
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Alumni</h1>

      <form action={createAlumni} className="flex flex-col gap-2 mb-6">
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
        <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded w-fit">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {alumni.map((a) => (
          <li key={a.id} className="flex items-center justify-between border-b pb-2">
            <span>{a.name} — {a.email ?? "(no email)"}</span>
            <form action={deleteAlumni.bind(null, a.id)}>
              <button type="submit" className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      {alumni.length === 0 && <p className="text-gray-500">No alumni yet. Add one above.</p>}
    </main>
  );
}
