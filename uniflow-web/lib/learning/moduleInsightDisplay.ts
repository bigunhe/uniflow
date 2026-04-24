import type { ModuleInsight } from "@/lib/mockData";
import type { LearningFileRow, LearningModuleRow } from "@/lib/learning/sync";
import type { StoredModuleInsights } from "@/lib/learning/insights";

export function formatLearningFileSummary(file: LearningFileRow): string {
  const type = file.mime_type?.split("/").pop()?.toUpperCase() ?? "FILE";
  const kb = Math.max(1, Math.round(file.size_bytes / 1024));
  return `${type} • ${kb} KB • Uploaded ${new Date(
    file.uploaded_at
  ).toLocaleString()}. Run "Generate AI insights" to extract text from PDF/PPTX and save AI summaries.`;
}

export function storedInsightsToModuleInsight(
  stored: StoredModuleInsights,
  moduleRow: LearningModuleRow,
  fileRows: LearningFileRow[]
): ModuleInsight {
  const sumByName = new Map(
    stored.insight.lectureFileSummaries.map((s) => [s.fileName, s])
  );

  const files =
    fileRows.length > 0
      ? fileRows.map((f) => {
          const ai = sumByName.get(f.original_name);
          return {
            id: f.id,
            fileName: f.original_name,
            isDense: ai?.isDense ?? true,
            summary: ai?.summary ?? formatLearningFileSummary(f),
          };
        })
      : stored.insight.lectureFileSummaries.map((s, i) => ({
          id: `ai-file-${i}`,
          fileName: s.fileName,
          isDense: s.isDense ?? true,
          summary: s.summary,
        }));

  return {
    moduleId: moduleRow.module_code,
    moduleName: moduleRow.module_name,
    resourceCount: moduleRow.resource_count,
    coreModels: stored.insight.coreModels.map((m, i) => ({
      id: `ai-model-${i}`,
      headline: m.headline,
      analogy: m.analogy,
    })),
    searchVectors: stored.insight.searchVectors,
    knowledgeGaps: stored.insight.knowledgeGaps,
    files,
  };
}
