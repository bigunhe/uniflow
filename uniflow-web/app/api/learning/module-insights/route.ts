import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";
import {
  getLearningModuleByCode,
  LEARNING_SYNC_BUCKET,
  listLearningFiles,
  normalizeModuleCode,
  type LearningFileRow,
} from "@/lib/learning/sync";
import { uploadStoredModuleInsights } from "@/lib/learning/insights";
import {
  analyzeModuleWithGemini,
  getSuggestedRetryAfterSec,
  isGeminiInsightQuotaError,
  isGeminiQuotaLikeError,
} from "@/services/gemini-learning";
import { buildModuleTextDigest } from "@/lib/learning/buildModuleTextDigest";
import { checkModuleInsightsRateLimit } from "@/lib/learning/moduleInsightsRateLimit";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Server is missing GEMINI_API_KEY. Add it to uniflow-web/.env.local" },
        { status: 503 }
      );
    }

    const supabase = await createRouteHandlerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      moduleCode?: string;
    };

    const moduleCode = normalizeModuleCode(body.moduleCode ?? "");
    if (!moduleCode || moduleCode.length < 6) {
      return NextResponse.json({ error: "Invalid moduleCode" }, { status: 400 });
    }

    const moduleRow = await getLearningModuleByCode(supabase, user.id, moduleCode);
    if (!moduleRow) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const fileRows = await listLearningFiles(supabase, user.id, moduleRow.id);
    const manifest = fileRows.map((f) => ({
      fileName: f.original_name,
      mimeType: f.mime_type,
      sizeBytes: Number(f.size_bytes),
    }));

    const download = async (row: LearningFileRow): Promise<ArrayBuffer | null> => {
      const { data, error } = await supabase.storage
        .from(LEARNING_SYNC_BUCKET)
        .download(row.storage_path);
      if (error || !data) return null;
      return data.arrayBuffer();
    };

    const digestResult = await buildModuleTextDigest({ fileRows, download });

    if (!digestResult.digest.trim()) {
      const debugDigest =
        process.env.DEBUG_LEARNING_DIGEST === "1" || process.env.NODE_ENV === "development";
      return NextResponse.json(
        {
          error:
            "No extractable text from PDF or PPTX files in this module. Add files with selectable text, or convert legacy .ppt to .pptx/.pdf.",
          ...(debugDigest
            ? {
                digestDetails: digestResult.filesSkipped.map((s) => ({
                  file: s.name,
                  reason: s.reason,
                })),
              }
            : {}),
        },
        { status: 400 }
      );
    }

    const rl = checkModuleInsightsRateLimit(user.id, moduleCode);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Rate limited. Try again in ${rl.retryAfterSec ?? 90} seconds.` },
        { status: 429 }
      );
    }

    let insight;
    let model: string;
    try {
      const out = await analyzeModuleWithGemini({
        moduleCode: moduleRow.module_code,
        moduleName: moduleRow.module_name,
        fileManifest: manifest,
        textDigest: digestResult.digest,
      });
      insight = out.insight;
      model = out.model;
    } catch (e) {
      if (isGeminiInsightQuotaError(e)) {
        return NextResponse.json(
          {
            error: e.message,
            code: "GEMINI_QUOTA",
            retryAfterSec: e.retryAfterSec,
          },
          { status: 429 }
        );
      }
      if (isGeminiQuotaLikeError(e)) {
        return NextResponse.json(
          {
            error:
              "Gemini rate limit or quota exceeded. Wait a few minutes, try again, or adjust GEMINI_MODEL / GEMINI_MODEL_CHAIN. Check usage in Google AI Studio.",
            code: "GEMINI_QUOTA",
            retryAfterSec: getSuggestedRetryAfterSec(e),
          },
          { status: 429 }
        );
      }
      const msg = e instanceof Error ? e.message : "Gemini request failed";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const stored = await uploadStoredModuleInsights(supabase, {
      userId: user.id,
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      model,
      insight,
      digestTruncated: digestResult.truncated,
      digestFilesIncluded: digestResult.filesIncluded,
    });

    return NextResponse.json({
      ok: true,
      stored,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
