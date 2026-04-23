"use client";

import Link from "next/link";
import { MentorProfile } from "../../_data/mockData";
import { MessageCircle, Briefcase, Clock } from "lucide-react";
import Image from "next/image";

export default function MentorCard({ mentor }: { mentor: MentorProfile }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(245,158,11,0.15)] bg-[rgba(255,255,255,0.03)] p-6 shadow-sm transition hover:bg-[rgba(255,255,255,0.05)] hover:shadow-md hover:ring-1 hover:ring-[rgba(245,158,11,0.3)]">
      <div className="flex items-start justify-between gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-[rgba(255,255,255,0.1)]">
          {/* Fallback avatar if Image fails or src is remote without config */}
          <div className="flex h-full w-full items-center justify-center bg-[rgba(245,158,11,0.2)] text-xl font-bold text-[#f59e0b]">
            {mentor.name.charAt(0)}
          </div>
          {mentor.image && (
            <img 
              src={mentor.image} 
              alt={mentor.name} 
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          <span 
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ring-2 ring-[#080c14] ${mentor.online ? 'bg-emerald-500' : 'bg-slate-500'}`}
          />
        </div>
        <Link 
          href={`/networking/messages/${mentor.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(245,158,11,0.1)] text-[#f59e0b] ring-1 ring-[rgba(245,158,11,0.3)] transition hover:bg-[rgba(245,158,11,0.2)]"
        >
          <MessageCircle className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-[#f0f4fb]">{mentor.name}</h3>
        
        <div className="mt-3 space-y-2 text-sm text-[rgba(168,184,208,0.85)]">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[rgba(168,184,208,0.6)]" />
            <span>{mentor.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[rgba(168,184,208,0.6)]" />
            <span>{mentor.experience} Experience</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/networking/messages/${mentor.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
        >
          Message {mentor.name.split(' ')[0]}
        </Link>
      </div>
    </div>
  );
}
