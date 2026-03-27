import type { SupabaseClient } from "@supabase/supabase-js";

export const LEARNING_SYNC_BUCKET = "learning-sync";

export type LearningModuleRow = {
  id: string;
  user_id: string;
  module_code: string;
  module_name: string;
  resource_count: number;
  last_synced_at: string | null;
};

export type LearningFileRow = {
  id: string;
  module_id: string;
  user_id: string;
  original_name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number;
  uploaded_at: string;
};

export type ExtractedZipFile = {
  relativePath: string;
  fileName: string;
  blob: Blob;
  mimeType?: string;
};

type LearningSyncArgs = {
  supabase: SupabaseClient;
  userId: string;
  moduleCode: string;
  moduleName: string;
  files: ExtractedZipFile[];
};

export function normalizeModuleCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function extractModuleCodeFromZipName(fileName: string): string {
  const base = fileName.replace(/\.zip$/i, "");
  return normalizeModuleCode(base.slice(0, 6));
}

export async function getLearningModuleByCode(
  supabase: SupabaseClient,
  userId: string,
  moduleCode: string
): Promise<LearningModuleRow | null> {
  const normalizedCode = normalizeModuleCode(moduleCode);
  const { data, error } = await supabase
    .from("learning_modules")
    .select("id,user_id,module_code,module_name,resource_count,last_synced_at")
    .eq("user_id", userId)
    .eq("module_code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function ensureLearningModule(
  supabase: SupabaseClient,
  userId: string,
  moduleCode: string,
  moduleName: string
): Promise<LearningModuleRow> {
  const normalizedCode = normalizeModuleCode(moduleCode);
  const normalizedName = moduleName.trim();

  if (!normalizedCode || normalizedCode.length < 6) {
    throw new Error("Invalid module code. Expected at least 6 characters.");
  }
  if (!normalizedName) {
    throw new Error("Module name is required.");
  }

  const { data, error } = await supabase
    .from("learning_modules")
    .upsert(
      {
        user_id: userId,
        module_code: normalizedCode,
        module_name: normalizedName,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_code" }
    )
    .select("id,user_id,module_code,module_name,resource_count,last_synced_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not ensure module.");
  }

  return data;
}

export function buildLearningStoragePath(
  userId: string,
  moduleCode: string,
  fileName: string
): string {
  const safeName = fileName.replace(/[^\w.\-() ]/g, "_");
  return `${userId}/${normalizeModuleCode(moduleCode)}/${safeName}`;
}

export async function uploadLearningFile(
  supabase: SupabaseClient,
  userId: string,
  moduleCode: string,
  file: ExtractedZipFile
): Promise<{ storagePath: string; sizeBytes: number; mimeType: string | null }> {
  const storagePath = buildLearningStoragePath(userId, moduleCode, file.fileName);
  const mimeType = file.mimeType ?? "application/octet-stream";
  const sizeBytes = file.blob.size;

  const { error } = await supabase.storage
    .from(LEARNING_SYNC_BUCKET)
    .upload(storagePath, file.blob, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return { storagePath, sizeBytes, mimeType };
}

export async function upsertLearningFileRecord(
  supabase: SupabaseClient,
  moduleId: string,
  userId: string,
  fileName: string,
  storagePath: string,
  sizeBytes: number,
  mimeType: string | null
): Promise<void> {
  const { error } = await supabase.from("learning_files").upsert(
    {
      module_id: moduleId,
      user_id: userId,
      original_name: fileName,
      storage_path: storagePath,
      size_bytes: sizeBytes,
      mime_type: mimeType,
      uploaded_at: new Date().toISOString(),
    },
    { onConflict: "module_id,original_name" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function refreshLearningModuleStats(
  supabase: SupabaseClient,
  moduleId: string,
  userId: string
): Promise<number> {
  const { count, error: countError } = await supabase
    .from("learning_files")
    .select("id", { count: "exact", head: true })
    .eq("module_id", moduleId)
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  const resourceCount = count ?? 0;
  const { error: updateError } = await supabase
    .from("learning_modules")
    .update({
      resource_count: resourceCount,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", moduleId)
    .eq("user_id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return resourceCount;
}

export async function syncLearningModuleUpload(
  args: LearningSyncArgs
): Promise<{
  module: LearningModuleRow;
  uploadedCount: number;
  failedFiles: string[];
}> {
  const { supabase, userId, moduleCode, moduleName, files } = args;

  if (!files.length) {
    throw new Error("ZIP has no valid files to sync.");
  }

  const module = await ensureLearningModule(
    supabase,
    userId,
    moduleCode,
    moduleName
  );

  const failedFiles: string[] = [];
  let uploadedCount = 0;

  for (const file of files) {
    try {
      const { storagePath, sizeBytes, mimeType } = await uploadLearningFile(
        supabase,
        userId,
        module.module_code,
        file
      );

      await upsertLearningFileRecord(
        supabase,
        module.id,
        userId,
        file.fileName,
        storagePath,
        sizeBytes,
        mimeType
      );

      uploadedCount += 1;
    } catch {
      failedFiles.push(file.fileName);
    }
  }

  await refreshLearningModuleStats(supabase, module.id, userId);
  const refreshed = await getLearningModuleByCode(
    supabase,
    userId,
    module.module_code
  );

  return {
    module: refreshed ?? module,
    uploadedCount,
    failedFiles,
  };
}

export async function listLearningModules(
  supabase: SupabaseClient,
  userId: string
): Promise<LearningModuleRow[]> {
  const { data, error } = await supabase
    .from("learning_modules")
    .select("id,user_id,module_code,module_name,resource_count,last_synced_at")
    .eq("user_id", userId)
    .order("last_synced_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function listLearningFiles(
  supabase: SupabaseClient,
  userId: string,
  moduleId: string
): Promise<LearningFileRow[]> {
  const { data, error } = await supabase
    .from("learning_files")
    .select("id,module_id,user_id,original_name,storage_path,mime_type,size_bytes,uploaded_at")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
