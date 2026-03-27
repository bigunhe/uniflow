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
  moduleCode: string;
  onConfirm: (moduleName: string) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function UnknownModuleModal({
  open,
  moduleCode,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: UnknownModuleModalProps) {
  const [moduleName, setModuleName] = useState("");

  const canSubmit = moduleCode.trim().length > 0 && moduleName.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onConfirm(moduleName.trim());
    setModuleName("");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
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
            We detected the module code from your ZIP name. Enter the module name
            so we can create the card and continue syncing files.
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
              Module Code (detected)
            </label>
            <Input
              placeholder="e.g. IT3010"
              value={moduleCode}
              readOnly
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                padding: "11px 14px",
                height: "auto",
                fontFamily: "'DM Sans', sans-serif",
                opacity: 0.8,
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

        <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
          <Button
            onClick={onCancel}
            disabled={isSubmitting}
            variant="outline"
            style={{
              flex: 1,
              padding: "13px 24px",
              height: "auto",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            style={{
              flex: 1.2,
              padding: "13px 24px",
              height: "auto",
              borderRadius: 12,
              background: canSubmit && !isSubmitting
                ? "linear-gradient(135deg,#00d2b4,#6366f1)"
                : "rgba(255,255,255,0.06)",
              border:
                canSubmit && !isSubmitting
                  ? "none"
                  : "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color:
                canSubmit && !isSubmitting ? "#fff" : "rgba(255,255,255,0.3)",
              cursor:
                canSubmit && !isSubmitting ? "pointer" : "not-allowed",
              transition: "all 0.18s",
            }}
          >
            {isSubmitting ? "Saving..." : "Save & Continue →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
