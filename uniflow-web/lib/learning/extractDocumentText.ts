"use server";

import JSZip from "jszip";

export type ExtractTextResult = {
  text: string;
  emptyReason?: string;
};

type PdfLikeModule = {
  default?: (buffer: Buffer) => Promise<{ text?: string }>;
};

function normalizeSpace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function devDigestDebugEnabled(): boolean {
  return process.env.DEBUG_LEARNING_DIGEST === "1" || process.env.NODE_ENV === "development";
}

function logExtractHint(fileName: string, message: string): void {
  if (!devDigestDebugEnabled()) return;
  console.warn(`[learning:digest] ${fileName}: ${message}`);
}

async function extractTextFromPdf(buffer: Buffer, fileName: string): Promise<ExtractTextResult> {
  let primaryReason = "";
  try {
    const unpdf = await import("unpdf");
    if (typeof unpdf.extractText === "function" && typeof unpdf.getDocumentProxy === "function") {
      const proxy = await unpdf.getDocumentProxy(new Uint8Array(buffer));
      const extracted = await unpdf.extractText(proxy, { mergePages: true });
      const raw =
        typeof extracted === "string"
          ? extracted
          : typeof (extracted as { text?: unknown })?.text === "string"
            ? ((extracted as { text: string }).text ?? "")
            : "";
      const normalized = normalizeSpace(raw);
      if (normalized.length > 0) {
        return { text: normalized };
      }
      primaryReason = "unpdf returned empty text.";
      logExtractHint(fileName, primaryReason);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unpdf failed";
    primaryReason = `unpdf error: ${message}`;
    logExtractHint(fileName, `unpdf error: ${message}`);
  }

  try {
    const pdfParseMod = (await import("pdf-parse")) as PdfLikeModule;
    const parse = pdfParseMod.default;
    if (typeof parse !== "function") {
      return { text: "", emptyReason: "pdf-parse API mismatch." };
    }
    const parsed = await parse(buffer);
    const normalized = normalizeSpace(parsed?.text ?? "");
    if (normalized.length > 0) {
      return { text: normalized };
    }
    const reason = primaryReason
      ? `${primaryReason} Fallback parser returned empty text.`
      : "PDF text was empty after parsing.";
    return { text: "", emptyReason: reason };
  } catch (error) {
    const message = error instanceof Error ? error.message : "pdf-parse failed";
    logExtractHint(fileName, `pdf-parse error: ${message}`);
    const reason = primaryReason
      ? `${primaryReason} Fallback parse error: ${message}`
      : `PDF parse error: ${message}`;
    return { text: "", emptyReason: reason.slice(0, 180) };
  }
}

async function extractTextFromPptx(arrayBuffer: ArrayBuffer, fileName: string): Promise<ExtractTextResult> {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const slideXmlEntries = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (slideXmlEntries.length === 0) {
      return { text: "", emptyReason: "PPTX has no slide XML entries." };
    }

    const parts: string[] = [];
    for (const slidePath of slideXmlEntries) {
      const xml = await zip.files[slidePath]?.async("text");
      if (!xml) continue;
      const matches = xml.match(/<a:t[^>]*>(.*?)<\/a:t>/g) ?? [];
      for (const tag of matches) {
        const clean = normalizeSpace(
          tag
            .replace(/<a:t[^>]*>/g, "")
            .replace(/<\/a:t>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
        );
        if (clean) parts.push(clean);
      }
    }
    const joined = normalizeSpace(parts.join(" "));
    if (joined.length > 0) return { text: joined };
    return { text: "", emptyReason: "PPTX had no extractable text runs." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "pptx parse failed";
    logExtractHint(fileName, `pptx error: ${message}`);
    return { text: "", emptyReason: `PPTX parse error: ${message}`.slice(0, 180) };
  }
}

export async function extractDocumentText(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string | null
): Promise<ExtractTextResult> {
  const lower = fileName.toLowerCase();
  const mt = (mimeType ?? "").toLowerCase();
  const isPdf = mt.includes("pdf") || lower.endsWith(".pdf");
  const isPptx =
    mt.includes("presentation") ||
    mt.includes("officedocument.presentationml.presentation") ||
    lower.endsWith(".pptx");

  if (isPdf) {
    return extractTextFromPdf(Buffer.from(arrayBuffer), fileName);
  }
  if (isPptx) {
    return extractTextFromPptx(arrayBuffer, fileName);
  }
  return { text: "", emptyReason: "Unsupported type for digest (only PDF/PPTX)." };
}
