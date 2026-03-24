'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, User, BookOpen, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

async function handleRegistration(
  fullName: string,
  email: string,
  specialization: string,
  password: string,
  confirmPassword: string,
  userType: 'student' | 'mentor'
) {
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Validate
  if (!fullName.trim()) {
    return { success: false, error: 'Full name is required' };
  }

  if (!normalizedEmail.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }

  if (!specialization) {
    return { success: false, error: 'Please select a specialization' };
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
        specialization,
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
  const [userType, setUserType] = useState<'student' | 'mentor'>('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setMessage(null);
    setIsLoading(true);

    const result = await handleRegistration(
      formData.fullName,
      formData.email,
      formData.specialization,
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
        specialization: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });
    } else {
      setMessage({ type: 'error', text: result.error || 'Registration failed' });
    }
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
              Start your tech journey today.
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of students learning from industry experts. Get personalized mentorship and accelerate your career.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Expert Mentors</p>
                  <p className="text-blue-100">Learn from industry-certified professionals</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Career Roadmap</p>
                  <p className="text-blue-100">Personalized guidance for your IT career</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Community</p>
                  <p className="text-blue-100">Connect with 10,000+ students & mentors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-blue-100 text-sm">© 2024 UniFlow. Empowering the next generation of IT professionals.</p>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center p-6 md:p-12 overflow-y-auto">
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

            {/* Messages */}
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
                    placeholder="john@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email will be normalized to lowercase</p>
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

              {/* Password Requirements */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• At least 8 characters</li>
                  <li>• One uppercase letter (A-Z)</li>
                  <li>• One lowercase letter (a-z)</li>
                  <li>• One number (0-9)</li>
                </ul>
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
              Start your tech journey today.
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of students learning from industry experts. Get personalized mentorship and accelerate your career.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Expert Mentors</p>
                  <p className="text-blue-100">Learn from industry-certified professionals</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Career Roadmap</p>
                  <p className="text-blue-100">Personalized guidance for your IT career</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Community</p>
                  <p className="text-blue-100">Connect with 10,000+ students & mentors</p>
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
                    placeholder="john@university.edu"
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
