"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UnknownModuleModalProps {
  open: boolean;
  onConfirm: (moduleCode: string, moduleName: string) => void;
}

export function UnknownModuleModal({ open, onConfirm }: UnknownModuleModalProps) {
  const [moduleCode, setModuleCode] = useState("");
  const [moduleName, setModuleName] = useState("");

  const canSubmit = moduleCode.trim().length > 0 && moduleName.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm(moduleCode.trim().toUpperCase(), moduleName.trim());
    setModuleCode("");
    setModuleName("");
  };

  return (
    <Dialog open={open}>
      <DialogContent
        style={{
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "32px",
          maxWidth: 460,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        `}</style>

        <DialogHeader style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 99,
              padding: "3px 12px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#818cf8",
              textTransform: "uppercase",
              marginBottom: 12,
              width: "fit-content",
            }}
          >
            Manual Entry Required
          </div>
          <DialogTitle
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              textAlign: "left",
            }}
          >
            Module Not Detected
          </DialogTitle>
          <DialogDescription
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              textAlign: "left",
              marginTop: 8,
            }}
          >
            We couldn&apos;t automatically detect the module from the file name.
            Please enter the details below to continue.
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 8,
              }}
            >
              Module Code *
            </label>
            <Input
              placeholder="e.g. IT3010"
              value={moduleCode}
              onChange={(e) => setModuleCode(e.target.value.toUpperCase())}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                padding: "11px 14px",
                height: "auto",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 8,
              }}
            >
              Module Name *
            </label>
            <Input
              placeholder="e.g. Network Design"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                padding: "11px 14px",
                height: "auto",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "13px 24px",
              height: "auto",
              borderRadius: 12,
              background: canSubmit
                ? "linear-gradient(135deg,#00d2b4,#6366f1)"
                : "rgba(255,255,255,0.06)",
              border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: canSubmit ? "#fff" : "rgba(255,255,255,0.3)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "all 0.18s",
            }}
          >
            Save &amp; Continue →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
