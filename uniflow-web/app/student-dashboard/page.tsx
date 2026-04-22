'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SpecializationChatbot } from '@/components/shared/SpecializationChatbot';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Student';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi, {name}!</h1>
      <p className="text-xl text-gray-600 mb-8">Welcome to your Student Dashboard. We're excited to have you here.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl">📚</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Learning Path</h2>
          <p className="text-sm text-gray-600">Continue your progress and explore new modules.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🤝</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Find a Mentor</h2>
          <p className="text-sm text-gray-600 mb-4">Connect with industry experts.</p>
          <Link href="/networking/mentors" className="text-sm font-semibold text-purple-600 hover:text-purple-700">Browse Mentors →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🎯</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Specialization</h2>
          <p className="text-sm text-gray-600 mb-4">Choose your unique IT journey.</p>
          <Link href="/specialization" className="text-sm font-semibold text-green-600 hover:text-green-700">Explore Fields →</Link>
        </div>
      </div>

      <SpecializationChatbot />
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <span className="text-xs font-bold">FP</span>
            </span>
            <span className="text-xl font-bold text-indigo-900">uniflow</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">Student</span>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800 font-medium">Log out</Link>
          </div>
        </div>
      </header>

      <main>
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading your dashboard...</div>}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
