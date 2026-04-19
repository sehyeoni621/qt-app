"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Subject } from "@/features/home/mockData";

export async function saveStudySessionAction(input: {
  subject: Subject;
  seconds: number;
  focus: number;
  correct: number;
  wrong: number;
  qi_total: number;
  started_at: string; // ISO
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  const { error } = await supabase.from("study_sessions").insert({
    user_id: user.id,
    subject: input.subject,
    seconds: input.seconds,
    focus: input.focus,
    correct: input.correct,
    wrong: input.wrong,
    qi_total: input.qi_total,
    started_at: input.started_at,
    ended_at: new Date().toISOString(),
  });

  if (error) return { ok: false, reason: error.message };

  revalidatePath("/");
  revalidatePath("/study");
  return { ok: true };
}
