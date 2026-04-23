import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";
import {
  getLearningModuleByCode,
} from "@/lib/learning/sync";
import {
  buildModuleInsightBody,
  buildModuleInsightCacheKey,
  downloadCachedModuleInsights,
  uploadCachedModuleInsights,
  uploadStoredModuleInsights,
} from "@/lib/learning/insights";
import { listLearningFiles, normalizeModuleCode } from "@/lib/learning/sync";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      moduleCode?: string;
      studentFocus?: string;
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

    const cacheKey = buildModuleInsightCacheKey({
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      studentFocus: body.studentFocus,
      fileManifest: manifest,
    });

    const cached = await downloadCachedModuleInsights(supabase, {
      userId: user.id,
      moduleCode: moduleRow.module_code,
      cacheKey,
    });

    if (cached) {
      return NextResponse.json({
        ok: true,
        stored: cached,
      });
    }

    const insight = buildModuleInsightBody({
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      studentFocus: body.studentFocus,
      fileManifest: manifest,
    });

    const stored = await uploadStoredModuleInsights(supabase, {
      userId: user.id,
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      model: "heuristic",
      insight,
    });

    await uploadCachedModuleInsights(supabase, {
      userId: user.id,
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      cacheKey,
      model: "heuristic",
      insight,
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
