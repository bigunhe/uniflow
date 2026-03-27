import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Github, Puzzle, ArrowRight, CheckCircle2 } from "lucide-react";
import { EXTENSION_LINKS } from "@/lib/start/features";

const steps = [
  "Download the latest extension ZIP using the button below.",
  "Open Chrome and go to chrome://extensions.",
  "Enable Developer Mode (top-right) and click Load unpacked.",
  "Select the extracted folder that contains manifest.json.",
  "Pin UniFlow Sync and open CourseWeb to start generating sync ZIPs.",
];

const troubleshooting = [
  {
    title: "Manifest file missing",
    detail:
      "Make sure you select the extracted folder that directly contains manifest.json.",
  },
  {
    title: "Extension does not run on page",
    detail:
      "Confirm you are on courseweb.sliit.lk and refresh the tab after loading the extension.",
  },
  {
    title: "ZIP not downloading",
    detail:
      "Open a module page first, then trigger sync again once the files list has fully loaded.",
  },
];

export default function ExtensionPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ext-root { min-height: 100vh; background: #080c14; color: #fff; font-family: 'DM Sans', sans-serif; position: relative; }
        .ext-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(0,210,180,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,180,.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .ext-wrap { position: relative; z-index: 1; width: 100%; max-width: 860px; margin: 0 auto; padding: 38px 22px 68px; }
        .ext-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .ext-title {
          font-family: 'Inter', sans-serif; font-size: clamp(30px, 4vw, 42px); font-weight: 800; letter-spacing: -.04em; line-height: 1.08;
          margin: 14px 0 12px;
        }
        .ext-kicker {
          display: inline-flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: rgba(0,210,180,.78);
        }
        .ext-sub { color: rgba(255,255,255,.42); line-height: 1.65; max-width: 700px; font-size: 15px; }
        .ext-box {
          margin-top: 24px; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; overflow: hidden;
          background: rgba(255,255,255,.03);
        }
        .ext-actions { padding: 18px; display: flex; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .ext-section { padding: 22px 22px 20px; border-bottom: 1px solid rgba(255,255,255,.06); }
        .ext-section:last-child { border-bottom: none; }
        .ext-h2 { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 10px; }
        .ext-list { list-style: none; display: grid; gap: 9px; }
        .ext-li { display: flex; gap: 10px; color: rgba(255,255,255,.7); font-size: 14px; line-height: 1.55; }
        .ext-tip-title { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: rgba(255,255,255,.9); margin-bottom: 3px; }
        .ext-tip-body { color: rgba(255,255,255,.55); font-size: 13px; line-height: 1.5; }
        @media (max-width: 560px) {
          .ext-wrap { padding: 26px 16px 56px; }
        }
      `}</style>

      <div className="ext-root">
        <div className="ext-grid" />
        <div className="ext-wrap">
          <div className="ext-top">
            <Button asChild variant="ghost" size="sm" className="text-white/45 hover:text-[#00d2b4] hover:bg-transparent px-0">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="ext-kicker">
            <Puzzle size={14} />
            Start Here - Chrome Extension
          </div>
          <h1 className="ext-title">Install UniFlow Sync before using module sync</h1>
          <p className="ext-sub">
            UniFlow Sync extracts relevant files from CourseWeb and prepares a ZIP that your
            learning sync page can process instantly. Install this once, then use it throughout
            the semester.
          </p>

          <section className="ext-box">
            <div className="ext-actions">
              <Button asChild className="bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-white">
                <a href={EXTENSION_LINKS.downloadZip} target="_blank" rel="noreferrer">
                  <Download size={16} />
                  Download ZIP
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-transparent text-white/85 hover:bg-white/5">
                <a href={EXTENSION_LINKS.repo} target="_blank" rel="noreferrer">
                  <Github size={16} />
                  View Source
                </a>
              </Button>
              <Button asChild variant="ghost" className="text-white/70 hover:text-[#00d2b4]">
                <Link href="/start/sync">
                  Continue to Sync
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>

            <div className="ext-section">
              <h2 className="ext-h2">How it works</h2>
              <p className="ext-sub">
                CourseWeb page -&gt; UniFlow Sync extension -&gt; generated ZIP -&gt; upload on
                UniFlow Sync page -&gt; module card updated in your learning hub.
              </p>
            </div>

            <div className="ext-section">
              <h2 className="ext-h2">Install in 2 minutes</h2>
              <ul className="ext-list">
                {steps.map((step, idx) => (
                  <li key={step} className="ext-li">
                    <CheckCircle2 size={17} color="rgba(0,210,180,.9)" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span>
                      {idx + 1}. {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ext-section">
              <h2 className="ext-h2">Troubleshooting</h2>
              <div className="ext-list">
                {troubleshooting.map((issue) => (
                  <div key={issue.title}>
                    <div className="ext-tip-title">{issue.title}</div>
                    <div className="ext-tip-body">{issue.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
