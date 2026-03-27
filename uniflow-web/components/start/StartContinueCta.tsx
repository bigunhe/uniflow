"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Props = {
  dest: string;
  label?: string;
};

export function StartContinueCta({ dest, label = "Continue to app" }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const onContinue = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      router.replace(dest);
    } else {
      router.replace(`/login?next=${encodeURIComponent(dest)}`);
    }
  };

  return (
    <Button
      type="button"
      onClick={onContinue}
      size="lg"
      className="mt-8 h-12 w-full max-w-sm gap-2 rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-[15px] font-medium text-white shadow-lg hover:opacity-95"
    >
      {label}
      <ArrowRight className="h-4 w-4 opacity-90" strokeWidth={2} />
    </Button>
  );
}
