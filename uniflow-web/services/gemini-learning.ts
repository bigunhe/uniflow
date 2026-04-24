import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildModuleInsightUserPrompt } from "@/prompts/moduleInsights";
import {
  geminiModuleInsightBodySchema,
  type GeminiModuleInsightBody,
} from "@/lib/learning/insights";

/** Prefer higher free-tier RPD models first. */
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";

const MODEL_ALIASES: Record<string, string> = {
  "gemini-1.5-flash": "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest": "gemini-2.5-flash-lite",
  "gemini-1.5-pro": "gemini-2.5-flash",
  "gemini-1.5-pro-latest": "gemini-2.5-flash",
  "gemini-pro": "gemini-2.5-flash-lite",
};

/** Tried after preferred + GEMINI_MODEL_CHAIN; deduped. */
const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro-002",
] as const;

function parseEnvModelChain(): string[] {
  const raw = process.env.GEMINI_MODEL_CHAIN?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function resolveGeminiModelName(raw: string | undefined): string {
  const key = (raw ?? "").trim();
  if (!key) return DEFAULT_GEMINI_MODEL;
  return MODEL_ALIASES[key] ?? key;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isModelNotFoundError(error: unknown): boolean {
  const msg = errorMessage(error);
  return (
    msg.includes("404") &&
    (msg.includes("not found") ||
      msg.includes("Not Found") ||
      msg.includes("is not found"))
  );
}

/** True when trying the next model in the chain may help (404 or quota / rate limit). */
function isRetryableWithNextModel(error: unknown): boolean {
  if (isModelNotFoundError(error)) return true;
  return isGeminiQuotaLikeError(error);
}

export function isGeminiQuotaLikeError(error: unknown): boolean {
  const msg = errorMessage(error).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("too many requests") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("rate limit")
  );
}

export function getSuggestedRetryAfterSec(error: unknown): number | undefined {
  const msg = errorMessage(error);
  const m =
    msg.match(/retry in ([\d.]+)\s*s\b/i) ??
    msg.match(/retryDelay["']?\s*:\s*"?(\d+)/i) ??
    msg.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (!m) return undefined;
  const sec = Math.ceil(parseFloat(m[1]));
  if (!Number.isFinite(sec) || sec < 1) return undefined;
  return sec;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function buildModelChain(preferred: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of [preferred, ...parseEnvModelChain(), ...FALLBACK_MODELS]) {
    if (m && !seen.has(m)) {
      seen.add(m);
      out.push(m);
    }
  }
  return out;
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
  parts: { text: string }[]
): Promise<string> {
  const result = await model.generateContent(parts);
  const out = result.response.text();
  if (!out) {
    throw new Error("Empty response from Gemini.");
  }
  return out;
}

const REPAIR_SCHEMA_HINT = `Expected JSON schema:
{
  "coreModels": [ { "headline": string, "analogy": string } ],
  "searchVectors": [ { "query": string, "sourceFiles": string[] } ],
  "knowledgeGaps": [ string ],
  "lectureFileSummaries": [ { "fileName": string, "summary": string, "isDense"?: boolean } ]
}
searchVectors: each sourceFiles must have 1-4 manifest file names; each query must be a concrete search string with technical terms.`;

export type GeminiInsightErrorShape = Error & {
  code: "GEMINI_QUOTA";
  retryAfterSec?: number;
};

function makeQuotaError(message: string, retryAfterSec?: number): GeminiInsightErrorShape {
  const e = new Error(message) as GeminiInsightErrorShape;
  e.code = "GEMINI_QUOTA";
  e.retryAfterSec = retryAfterSec;
  return e;
}

export async function analyzeModuleWithGemini(args: {
  moduleCode: string;
  moduleName: string;
  fileManifest: { fileName: string; mimeType: string | null; sizeBytes: number }[];
  textDigest: string;
}): Promise<{ insight: GeminiModuleInsightBody; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const preferred = resolveGeminiModelName(process.env.GEMINI_MODEL);
  const chain = buildModelChain(preferred);

  const fileManifestLines = args.fileManifest
    .map(
      (f) =>
        `- ${f.fileName} (${f.mimeType ?? "unknown"}, ${Math.max(1, Math.round(f.sizeBytes / 1024))} KB)`
    )
    .join("\n");

  const userPrompt = buildModuleInsightUserPrompt({
    moduleCode: args.moduleCode,
    moduleName: args.moduleName,
    fileManifestLines,
    textDigest: args.textDigest,
  });

  const contentParts: { text: string }[] = [{ text: userPrompt }];

  let workingModelName: string | null = null;
  let lastError: Error | null = null;
  let raw = "";
  let quotaBackoffDone = false;

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
      if (isRetryableWithNextModel(e)) {
        lastError = e instanceof Error ? e : new Error(String(e));
        if (!quotaBackoffDone && isGeminiQuotaLikeError(e)) {
          const waitSec = getSuggestedRetryAfterSec(e);
          if (waitSec != null) {
            quotaBackoffDone = true;
            await sleep(Math.min(waitSec, 60) * 1000);
          }
        }
        continue;
      }
      throw e;
    }
  }

  if (!workingModelName) {
    const err = lastError ?? new Error("No Gemini model responded.");
    if (isGeminiQuotaLikeError(err)) {
      const retry = getSuggestedRetryAfterSec(err);
      throw makeQuotaError(
        "Gemini free quota or rate limit hit for all models tried. Wait and retry, set GEMINI_MODEL / GEMINI_MODEL_CHAIN in .env, or check Google AI Studio usage.",
        retry
      );
    }
    throw new Error(
      err.message ||
        "No Gemini model available. Set GEMINI_MODEL to a current id (see Google AI docs)."
    );
  }

  let insight = parseModelJson(raw);

  if (!insight) {
    const repairPrompt = `Your previous answer was not valid JSON matching the schema. Reply with ONLY corrected JSON.
${REPAIR_SCHEMA_HINT}
Previous output (may be truncated):
${raw.slice(0, 12000)}`;

    const startIdx = chain.indexOf(workingModelName);
    let repaired = false;

    for (let i = startIdx; i < chain.length; i++) {
      const modelName = chain[i];
      try {
        const repairModel = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.35,
            responseMimeType: "application/json",
          },
        });
        raw = await generateOnce(repairModel, [{ text: repairPrompt }]);
        insight = parseModelJson(raw);
        if (insight) {
          workingModelName = modelName;
          repaired = true;
          break;
        }
      } catch (e) {
        if (isRetryableWithNextModel(e)) {
          lastError = e instanceof Error ? e : new Error(String(e));
          continue;
        }
        throw e;
      }
    }

    if (!repaired && !insight) {
      if (lastError && isGeminiQuotaLikeError(lastError)) {
        const retry = getSuggestedRetryAfterSec(lastError);
        throw makeQuotaError(
          "Could not repair JSON: Gemini quota or rate limit. Try again in a few minutes.",
          retry
        );
      }
      throw new Error("Could not parse structured insights from Gemini.");
    }
  }

  if (!insight) {
    throw new Error("Could not parse structured insights from Gemini.");
  }

  return { insight, model: workingModelName };
}

export function isGeminiInsightQuotaError(
  error: unknown
): error is GeminiInsightErrorShape {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as GeminiInsightErrorShape).code === "GEMINI_QUOTA"
  );
}
