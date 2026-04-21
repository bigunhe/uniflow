'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

async function handleRegistration(
  fullName: string,
  email: string,
  company: string,
  jobTitle: string,
  yearsOfExperience: string,
  primaryExpertise: string,
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

  if (!company.trim()) {
    return { success: false, error: 'Company/Organization is required' };
  }

  if (!jobTitle.trim()) {
    return { success: false, error: 'Job title is required' };
  }

  const years = Number(yearsOfExperience);
  if (!yearsOfExperience.trim() || Number.isNaN(years) || years < 0) {
    return { success: false, error: 'Please provide years of experience as a valid non-negative number' };
  }

  if (!primaryExpertise.trim()) {
    return { success: false, error: 'Primary area of expertise is required' };
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
        company,
        jobTitle,
        yearsOfExperience,
        primaryExpertise,
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

export default function MentorRegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'mentor'>('mentor');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    yearsOfExperience: '',
    primaryExpertise: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      formData.company,
      formData.jobTitle,
      formData.yearsOfExperience,
      formData.primaryExpertise,
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
        company: '',
        jobTitle: '',
        yearsOfExperience: '',
        primaryExpertise: '',
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
        {/* Left Sidebar */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 mb-12">
              <img src="/logo.svg" alt="uniflow" className="h-10 w-10" />
              <span className="text-2xl font-bold">uniflow</span>
            </Link>

            {/* Heading */}
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start your IT journey today.
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Join over 10,000+ students and mentors in the most advanced IT career guidance ecosystem.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="text-3xl flex-shrink-0">✓</div>
                <div>
                  <p className="font-semibold text-lg">Industry Certified Mentors</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-3xl flex-shrink-0">🚀</div>
                <div>
                  <p className="font-semibold text-lg">Personalized Career Roadmaps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-blue-100 text-sm">© 2024 uniflow. Empowering the next generation of IT professionals.</p>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Create an account</h2>
              <p className="text-gray-600">Fill in your details to get started with uniflow</p>
            </div>

            {/* Role Toggle */}
            <div className="flex gap-3 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  userType === 'student'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👨‍🎓</span> Student
              </button>
              <button
                onClick={() => setUserType('mentor')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                  userType === 'mentor'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">👨‍🏫</span> Mentor
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
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company / Organization
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="FutureTech Inc."
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    type="text"
                    placeholder="Senior Product Lead"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    placeholder="8"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="primaryExpertise" className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Area of Expertise
                  </label>
                  <select
                    id="primaryExpertise"
                    name="primaryExpertise"
                    value={formData.primaryExpertise}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
                    required
                  >
                    <option value="">Select specialization</option>
                    <option value="software">Software Engineering</option>
                    <option value="product">Product Management</option>
                    <option value="data">Data Science</option>
                    <option value="design">UX/UI Design</option>
                    <option value="security">Cybersecurity</option>
                    <option value="cloud">Cloud Architecture</option>
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
                {isLoading ? 'Creating account...' : 'Become a Mentor'}
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
