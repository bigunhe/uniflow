import Link from "next/link";
import { Suspense } from "react";

async function BackendStatus() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/health", { cache: "no-store" });
    if (!res.ok) throw new Error("Not OK");
    const data = await res.json();
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm mt-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-700 font-medium text-sm">Backend Connected: {data.status}</span>
      </div>
    );
  } catch (e) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 shadow-sm mt-4">
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
        <span className="text-rose-700 font-medium text-sm">Backend Disconnected</span>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-600 mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">uniflow</h1>
          <p className="text-xl text-gray-600">Connecting mentors and students for collaborative learning</p>
          <Suspense fallback={
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mt-4">
              <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></span>
              <span className="text-slate-600 font-medium text-sm">Checking Connection...</span>
            </div>
          }>
            <BackendStatus />
          </Suspense>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Auth */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 mb-6">Get started with uniflow by logging in or creating an account</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition text-center shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-block px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold transition text-center"
              >
                Create an Account
              </Link>
            </div>
          </div>

          {/* Other Pages */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore</h2>
            <p className="text-gray-600 mb-6">Browse other sections of uniflow</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/profile-setup"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition text-center"
              >
                Profile Setup
              </Link>
              <Link
                href="/networking"
                className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 font-semibold transition text-center"
              >
                Networking (Mentors & Alumni)
              </Link>
              <Link
                href="/modules"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition text-center"
              >
                Learning Modules
              </Link>
              <Link
                href="/projects"
                className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 font-semibold transition text-center"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Home
            </Link>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </Link>
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
