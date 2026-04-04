import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FolderSync,
  BookOpen,
  Users,
  FolderCheck,
  LayoutDashboard,
  ArrowRight,
  Puzzle,
  Hammer,
} from "lucide-react";
import { UniFlowBrandLink } from "@/components/shared/UniFlowBrandLink";
import {
  START_FEATURE_COPY,
  type StartFeatureId,
} from "@/lib/start/features";

const ORDER: StartFeatureId[] = [
  "sync",
  "learning",
  "projects",
  "networking",
  "evidence",
  "dashboard",
];

const ICONS: Record<StartFeatureId, typeof FolderSync> = {
  sync: FolderSync,
  learning: BookOpen,
  projects: Hammer,
  networking: Users,
  evidence: FolderCheck,
  dashboard: LayoutDashboard,
};

const sections = ORDER.map((feature) => ({
  icon: ICONS[feature],
  label: START_FEATURE_COPY[feature].shortLabel,
  description: START_FEATURE_COPY[feature].description,
  href: `/start/${feature}`,
}));

const extensionEntry = {
  icon: Puzzle,
  label: "Chrome Extension",
  description:
    "Start here: install UniFlow Sync and export CourseWeb files in one click.",
  href: "/extension",
};

export default function HubPage() {
  const ExtensionIcon = extensionEntry.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
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
          flex-shrink: 0;
        }
        .hub-logo-name {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .hub-logo-name span { color: #00d2b4; }

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
          font-family: 'Inter', sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .hub-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          font-weight: 300;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

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
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          margin-bottom: 2px;
        }
        .hub-card-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
        }

        .hub-card-arrow {
          color: rgba(255,255,255,0.15);
          flex-shrink: 0;
          opacity: 0.6;
          transition: color 0.16s, opacity 0.16s;
        }
        .hub-start-card {
          background: linear-gradient(90deg, rgba(0,210,180,.12), rgba(99,102,241,.1));
          border-left-color: #00d2b4;
        }
        .hub-start-chip {
          position: absolute;
          top: 8px;
          right: 12px;
          font-size: 10px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: rgba(0,210,180,.95);
          border: 1px solid rgba(0,210,180,.4);
          border-radius: 999px;
          padding: 2px 8px;
          background: rgba(0,210,180,.08);
        }

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

      <div className="hub-root brand-dark-shell">
        <div className="hub-grid" />

        <header className="hub-header">
          <UniFlowBrandLink variant="dark" size="lg" className="hub-logo" />
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

        <main className="hub-main">
          <div className="hub-hero">
            <div className="hub-eyebrow">Install extension first · then sync and learn faster</div>
            <h1 className="hub-title">UniFlow</h1>
            <p className="hub-subtitle">
              Start by installing UniFlow Sync, then import CourseWeb files into your learning
              hub, build evidence, and grow career-ready skills.
            </p>
          </div>

          <nav className="hub-nav">
            <Link href={extensionEntry.href} className="hub-card hub-start-card">
              <span className="hub-start-chip">Start Here</span>
              <ExtensionIcon className="hub-card-icon" size={18} strokeWidth={1.5} />
              <div className="hub-card-body">
                <div className="hub-card-label">{extensionEntry.label}</div>
                <div className="hub-card-desc">{extensionEntry.description}</div>
              </div>
              <ArrowRight className="hub-card-arrow" size={15} strokeWidth={1.5} />
            </Link>
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

        <footer className="hub-footer">
          UniFlow &nbsp;·&nbsp; v0.1 &nbsp;·&nbsp; Beta
        </footer>
      </div>
    </>
  );
}
