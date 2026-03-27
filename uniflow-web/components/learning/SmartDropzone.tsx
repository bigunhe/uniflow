"use client";

import { useState, useCallback, type CSSProperties } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { UnknownModuleModal } from "./UnknownModuleModal";
import { createClient } from "@/lib/supabase/client";
import {
  extractModuleCodeFromZipName,
  getLearningModuleByCode,
  syncLearningModuleUpload,
  type ExtractedZipFile,
} from "@/lib/learning/sync";

type DropzoneStatus = "idle" | "processing";

export function SmartDropzone() {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState<DropzoneStatus>("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [detectedModuleCode, setDetectedModuleCode] = useState("");
  const [pendingSyncFiles, setPendingSyncFiles] = useState<ExtractedZipFile[]>([]);
  const [extractedFiles, setExtractedFiles] = useState<string[]>([]);

  const guessMimeType = (fileName: string): string => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) return "application/pdf";
    if (lower.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
    if (lower.endsWith(".pptx")) {
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    }
    if (lower.endsWith(".doc")) return "application/msword";
    if (lower.endsWith(".docx")) {
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
    if (lower.endsWith(".txt")) return "text/plain";
    if (lower.endsWith(".csv")) return "text/csv";
    if (lower.endsWith(".md")) return "text/markdown";
    return "application/octet-stream";
  };

  const extractZipFiles = async (file: File): Promise<ExtractedZipFile[]> => {
    const zip = new JSZip();
    const loaded = await zip.loadAsync(file);
    const files: ExtractedZipFile[] = [];
    const seenNames = new Map<string, number>();

    for (const entry of Object.values(loaded.files)) {
      if (
        entry.dir ||
        entry.name.includes("__MACOSX") ||
        entry.name.includes(".DS_Store")
      ) {
        continue;
      }

      const fileName = entry.name.split("/").pop();
      if (!fileName) continue;

      const seen = seenNames.get(fileName) ?? 0;
      const finalFileName =
        seen === 0
          ? fileName
          : `${fileName.replace(/(\.[^.]*)?$/, "")} (${seen + 1})${
              fileName.includes(".") ? `.${fileName.split(".").pop()}` : ""
            }`;
      seenNames.set(fileName, seen + 1);

      const blob = await entry.async("blob");
      files.push({
        relativePath: entry.name,
        fileName: finalFileName,
        blob,
        mimeType: guessMimeType(finalFileName),
      });
    }

    return files;
  };

  const processZip = useCallback(
    async (moduleCode: string, moduleName: string, files: ExtractedZipFile[]) => {
      setStatus("processing");
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("Please log in first to sync files.");
          router.replace("/login");
          return;
        }

        const result = await syncLearningModuleUpload({
          supabase,
          userId: user.id,
          moduleCode,
          moduleName,
          files,
        });

        setExtractedFiles(files.map((entry) => entry.fileName));
        if (result.failedFiles.length > 0) {
          toast.warning(
            `Synced ${result.uploadedCount}/${files.length} files. Some files failed to upload.`
          );
        } else {
          toast.success(
            `Synced ${result.uploadedCount} file${result.uploadedCount === 1 ? "" : "s"} to ${result.module.module_code}.`
          );
        }

        router.replace(`/learning/${result.module.module_code}`);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not sync files right now."
        );
      } finally {
        setStatus("idle");
      }
    },
    [router, supabase]
  );

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const moduleCode = extractModuleCodeFromZipName(file.name);

      if (!moduleCode || moduleCode.length < 6) {
        toast.error("Could not detect module code from zip name.");
        return;
      }

      setDetectedModuleCode(moduleCode);

      try {
        const files = await extractZipFiles(file);
        if (!files.length) {
          toast.error("No valid files found inside the ZIP.");
          return;
        }

        setExtractedFiles(files.map((entry) => entry.fileName));

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("Please log in first to sync files.");
          router.replace("/login");
          return;
        }

        const existingModule = await getLearningModuleByCode(
          supabase,
          user.id,
          moduleCode
        );

        if (existingModule) {
          await processZip(moduleCode, existingModule.module_name, files);
          return;
        }

        setPendingSyncFiles(files);
        setModalOpen(true);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to read the ZIP file."
        );
      }
    },
    [processZip, router, supabase]
  );

  const onDropRejected = useCallback(() => {
    toast.error("Invalid upload. Please upload the single .zip file generated by the extension.", {
      duration: 4000,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: { "application/zip": [".zip"] },
    maxFiles: 1,
    disabled: status === "processing",
  });

  const handleModalConfirm = async (moduleName: string) => {
    if (!pendingSyncFiles.length || !detectedModuleCode) return;
    setModalOpen(false);
    await processZip(detectedModuleCode, moduleName, pendingSyncFiles);
    setPendingSyncFiles([]);
  };

  const handleModalCancel = () => {
    if (status === "processing") return;
    setModalOpen(false);
    setPendingSyncFiles([]);
  };

  const isProcessing = status === "processing";

  const dropzoneStyle: CSSProperties = {
    border: isProcessing
      ? "2px solid rgba(0,210,180,0.3)"
      : isDragActive
      ? "2px solid #00d2b4"
      : "2px dashed rgba(255,255,255,0.12)",
    borderRadius: 20,
    background: isProcessing
      ? "rgba(0,210,180,0.04)"
      : isDragActive
      ? "rgba(0,210,180,0.06)"
      : "transparent",
    padding: "60px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    cursor: isProcessing ? "default" : "pointer",
    transition: "all 0.2s ease",
    minHeight: 320,
    position: "relative",
    outline: "none",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes uniflow-spin { to { transform: rotate(360deg); } }
        @keyframes uniflow-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .uniflow-dropzone-wrap * { box-sizing: border-box; }
        .uniflow-dropzone-icon-ring {
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(0,210,180,0.1);
          border: 1px solid rgba(0,210,180,0.2);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .uniflow-dropzone-icon-ring.active {
          background: rgba(0,210,180,0.18);
          border-color: rgba(0,210,180,0.45);
          box-shadow: 0 0 24px rgba(0,210,180,0.25);
        }
        .uniflow-spinner {
          width: 44px; height: 44px; border-radius: 50%;
          border: 3px solid rgba(0,210,180,0.15);
          border-top-color: #00d2b4;
          animation: uniflow-spin 0.85s linear infinite;
        }
        .uniflow-pulse-dots {
          display: flex; gap: 6px; align-items: center;
        }
        .uniflow-pulse-dot {
          width: 6px; height: 6px; border-radius: 50%; background: rgba(0,210,180,0.6);
          animation: uniflow-pulse 1.2s ease-in-out infinite;
        }
        .uniflow-pulse-dot:nth-child(2) { animation-delay: 0.2s; }
        .uniflow-pulse-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="uniflow-dropzone-wrap" style={{ width: "100%", maxWidth: 620, margin: "0 auto" }}>

        {/* Header above dropzone */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,210,180,0.1)",
              border: "1px solid rgba(0,210,180,0.2)",
              borderRadius: 99,
              padding: "3px 14px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#00d2b4",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            UniFlow Sync
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 32,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            Import your module files
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.6,
            }}
          >
            Drop the ZIP generated by the UniFlow extension to get started.
          </p>
        </div>

        {/* Drop area */}
        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />

          {isProcessing ? (
            <>
              <div className="uniflow-spinner" />
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#00d2b4",
                  marginTop: 8,
                }}
              >
                Analyzing module data...
              </div>
              <div className="uniflow-pulse-dots" style={{ marginTop: 4 }}>
                <div className="uniflow-pulse-dot" />
                <div className="uniflow-pulse-dot" />
                <div className="uniflow-pulse-dot" />
              </div>
              {extractedFiles.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {extractedFiles.length} file{extractedFiles.length !== 1 ? "s" : ""} detected
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`uniflow-dropzone-icon-ring${isDragActive ? " active" : ""}`}>
                <UploadCloud
                  size={32}
                  color={isDragActive ? "#00d2b4" : "rgba(255,255,255,0.4)"}
                  strokeWidth={1.5}
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: isDragActive ? "#00d2b4" : "rgba(255,255,255,0.85)",
                    marginBottom: 8,
                    transition: "color 0.2s",
                  }}
                >
                  {isDragActive
                    ? "Drop to extract module files..."
                    : "Drop your UniFlow Sync ZIP here"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Only .zip files generated by the UniFlow extension are supported.
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  maxWidth: 320,
                  marginTop: 8,
                }}
              >
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
                  or
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Browse button */}
              <button
                type="button"
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                Browse files
              </button>

              {/* Format hint */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  marginTop: 4,
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
                  Expected format:
                </span>
                <code
                  style={{
                    fontSize: 11,
                    color: "rgba(0,210,180,0.6)",
                    fontFamily: "monospace",
                    background: "rgba(0,210,180,0.06)",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  [ModuleCode]_UniFlow_Sync.zip
                </code>
              </div>
            </>
          )}
        </div>
      </div>

      <UnknownModuleModal
        open={modalOpen}
        moduleCode={detectedModuleCode}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        isSubmitting={isProcessing}
      />
    </>
  );
}
