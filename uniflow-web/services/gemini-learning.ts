import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  geminiModuleInsightBodySchema,
  type GeminiModuleInsightBody,
} from "@/lib/learning/insights";

const MAX_PDF_COUNT = 3;
const MAX_BYTES_PER_PDF = 4 * 1024 * 1024;
const MAX_TOTAL_PDF_BYTES = 10 * 1024 * 1024;

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

const MODEL_ALIASES: Record<string, string> = {
  "gemini-1.5-flash": DEFAULT_GEMINI_MODEL,
  "gemini-1.5-flash-latest": DEFAULT_GEMINI_MODEL,
  "gemini-1.5-pro": DEFAULT_GEMINI_MODEL,
  "gemini-1.5-pro-latest": DEFAULT_GEMINI_MODEL,
  "gemini-pro": DEFAULT_GEMINI_MODEL,
};

const FALLBACK_MODELS = [
  DEFAULT_GEMINI_MODEL,
  "gemini-1.5-flash-002",
  "gemini-1.5-pro-002",
] as const;

export type PdfForModel = {
  fileName: string;
  base64: string;
};

export function resolveGeminiModelName(raw: string | undefined): string {
  const key = (raw ?? "").trim();
  if (!key) return DEFAULT_GEMINI_MODEL;
  return MODEL_ALIASES[key] ?? key;
}

function isModelNotFoundError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("404") &&
    (msg.includes("not found") ||
      msg.includes("Not Found") ||
      msg.includes("is not found"))
  );
}

function buildModelChain(preferred: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of [preferred, ...FALLBACK_MODELS]) {
    if (!seen.has(m)) {
      seen.add(m);
      out.push(m);
    }
  }
  return out;
}

function buildUserPrompt(args: {
  moduleCode: string;
  moduleName: string;
  studentFocus?: string;
  fileManifest: { fileName: string; mimeType: string | null; sizeBytes: number }[];
}): string {
  const manifestLines = args.fileManifest
    .map(
      (f) =>
        `- ${f.fileName} (${f.mimeType ?? "unknown"}, ${Math.max(1, Math.round(f.sizeBytes / 1024))} KB)`
    )
    .join("\n");

  const focus = args.studentFocus?.trim()
    ? `\nStudent focus / constraints:\n${args.studentFocus.trim()}\n`
    : "";

  return `You are an expert study coach for university IT modules.

Module code: ${args.moduleCode}
Module title: ${args.moduleName}
${focus}
Complete file manifest (all items the student synced — include every file in lectureFileSummaries even if you did not see its contents):
${manifestLines || "(no files listed)"}

Attached below are up to ${MAX_PDF_COUNT} PDFs from this module (binary content). Use them as the primary evidence. For any file you did not receive as PDF, infer only light guidance from the filename and manifest (say less, avoid inventing technical detail).

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "coreModels": [ { "headline": string, "analogy": string }, ... ],
  "searchVectors": string[],
  "knowledgeGaps": string[],
  "lectureFileSummaries": [ { "fileName": string, "summary": string, "isDense": boolean }, ... ]
}

Rules:
- coreModels: 2–4 items. Each headline is a crisp mental model; analogy uses a concrete metaphor.
- searchVectors: 4–8 deep, exam-style questions the student could paste into Google or ChatGPT (no shallow definitions).
- knowledgeGaps: 4–8 self-check questions they should answer closed-book.
- lectureFileSummaries: one object per file in the manifest, exact fileName match. isDense: true if technical slides/notes, false if syllabus/admin only.
- Stay grounded in the PDFs; do not fabricate page numbers or quotes.`;
}

function parseModelJson(text: string): GeminiModuleInsightBody | null {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  try {
    const raw = JSON.parse(withoutFence) as unknown;
    const parsed = geminiModuleInsightBodySchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

async function generateOnce(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[]
): Promise<string> {
  const result = await model.generateContent(parts);
  const out = result.response.text();
  if (!out) {
    throw new Error("Empty response from Gemini.");
  }
  return out;
}

export async function analyzeModuleWithGemini(args: {
  moduleCode: string;
  moduleName: string;
  studentFocus?: string;
  fileManifest: { fileName: string; mimeType: string | null; sizeBytes: number }[];
  pdfs: PdfForModel[];
}): Promise<{ insight: GeminiModuleInsightBody; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const preferred = resolveGeminiModelName(process.env.GEMINI_MODEL);
  const chain = buildModelChain(preferred);

  const userPrompt = buildUserPrompt(args);
  const contentParts: (
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  )[] = [{ text: userPrompt }];

  for (const pdf of args.pdfs) {
    contentParts.push({ text: `\n--- PDF: ${pdf.fileName} ---\n` });
    contentParts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: pdf.base64,
      },
    });
  }

  let workingModelName: string | null = null;
  let lastError: Error | null = null;
  let raw = "";

  for (const modelName of chain) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
        },
      });
      raw = await generateOnce(model, contentParts);
      workingModelName = modelName;
      break;
    } catch (e) {
      if (isModelNotFoundError(e)) {
        lastError = e instanceof Error ? e : new Error(String(e));
        continue;
      }
      throw e;
    }
  }

  if (!workingModelName) {
    throw new Error(
      lastError?.message ??
        "No Gemini model available. Set GEMINI_MODEL to a current id (e.g. gemini-2.0-flash)."
    );
  }

  const model = genAI.getGenerativeModel({
    model: workingModelName,
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  });

  let insight = parseModelJson(raw);

  if (!insight) {
    const repairPrompt = `Your previous answer was not valid JSON matching the schema. Reply with ONLY corrected JSON.
Previous output (may be truncated):
${raw.slice(0, 12000)}`;
    raw = await generateOnce(model, [{ text: repairPrompt }]);
    insight = parseModelJson(raw);
  }

  if (!insight) {
    throw new Error("Could not parse structured insights from Gemini.");
  }

  return { insight, model: workingModelName };
}

export function selectPdfsForModel(
  files: { fileName: string; mimeType: string | null; sizeBytes: number }[]
): { fileName: string; mimeType: string | null; sizeBytes: number }[] {
  const pdfs = files.filter(
    (f) => (f.mimeType ?? "").toLowerCase() === "application/pdf"
  );
  pdfs.sort((a, b) => b.sizeBytes - a.sizeBytes);

  const picked: typeof pdfs = [];
  let total = 0;
  for (const f of pdfs) {
    if (picked.length >= MAX_PDF_COUNT) break;
    if (f.sizeBytes > MAX_BYTES_PER_PDF) continue;
    if (total + f.sizeBytes > MAX_TOTAL_PDF_BYTES) continue;
    picked.push(f);
    total += f.sizeBytes;
  }

  if (picked.length === 0 && pdfs.length > 0) {
    const smallest = [...pdfs].sort((a, b) => a.sizeBytes - b.sizeBytes)[0];
    if (smallest && smallest.sizeBytes <= MAX_BYTES_PER_PDF) {
      picked.push(smallest);
    }
  }

  return picked;
}
