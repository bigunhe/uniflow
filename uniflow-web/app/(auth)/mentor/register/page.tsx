'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, User, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

export default function MentorRegisterPage() {
  const [userType, setUserType] = useState<'student' | 'mentor'>('mentor');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const specializations = [
    'Software Engineering',
    'Interactive Media',
    'Information System Engineering',
    'Data Science',
    'Cyber Security',
    'Network Engineering',
    'Computer Science',
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
              Share your expertise.
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of mentors shaping the next generation. Guide students, share knowledge, and make a real impact.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Help Students Grow</p>
                  <p className="text-blue-100">Guide the next generation of IT professionals</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Build Your Legacy</p>
                  <p className="text-blue-100">Create personalized learning paths for mentees</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Network</p>
                  <p className="text-blue-100">Connect with mentors and industry leaders</p>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Create an account</h2>
              <p className="text-gray-600">Fill in your details to get started with UniFlow</p>
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
              {/* Full Name */}
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

              {/* Email */}
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
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialization
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-3 text-gray-400" size={20} />
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-gray-50"
                    required
                  >
                    <option value="">Select your field</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Fields */}
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

              {/* Terms Checkbox */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating account...' : 'Register Now'}
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Footer Link */}
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
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Mentor</h1>
            <p className="text-gray-600">Create your mentor account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
                  required
                >
                  <option value="">Select your specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 mt-0.5"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/mentor/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>

          {/* Role Switch */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Are you a student?</p>
            <Link
              href="/student/register"
              className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
            >
              Switch to Student Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
