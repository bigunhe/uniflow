/**
 * LEARNING SILO — Server Actions
 * This file is the ONLY way other domains/silos can request data from the (learning) silo.
 * Do not import from (networking) or other route groups here.
 */

import { createClient } from "@/lib/supabase/client";
import {
  getLearningModuleByCode,
  listLearningFiles,
  listLearningModules,
} from "@/lib/learning/sync";

export async function getLearningData() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { modules: [] };
  }

  const modules = await listLearningModules(supabase, user.id);
  return { modules };
}

export async function getLearningModuleData(moduleCode: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { module: null, files: [] };
  }

  const module = await getLearningModuleByCode(supabase, user.id, moduleCode);
  if (!module) {
    return { module: null, files: [] };
  }

  const files = await listLearningFiles(supabase, user.id, module.id);
  return { module, files };
}
