import { AuthHeader } from "@/components/shared/AuthHeader";

type AuthMarketingLayoutProps = {
  children: React.ReactNode;
  /** e.g. Login on register page, Register on login page */
  headerCta?: { href: string; label: string };
  headerCtaVariant?: "primary" | "muted";
};

export function AuthMarketingLayout({
  children,
  headerCta = { href: "/login", label: "Login" },
  headerCtaVariant = "primary",
}: AuthMarketingLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#ede9fe_0%,#ffffff_45%,#eef2ff_100%)]">
      <AuthHeader cta={headerCta} ctaVariant={headerCtaVariant} />

      <main className="flex-1 flex items-center justify-center px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        {children}
      </main>

      <footer className="py-6 text-center text-xs text-gray-500 px-4">
        © {year} UniFlow. All rights reserved. Built for the next generation of IT
        professionals.
      </footer>
    </div>
  );
}
