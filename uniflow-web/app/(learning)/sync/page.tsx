"use client";

import { SmartDropzone } from "@/components/learning/SmartDropzone";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";

export default function SyncPage() {
  const supabase = createClient();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setAuthChecked(true);
    });

    return () => {
      active = false;
    };
  }, [router, supabase]);

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)" }}>
        Checking your session...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "40px 16px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient glow top-right */}
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(0,210,180,.1) 0%,transparent 70%)",
            top: -180,
            right: -100,
            filter: "blur(80px)",
          }}
        />

        {/* Ambient glow bottom-left */}
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)",
            bottom: -120,
            left: -80,
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            animation: "fadeUp 0.5s ease both",
            maxWidth: 960,
            marginTop: 12,
          }}
        >
          <div style={{ padding: "0 12px 20px" }}>
            <FeatureTopbar
              backHref="/learning"
              backLabel="Learning"
              title="Sync Files"
            />
          </div>
          <SmartDropzone />
        </div>
      </div>
    </>
  );
}
