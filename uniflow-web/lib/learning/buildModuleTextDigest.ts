import type { LearningFileRow } from "@/lib/learning/sync";
import { extractDocumentText } from "@/lib/learning/extractDocumentText";

export const MODULE_TEXT_DIGEST_MAX_CHARS = 100_000;

export type ModuleDigestSkip = {
  name: string;
  reason: string;
};

export type ModuleDigestResult = {
  digest: string;
  truncated: boolean;
  filesIncluded: string[];
  filesSkipped: ModuleDigestSkip[];
};

function appendClamped(
  target: string,
  chunk: string,
  maxChars: number
): { value: string; truncated: boolean } {
  if (target.length >= maxChars) return { value: target, truncated: true };
  const next = `${target}${chunk}`;
  if (next.length <= maxChars) return { value: next, truncated: false };
  return { value: next.slice(0, maxChars), truncated: true };
}

export async function buildModuleTextDigest(args: {
  fileRows: LearningFileRow[];
  download: (row: LearningFileRow) => Promise<ArrayBuffer | null>;
  maxChars?: number;
}): Promise<ModuleDigestResult> {
  const maxChars = args.maxChars ?? MODULE_TEXT_DIGEST_MAX_CHARS;
  let digest = "";
  let truncated = false;
  const filesIncluded: string[] = [];
  const filesSkipped: ModuleDigestSkip[] = [];

  for (const row of args.fileRows) {
    const lower = row.original_name.toLowerCase();
    const mt = (row.mime_type ?? "").toLowerCase();
    const eligible =
      mt.includes("pdf") ||
      mt.includes("presentation") ||
      mt.includes("officedocument.presentationml.presentation") ||
      lower.endsWith(".pdf") ||
      lower.endsWith(".pptx");

    if (!eligible) {
      filesSkipped.push({ name: row.original_name, reason: "Skipped non PDF/PPTX file." });
      continue;
    }

    const payload = await args.download(row);
    if (!payload) {
      filesSkipped.push({ name: row.original_name, reason: "Could not download file from storage." });
      continue;
    }

    const extracted = await extractDocumentText(payload, row.original_name, row.mime_type);
    const text = extracted.text.trim();
    if (!text) {
      filesSkipped.push({
        name: row.original_name,
        reason: extracted.emptyReason ?? "No extractable text.",
      });
      continue;
    }

    const block = `\n\n### FILE: ${row.original_name}\n${text}\n`;
    const merged = appendClamped(digest, block, maxChars);
    digest = merged.value;
    truncated ||= merged.truncated;
    filesIncluded.push(row.original_name);
    if (truncated) break;
  }

  if (truncated) {
    const merged = appendClamped(digest, "\n\n[DIGEST_TRUNCATED]\n", maxChars);
    digest = merged.value;
  }

  return {
    digest: digest.trim(),
    truncated,
    filesIncluded,
    filesSkipped,
  };
}
