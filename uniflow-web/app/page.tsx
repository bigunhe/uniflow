import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-600 mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">UniFlow</h1>
          <p className="text-xl text-gray-600">Connecting mentors and students for collaborative learning</p>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Auth */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 mb-6">Get started with UniFlow by logging in or creating an account</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/student/login"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
              >
                Student Login
              </Link>
              <Link
                href="/student/register"
                className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 font-semibold transition"
              >
                Student Sign Up
              </Link>
              <Link
                href="/mentor/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Mentor Login
              </Link>
              <Link
                href="/mentor/register"
                className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-semibold transition"
              >
                Mentor Sign Up
              </Link>
            </div>
          </div>

          {/* Other Pages */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore</h2>
            <p className="text-gray-600 mb-6">Browse other sections of UniFlow</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/profile-setup"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition"
              >
                Profile Setup
              </Link>
              <Link
                href="/networking"
                className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 font-semibold transition"
              >
                Networking (Mentors & Alumni)
              </Link>
              <Link
                href="/modules"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
              >
                Learning Modules
              </Link>
              <Link
                href="/projects"
                className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 font-semibold transition"
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
              Login (Legacy)
            </Link>
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register (Legacy)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
