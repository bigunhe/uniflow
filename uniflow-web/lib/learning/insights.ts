import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  LEARNING_SYNC_BUCKET,
  buildLearningStoragePath,
  normalizeModuleCode,
} from "@/lib/learning/sync";

export const LEARNING_INSIGHTS_FILE = "_uniflow_insights.json";
const LEARNING_INSIGHTS_CACHE_DIR = "_cache";

export function learningInsightsStoragePath(userId: string, moduleCode: string): string {
  return buildLearningStoragePath(
    userId,
    normalizeModuleCode(moduleCode),
    LEARNING_INSIGHTS_FILE
  );
}

export function learningInsightsCacheStoragePath(
  userId: string,
  moduleCode: string,
  cacheKey: string
): string {
  const safeCacheKey = cacheKey.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${userId}/${normalizeModuleCode(moduleCode)}/${LEARNING_INSIGHTS_CACHE_DIR}/${safeCacheKey}.json`;
}

export const moduleInsightCoreSchema = z.object({
  headline: z.string(),
  analogy: z.string(),
});

export const moduleInsightBodySchema = z.object({
  coreModels: z.array(moduleInsightCoreSchema).min(1).max(6),
  searchVectors: z.array(z.string()).min(2).max(12),
  knowledgeGaps: z.array(z.string()).min(2).max(12),
  lectureFileSummaries: z
    .array(
      z.object({
        fileName: z.string(),
        summary: z.string(),
        isDense: z.boolean().optional(),
      })
    )
    .default([]),
});

export type ModuleInsightBody = z.infer<typeof moduleInsightBodySchema>;

export const storedModuleInsightsSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string(),
  moduleCode: z.string(),
  moduleName: z.string().optional(),
  model: z.string().optional(),
  insight: moduleInsightBodySchema,
});

export type StoredModuleInsights = z.infer<typeof storedModuleInsightsSchema>;

export function parseStoredModuleInsightsJson(raw: string): StoredModuleInsights | null {
  try {
    const data = JSON.parse(raw) as unknown;
    const parsed = storedModuleInsightsSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function tokenize(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function titleize(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function humanizeModuleName(moduleName: string, moduleCode: string): string {
  const cleaned = moduleName.trim();
  if (cleaned.length > 0) return cleaned;
  return titleize(normalizeModuleCode(moduleCode).replace(/[-_]+/g, " ")) || moduleCode;
}

function summarizeFile(
  fileName: string,
  mimeType: string | null,
  moduleLabel: string
): { summary: string; isDense: boolean } {
  const lowered = fileName.toLowerCase();
  const isPdf = (mimeType ?? "").includes("pdf") || lowered.endsWith(".pdf");
  const isSlide = /slide|deck|presentation|ppt|pptx/.test(lowered);
  const isNotes = /note|summary|cheat|revision/.test(lowered);
  const isExercise = /exercise|quiz|worksheet|assignment|lab/.test(lowered);

  let summary = `Supports the ${moduleLabel} study path.`;
  if (isExercise) {
    summary = `Useful for practice and checking understanding in ${moduleLabel}.`;
  } else if (isNotes) {
    summary = `Good quick-review material for ${moduleLabel}.`;
  } else if (isSlide) {
    summary = `Slides or deck material that likely frames the main ideas for ${moduleLabel}.`;
  } else if (isPdf) {
    summary = `PDF reading with core reference material for ${moduleLabel}.`;
  }

  return {
    summary,
    isDense: !isSlide && !isNotes,
  };
}

export function buildModuleInsightCacheKey(args: {
  moduleCode: string;
  moduleName: string;
  studentFocus?: string;
  fileManifest: { fileName: string; mimeType: string | null; sizeBytes: number }[];
}): string {
  const normalized = {
    moduleCode: normalizeModuleCode(args.moduleCode),
    moduleName: args.moduleName.trim(),
    studentFocus: args.studentFocus?.trim() ?? "",
    fileManifest: [...args.fileManifest]
      .map((file) => ({
        fileName: file.fileName.trim(),
        mimeType: file.mimeType ?? "",
        sizeBytes: Number(file.sizeBytes) || 0,
      }))
      .sort((a, b) => {
        const nameCompare = a.fileName.localeCompare(b.fileName);
        if (nameCompare !== 0) return nameCompare;
        return a.sizeBytes - b.sizeBytes;
      }),
  };

  const hash = createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
  return `mi-v1-${hash}`;
}

export function buildModuleInsightBody(args: {
  moduleCode: string;
  moduleName: string;
  studentFocus?: string;
  fileManifest: { fileName: string; mimeType: string | null; sizeBytes: number }[];
}): ModuleInsightBody {
  const moduleLabel = humanizeModuleName(args.moduleName, args.moduleCode);
  const moduleTokens = tokenize(moduleLabel).filter((token) => token.length > 2);
  const focusTokens = tokenize(args.studentFocus ?? "").filter((token) => token.length > 2);
  const fileTypeTokens = unique(
    args.fileManifest.map((file) => file.mimeType?.split("/").pop() ?? "")
  ).flatMap((entry) => tokenize(entry));
  const topics = unique([...moduleTokens, ...focusTokens, ...fileTypeTokens]).slice(0, 6);
  const leadTopic = topics[0] ?? moduleLabel;
  const focusText = args.studentFocus?.trim();

  const coreModels = [
    {
      headline: `${moduleLabel} as a system`,
      analogy: `Think of it as a connected set of ideas where each file supports the main ${leadTopic.toLowerCase()} flow.`,
    },
    {
      headline: `Study path for ${moduleLabel}`,
      analogy: focusText
        ? `Use the student focus (${focusText}) as the lens for deciding what to revise first.`
        : `Start with the overview, then move into the most important files one by one.`,
    },
    {
      headline: `${moduleLabel} memory hook`,
      analogy: `Picture the module as a checklist: concepts, examples, and practice should all line up before the exam.`,
    },
  ];

  const searchVectors = unique([
    `${moduleLabel} basics`,
    `${moduleLabel} examples`,
    focusText ? `${focusText} for ${moduleLabel}` : `${leadTopic} revision`,
    ...topics.map((topic) => `${topic} practice`),
  ]).slice(0, 12);

  const knowledgeGaps = unique([
    `Need more worked examples for ${leadTopic}.`,
    `Need a quick summary of the main ideas in ${moduleLabel}.`,
    focusText ? `Need targeted revision for ${focusText}.` : `Need a focused revision plan for ${moduleLabel}.`,
    `Need practice questions that check recall and application.`,
  ]).slice(0, 12);

  const lectureFileSummaries = args.fileManifest.map((file) => {
    const fileSummary = summarizeFile(file.fileName, file.mimeType, moduleLabel);
    return {
      fileName: file.fileName,
      summary: fileSummary.summary,
      isDense: fileSummary.isDense,
    };
  });

  return {
    coreModels: coreModels.slice(0, 6),
    searchVectors: searchVectors.length >= 2 ? searchVectors : [
      `${moduleLabel} basics`,
      `${moduleLabel} revision`,
    ],
    knowledgeGaps: knowledgeGaps.length >= 2 ? knowledgeGaps : [
      `Need a quick summary of ${moduleLabel}.`,
      `Need practice questions for ${moduleLabel}.`,
    ],
    lectureFileSummaries,
  };
}

export async function downloadStoredModuleInsights(
  supabase: SupabaseClient,
  userId: string,
  moduleCode: string
): Promise<StoredModuleInsights | null> {
  const path = learningInsightsStoragePath(userId, moduleCode);
  const { data, error } = await supabase.storage.from(LEARNING_SYNC_BUCKET).download(path);
  if (error || !data) {
    return null;
  }
  const text = await data.text();
  return parseStoredModuleInsightsJson(text);
}

export async function uploadStoredModuleInsights(
  supabase: SupabaseClient,
  args: {
    userId: string;
    moduleCode: string;
    moduleName?: string;
    model?: string;
    insight: ModuleInsightBody;
  }
): Promise<StoredModuleInsights> {
  const path = learningInsightsStoragePath(args.userId, args.moduleCode);
  const payload: StoredModuleInsights = {
    version: 1,
    generatedAt: new Date().toISOString(),
    moduleCode: normalizeModuleCode(args.moduleCode),
    moduleName: args.moduleName,
    model: args.model,
    insight: args.insight,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const { error } = await supabase.storage.from(LEARNING_SYNC_BUCKET).upload(path, blob, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) {
    throw new Error(error.message);
  }
  return payload;
}

export async function downloadCachedModuleInsights(
  supabase: SupabaseClient,
  args: {
    userId: string;
    moduleCode: string;
    cacheKey: string;
  }
): Promise<StoredModuleInsights | null> {
  const path = learningInsightsCacheStoragePath(
    args.userId,
    args.moduleCode,
    args.cacheKey
  );
  const { data, error } = await supabase.storage.from(LEARNING_SYNC_BUCKET).download(path);
  if (error || !data) {
    return null;
  }
  const text = await data.text();
  return parseStoredModuleInsightsJson(text);
}

export async function uploadCachedModuleInsights(
  supabase: SupabaseClient,
  args: {
    userId: string;
    moduleCode: string;
    cacheKey: string;
    moduleName?: string;
    model?: string;
    insight: ModuleInsightBody;
  }
): Promise<StoredModuleInsights> {
  const path = learningInsightsCacheStoragePath(
    args.userId,
    args.moduleCode,
    args.cacheKey
  );
  const payload: StoredModuleInsights = {
    version: 1,
    generatedAt: new Date().toISOString(),
    moduleCode: normalizeModuleCode(args.moduleCode),
    moduleName: args.moduleName,
    model: args.model,
    insight: args.insight,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const { error } = await supabase.storage.from(LEARNING_SYNC_BUCKET).upload(path, blob, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) {
    throw new Error(error.message);
  }
  return payload;
}