import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { MentorBreadcrumbs } from "./_components/MentorBreadcrumbs";
import { MentorFooter } from "./_components/MentorFooter";
import { MentorHeader } from "./_components/MentorHeader";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        jakarta.className,
        "min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_48%,_#f1f5f9)] text-slate-900",
      )}
    >
      <MentorHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MentorBreadcrumbs />
        {children}
      </main>
      <MentorFooter />
    </div>
  );
}
