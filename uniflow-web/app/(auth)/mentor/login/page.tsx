'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function MentorLoginPage() {
  const [userType, setUserType] = useState<'student' | 'mentor'>('mentor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">U</span>
              </div>
              <span className="text-2xl font-bold">UniFlow</span>
            </Link>

            {/* Heading */}
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome back, mentor.
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Access your mentee profiles, manage your sessions, and continue making an impact on the next generation.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Manage Mentees</p>
                  <p className="text-blue-100">Track progress and guide your mentees effectively</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Schedule Sessions</p>
                  <p className="text-blue-100">Organize and manage mentoring sessions</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Share Resources</p>
                  <p className="text-blue-100">Provide learning materials and guidance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-blue-100 text-sm">© 2024 UniFlow. Empowering the next generation of IT professionals.</p>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
              <p className="text-gray-600">Enter your details to access your account</p>
            </div>

            {/* Role Toggle */}
            <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition ${
                  userType === 'student'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍🎓 Student
              </button>
              <button
                onClick={() => setUserType('mentor')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition ${
                  userType === 'mentor'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍🏫 Mentor
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {/* Footer Links */}
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{' '}
              <Link href={userType === 'student' ? '/student/register' : '/mentor/register'} className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
