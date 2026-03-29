'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function UniFlowRegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/uniflow');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#EEF0F8] flex items-center justify-center p-6">
      <div className="grid md:grid-cols-2 w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-lg">

        {/* LEFT PANEL */}
        <div className="bg-gradient-to-br from-[#3D3ECC] to-[#9B3CC8] text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Start your IT journey today.
            </h1>
            <p className="opacity-90 mb-10">
              Join over 10,000+ students and mentors in the most advanced IT career guidance ecosystem.
            </p>

            <div className="space-y-4">
              <p>✔ Industry Certified Mentors</p>
              <p>✔ Personalized Career Roadmaps</p>
            </div>
          </div>

          <p className="text-sm opacity-80">
            © 2026 uniFlow. Built for the next generation.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-500 mb-6">
            Fill in your details to get started with uniFlow.
          </p>

          {/* Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-2 rounded-md ${
                userType === 'student'
                  ? 'bg-white shadow text-indigo-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('mentor')}
              className={`flex-1 py-2 rounded-md ${
                userType === 'mentor'
                  ? 'bg-white shadow text-indigo-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Mentor
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Dropdown */}
            <select className="w-full py-3 px-3 border rounded-lg bg-gray-50">
              <option>Select year and semester</option>
              <option>Year 1 - Semester 1</option>
              <option>Year 2 - Semester 2</option>
            </select>

            {/* Password */}
            <div className="flex gap-3">
              <div className="relative w-full">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 py-3 border rounded-lg bg-gray-50"
                />
              </div>

              <div className="relative w-full">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Confirm"
                  className="w-full pl-10 py-3 border rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Checkbox */}
            <label className="text-sm text-gray-600 flex gap-2 items-center">
              <input type="checkbox" />
              I agree to Terms of Service and Privacy Policy
            </label>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#5254E8] to-[#9B3CC8] hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {isLoading ? 'Loading...' : 'Register Now'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}