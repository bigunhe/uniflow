'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Mentor';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi, {name}!</h1>
      <p className="text-xl text-gray-600 mb-8">Welcome to your Mentor Dashboard. Ready to inspire the next generation?</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 text-2xl">👨‍🎓</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">My Mentees</h2>
          <p className="text-sm text-gray-600 mb-4">View your assigned students and their progress.</p>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View Roster →</button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4 text-2xl">💬</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Messages</h2>
          <p className="text-sm text-gray-600 mb-4">Check in with students needing guidance.</p>
          <Link href="/mentor-messages" className="text-sm font-semibold text-rose-600 hover:text-rose-700 block">Open Inbox →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-2xl">📅</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Schedule</h2>
          <p className="text-sm text-gray-600 mb-4">Manage your availability and upcoming sessions.</p>
          <button className="text-sm font-semibold text-amber-600 hover:text-amber-700">Manage Calendar →</button>
        </div>
      </div>
    </div>
  );
}

export default function MentorDashboardPage() {
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
            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">Mentor</span>
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
