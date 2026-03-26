import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FolderSync,
  BookOpen,
  Users,
  FolderCheck,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    icon: FolderSync,
    label: "Sync Module",
    description: "Import a ZIP from the UniFlow extension",
    href: "/sync",
  },
  {
    icon: BookOpen,
    label: "Learning",
    description: "Browse and track your module progress",
    href: "/modules",
  },
  {
    icon: Users,
    label: "Networking",
    description: "Connect with mentors and alumni",
    href: "/networking",
  },
  {
    icon: FolderCheck,
    label: "Evidence",
    description: "Submit project proof and boost your Pulse",
    href: "/evidance",
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Your employability overview",
    href: "/dashboard",
  },
];

export default function HubPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hub-root {
          min-height: 100vh;
          background: #080c14;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .hub-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(0,210,180,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,210,180,.025) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }

        /* Header */
        .hub-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hub-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .hub-logo-mark {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #00d2b4, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 13px;
          color: #fff;
          flex-shrink: 0;
        }
        .hub-logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
        }
        .hub-logo-name span { color: #00d2b4; }

        /* Main content */
        .hub-main {
          flex: 1;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px 80px;
        }

        /* Hero */
        .hub-hero {
          text-align: center;
          margin-bottom: 52px;
        }
        .hub-eyebrow {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(0,210,180,0.7);
          margin-bottom: 16px;
        }
        .hub-title {
          font-family: 'Syne', sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .hub-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.3);
          line-height: 1.6;
          font-weight: 300;
        }

        /* Nav list */
        .hub-nav {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          animation: hubFadeUp 0.4s ease both;
        }
        @keyframes hubFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hub-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
          color: inherit;
          transition: background 0.16s, border-left-color 0.16s;
          border-left: 2px solid transparent;
          position: relative;
        }
        .hub-card:last-child { border-bottom: none; }
        .hub-card:hover {
          background: rgba(0,210,180,0.05);
          border-left-color: #00d2b4;
        }
        .hub-card:hover .hub-card-icon {
          color: #00d2b4;
        }
        .hub-card:hover .hub-card-arrow {
          color: #00d2b4;
          opacity: 1;
        }

        .hub-card-icon {
          color: rgba(255,255,255,0.25);
          flex-shrink: 0;
          transition: color 0.16s;
        }

        .hub-card-body {
          flex: 1;
          min-width: 0;
        }
        .hub-card-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2px;
        }
        .hub-card-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          font-weight: 300;
        }

        .hub-card-arrow {
          color: rgba(255,255,255,0.15);
          flex-shrink: 0;
          opacity: 0.6;
          transition: color 0.16s, opacity 0.16s;
        }

        /* Footer */
        .hub-footer {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 20px 24px 28px;
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.04em;
        }

        @media (max-width: 480px) {
          .hub-header { padding: 20px; }
          .hub-title { font-size: 28px; }
          .hub-main { padding: 48px 16px 64px; }
        }
      `}</style>

      <div className="hub-root">
        <div className="hub-grid" />

        {/* Header */}
        <header className="hub-header">
          <Link href="/" className="hub-logo">
            <div className="hub-logo-mark">U</div>
            <div className="hub-logo-name">Uni<span>Flow</span></div>
          </Link>
          <Button
            asChild
            variant="ghost"
            size="sm"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </header>

        {/* Main */}
        <main className="hub-main">

          {/* Hero */}
          <div className="hub-hero">
            <div className="hub-eyebrow">University Career OS</div>
            <h1 className="hub-title">UniFlow</h1>
            <p className="hub-subtitle">
              Everything you need to track, prove, and grow your career — in one place.
            </p>
          </div>

          {/* Navigation cards */}
          <nav className="hub-nav">
            {sections.map(({ icon: Icon, label, description, href }) => (
              <Link key={href} href={href} className="hub-card">
                <Icon className="hub-card-icon" size={18} strokeWidth={1.5} />
                <div className="hub-card-body">
                  <div className="hub-card-label">{label}</div>
                  <div className="hub-card-desc">{description}</div>
                </div>
                <ArrowRight className="hub-card-arrow" size={15} strokeWidth={1.5} />
              </Link>
            ))}
          </nav>
        </main>

        {/* Footer */}
        <footer className="hub-footer">
          UniFlow &nbsp;·&nbsp; v0.1 &nbsp;·&nbsp; Beta
        </footer>
      </div>
    </>
  );
}
