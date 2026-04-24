export function buildModuleInsightUserPrompt(args: {
  moduleCode: string;
  moduleName: string;
  fileManifestLines: string;
  textDigest: string;
}): string {
  return `You are an academic learning assistant.

Return ONLY valid JSON with this exact shape:
{
  "coreModels": [ { "headline": string, "analogy": string } ],
  "searchVectors": [ { "query": string, "sourceFiles": string[] } ],
  "knowledgeGaps": [ string ],
  "lectureFileSummaries": [ { "fileName": string, "summary": string, "isDense"?: boolean } ]
}

Rules:
- coreModels: 3-6 concise mental models grounded in the module text.
- searchVectors: 4-10 concrete technical queries students can paste into search/LLMs. No generic items like "module basics".
- sourceFiles: 1-4 exact file names from manifest that support each query.
- knowledgeGaps: 4-8 closed-book checks that reference specific concepts from the digest.
- lectureFileSummaries: one per manifest file with practical summary.
- Do not include markdown, prose, or code fences.

Module:
- Code: ${args.moduleCode}
- Name: ${args.moduleName}

File manifest:
${args.fileManifestLines || "- (none)"}

Text digest:
${args.textDigest}
`;
}
