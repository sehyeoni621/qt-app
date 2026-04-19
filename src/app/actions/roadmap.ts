"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Subject } from "@/features/roadmap/generator";

export async function saveGoalAction(input: {
  targetUniversity: string;
  targetScore: number;
  startScore: number;
  prioritySubjects: Subject[];
  weeklyHours: number;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      target_university: input.targetUniversity,
      target_score: input.targetScore,
      start_score: input.startScore,
      priority_subjects: input.prioritySubjects,
      weekly_hours: input.weeklyHours,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) return { ok: false, reason: error.message };

  revalidatePath("/roadmap");
  revalidatePath("/");
  return { ok: true };
}
