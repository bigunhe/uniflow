"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SearchVectorItemProps {
  query: string;
  sourceFiles?: string[];
}

export function SearchVectorItem({ query, sourceFiles }: SearchVectorItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      toast.success("Copied! Paste into Google or ChatGPT and actually find out.", {
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  const fromLine =
    sourceFiles && sourceFiles.length > 0
      ? `From: ${sourceFiles.join(", ")}`
      : null;

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-white/65 group-hover:text-white/80">
          {query}
        </p>
        {fromLine && (
          <p className="mt-1.5 text-[11px] leading-snug text-white/30">{fromLine}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => void handleCopy()}
        title="Copy to clipboard"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/25 transition-all hover:bg-white/10 hover:text-white/70"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[#00d2b4]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
