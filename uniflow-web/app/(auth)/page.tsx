'use client';

import Link from 'next/link';
import { Users, BookOpen, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main Container */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 mb-6">
            <span className="text-white font-bold text-3xl">U</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Uniflow</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A platform connecting mentors and students for collaborative learning and growth
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Student Card */}
          <Link href="/student/login">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer h-full">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-green-100 mb-6">
                <BookOpen className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Student</h2>
              <p className="text-gray-600 mb-6">
                Learn from experienced mentors, get guidance, and accelerate your career growth
              </p>
              <div className="space-y-3">
                <Link
                  href="/student/login"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  Sign In
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/student/register"
                  className="flex items-center justify-center gap-2 w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Create Account
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </Link>

          {/* Mentor Card */}
          <Link href="/mentor/login">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer h-full">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-100 mb-6">
                <Users className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Mentor</h2>
              <p className="text-gray-600 mb-6">
                Share your expertise, guide the next generation of professionals, and make an impact
              </p>
              <div className="space-y-3">
                <Link
                  href="/mentor/login"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  Sign In
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/mentor/register"
                  className="flex items-center justify-center gap-2 w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Create Account
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            By continuing, you agree to our{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
