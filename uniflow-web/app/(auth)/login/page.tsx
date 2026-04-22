'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Extract first name from email
    const nameStr = email.split('@')[0];
    const name = nameStr ? nameStr.charAt(0).toUpperCase() + nameStr.slice(1) : '';

    setTimeout(() => {
      setIsLoading(false);
      if (userType === 'student') {
        router.push(`/student-dashboard?name=${name}`);
      } else {
        router.push(`/mentor-dashboard?name=${name}`);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="bg-gradient-to-br from-[#4747EB] via-[#7B67D1] to-[#B85393] text-white p-8 md:p-12 flex flex-col justify-between shadow-xl z-10 rounded-r-3xl">
          <div>
            <div className="inline-flex items-center gap-2 mb-12 cursor-default">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#7B67D1] shadow-md">
                <span className="text-[16px] font-bold">FP</span>
              </span>
              <span className="text-2xl font-bold">uniflow</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome back.
            </h1>
            <p className="text-[#E6E1F8] text-lg mb-8">
              Connect with your mentors, continue your learning journey, and accelerate your career growth.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Your Progress</p>
                  <p className="text-pink-100">Track your learning with personalized dashboards</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xl">🤝</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Mentor Support</p>
                  <p className="text-pink-100">Direct access to your assigned mentors</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Career Resources</p>
                  <p className="text-pink-100">Access curated learning materials & projects</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-pink-100 text-sm">© 2024 uniflow. Empowering the next generation of IT professionals.</p>
        </div>

        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
              <p className="text-gray-600">Enter your details to access your account</p>
            </div>

            <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  userType === 'student'
                    ? 'bg-white text-[#4747EB] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👨‍🎓</span> Student
              </button>
              <button
                onClick={() => setUserType('mentor')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  userType === 'mentor'
                    ? 'bg-white text-[#4747EB] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👨‍🏫</span> Mentor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B67D1] focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B67D1] focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#7B67D1] rounded border-gray-300 cursor-pointer focus:ring-[#7B67D1]"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-[#4747EB] hover:text-[#3838C7] font-semibold">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#4747EB] to-[#7B67D1] hover:from-[#3838C7] hover:to-[#5E4CBA] disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                <ArrowRight size={20} />
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#4747EB] hover:text-[#3838C7] font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
