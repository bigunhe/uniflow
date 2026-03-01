"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { createProfile } from "../actions";

export default function ProfileSetupPage() {
  const [state, formAction] = useFormState(createProfile, { error: undefined });

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
      <h1 className="text-xl font-semibold mb-4">Profile setup</h1>

      {state?.error && (
        <p className="mb-3 p-2 bg-red-100 text-red-800 text-sm rounded">
          {state.error}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="display_name"
          placeholder="Display name"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
        />
        <input
          name="username"
          placeholder="Username (for your pulse URL)"
          required
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded w-fit"
        >
          Create profile
        </button>
      </form>
    </main>
  );
}
