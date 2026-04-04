import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LEARNING_SYNC_BUCKET,
  buildLearningStoragePath,
  normalizeModuleCode,
} from "@/lib/learning/sync";

export const LEARNING_INSIGHTS_FILE = "_uniflow_insights.json";

export function learningInsightsStoragePath(userId: string, moduleCode: string): string {
  return buildLearningStoragePath(
    userId,
    normalizeModuleCode(moduleCode),
    LEARNING_INSIGHTS_FILE
  );
}

export const moduleInsightCoreSchema = z.object({
  headline: z.string(),
  analogy: z.string(),
});

export const geminiModuleInsightBodySchema = z.object({
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

export type GeminiModuleInsightBody = z.infer<typeof geminiModuleInsightBodySchema>;

export const storedModuleInsightsSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string(),
  moduleCode: z.string(),
  moduleName: z.string().optional(),
  model: z.string().optional(),
  insight: geminiModuleInsightBodySchema,
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
    insight: GeminiModuleInsightBody;
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
