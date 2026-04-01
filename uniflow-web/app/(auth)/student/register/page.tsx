'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, User, BookOpen, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

async function handleRegistration(
  fullName: string,
  email: string,
  yearAndSemester: string,
  password: string,
  confirmPassword: string,
  userType: 'student' | 'mentor'
) {
  const normalizedEmail = email.toLowerCase().trim();

  if (!fullName.trim()) {
    return { success: false, error: 'Full name is required' };
  }

  if (!normalizedEmail.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }

  if (!yearAndSemester) {
    return { success: false, error: 'Please select year and semester' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { success: false, error: 'Password must contain an uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { success: false, error: 'Password must contain a lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { success: false, error: 'Password must contain a number' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        fullName,
        yearAndSemester,
        userType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    return { success: true, message: data.message || 'Account created successfully!' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export default function StudentRegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    yearAndSemester: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const yearAndSemesterOptions = [
    'Year 1 - Semester 1',
    'Year 1 - Semester 2',
    'Year 2 - Semester 1',
    'Year 2 - Semester 2',
    'Year 3 - Semester 1',
    'Year 3 - Semester 2',
    'Year 4 - Semester 1',
    'Year 4 - Semester 2',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const result = await handleRegistration(
      formData.fullName,
      formData.email,
      formData.yearAndSemester,
      formData.password,
      formData.confirmPassword,
      userType
    );

    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Account created successfully!' });
      setFormData({
        fullName: '',
        email: '',
        yearAndSemester: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });
      router.push('/uniflow');
    } else {
      setMessage({ type: 'error', text: result.error || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="bg-gradient-to-r from-[#3B82F6] via-[#4F46E5] to-[#A855F7] text-white p-8 md:p-12 flex flex-col justify-between rounded-r-3xl">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <img src="/logo.svg" alt="FuturePath Hub" className="h-10 w-10" />
              <span className="text-2xl font-bold">FuturePath Hub</span>
            </Link>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start your IT journey today.
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Join over 10,000+ students and mentors in the most advanced IT career guidance ecosystem.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xl">🎓</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Industry Certified Mentors</p>
                  <p className="text-blue-100 text-sm">Grow real skills with proven leaders.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">Personalized Career Roadmaps</p>
                  <p className="text-blue-100 text-sm">Find the fastest path to your dream role.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-blue-100 text-sm">© 2024 FuturePath Hub. All rights reserved. Built for the next generation of IT professionals.</p>
        </div>

        <div className="flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Create an account</h2>
              <p className="text-gray-600">Fill in your details to get started with FuturePath Hub.</p>
            </div>

            <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  userType === 'student'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👨‍🎓</span> Student
              </button>
              <button
                onClick={() => setUserType('mentor')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  userType === 'mentor'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👨‍🏫</span> Mentor
              </button>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  message.type === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="text-red-600 mt-0.5" size={20} />
                ) : (
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                )}
                <p className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email will be normalized to lowercase</p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Year</h3>
                <label htmlFor="yearAndSemester" className="block text-sm font-semibold text-gray-700 mb-2">
                  Year and Semester
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-3 text-gray-400" size={20} />
                  <select
                    id="yearAndSemester"
                    name="yearAndSemester"
                    value={formData.yearAndSemester}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-gray-50"
                    required
                  >
                    <option value="">Select year and semester</option>
                    {yearAndSemesterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 mt-0.5 cursor-pointer"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="w-full bg-gradient-to-r from-blue-700 to-violet-600 hover:from-blue-800 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating account...' : 'ragister Now'}
                <ArrowRight size={20} />
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link href={userType === 'student' ? '/student/login' : '/mentor/login'} className="text-blue-600 hover:text-blue-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

