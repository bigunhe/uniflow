import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartContinueCta } from "@/components/start/StartContinueCta";
import {
  isStartFeatureId,
  START_FEATURE_COPY,
  START_FEATURE_IDS,
} from "@/lib/start/features";

export function generateStaticParams() {
  return START_FEATURE_IDS.map((feature) => ({ feature }));
}

type Props = { params: Promise<{ feature: string }> };

export default async function StartFeaturePage({ params }: Props) {
  const { feature } = await params;
  if (!isStartFeatureId(feature)) notFound();

  const copy = START_FEATURE_COPY[feature];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .start-root{min-height:100vh;background:#080c14;font-family:'DM Sans',sans-serif;color:#fff;display:flex;flex-direction:column;}
        .start-grid{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,210,180,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.025) 1px,transparent 1px);background-size:48px 48px;z-index:0;}
        .start-inner{position:relative;z-index:1;flex:1;max-width:560px;margin:0 auto;padding:32px 24px 64px;width:100%;}
        .start-back{margin-bottom:28px;}
        .start-title{font-family:'Inter',sans-serif;font-size:28px;font-weight:700;letter-spacing:-.03em;line-height:1.15;margin-bottom:12px;}
        .start-intro{font-size:15px;font-weight:300;line-height:1.65;color:rgba(255,255,255,.42);margin-bottom:28px;}
        .start-list{list-style:none;display:flex;flex-direction:column;gap:14px;}
        .start-li{font-size:13px;line-height:1.55;color:rgba(255,255,255,.52);padding-left:18px;position:relative;}
        .start-li::before{content:'';position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#00d2b4,#6366f1);}
      `}</style>
      <div className="start-root">
        <div className="start-grid" aria-hidden />
        <div className="start-inner">
          <div className="start-back">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-0 text-[13px] text-white/40 hover:bg-transparent hover:text-[#00d2b4]"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Hub
              </Link>
            </Button>
          </div>
          <h1 className="start-title">{copy.title}</h1>
          <p className="start-intro">{copy.intro}</p>
          <ul className="start-list">
            {copy.bullets.map((b) => (
              <li key={b} className="start-li">
                {b}
              </li>
            ))}
          </ul>
          <StartContinueCta dest={copy.dest} />
        </div>
      </div>
    </>
  );
}
