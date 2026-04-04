import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";
import {
  getLearningModuleByCode,
  LEARNING_SYNC_BUCKET,
  listLearningFiles,
  normalizeModuleCode,
} from "@/lib/learning/sync";
import { uploadStoredModuleInsights } from "@/lib/learning/insights";
import {
  analyzeModuleWithGemini,
  selectPdfsForModel,
} from "@/services/gemini-learning";

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

    const pdfPick = selectPdfsForModel(manifest);
    const pdfs: { fileName: string; base64: string }[] = [];

    for (const meta of pdfPick) {
      const row = fileRows.find((f) => f.original_name === meta.fileName);
      if (!row) continue;
      const { data, error } = await supabase.storage
        .from(LEARNING_SYNC_BUCKET)
        .download(row.storage_path);
      if (error || !data) continue;
      const ab = await data.arrayBuffer();
      const base64 = Buffer.from(ab).toString("base64");
      pdfs.push({ fileName: meta.fileName, base64 });
    }

    const { insight, model } = await analyzeModuleWithGemini({
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      studentFocus: body.studentFocus,
      fileManifest: manifest,
      pdfs,
    });

    const stored = await uploadStoredModuleInsights(supabase, {
      userId: user.id,
      moduleCode: moduleRow.module_code,
      moduleName: moduleRow.module_name,
      model,
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
