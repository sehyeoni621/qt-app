"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function setMoodAction(level: 1 | 2 | 3 | 4 | 5) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  // 오늘자 기록 있으면 교체, 없으면 insert
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { data: existing } = await supabase
    .from("mood_checkins")
    .select("id")
    .gte("checked_at", start.toISOString())
    .lte("checked_at", end.toISOString())
    .order("checked_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("mood_checkins")
      .update({ mood_level: level, checked_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase.from("mood_checkins").insert({
      user_id: user.id,
      mood_level: level,
    });
  }
  revalidatePath("/");
  return { ok: true };
}

export async function toggleTodoAction(id: string, done: boolean) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  await supabase
    .from("todos")
    .update({ done, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/");
  return { ok: true };
}

export async function seedDefaultTodosAction() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;

  const { data: existing } = await supabase
    .from("todos")
    .select("id")
    .eq("date", dateStr)
    .limit(1);

  if (existing && existing.length > 0) return { ok: true, seeded: false };

  await supabase.from("todos").insert([
    {
      user_id: user.id,
      date: dateStr,
      text: "수능특강 수학 3단원 20문제",
      subject: "수학",
      minutes: 90,
      position: 0,
    },
    {
      user_id: user.id,
      date: dateStr,
      text: "김상훈 문학 필기노트 정리",
      subject: "국어",
      minutes: 60,
      position: 1,
    },
    {
      user_id: user.id,
      date: dateStr,
      text: "영어 단어장 Day 14 암기",
      subject: "영어",
      minutes: 30,
      position: 2,
    },
    {
      user_id: user.id,
      date: dateStr,
      text: "생명과학 광합성 단원 오답 복습",
      subject: "탐구",
      minutes: 45,
      position: 3,
    },
  ]);
  revalidatePath("/");
  return { ok: true, seeded: true };
}

export async function addTodoAction(input: {
  text: string;
  subject?: string | null;
  minutes?: number | null;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;

  const { count } = await supabase
    .from("todos")
    .select("id", { count: "exact", head: true })
    .eq("date", dateStr);

  await supabase.from("todos").insert({
    user_id: user.id,
    date: dateStr,
    text: input.text,
    subject: input.subject ?? null,
    minutes: input.minutes ?? 30,
    position: count ?? 0,
  });
  revalidatePath("/");
  return { ok: true };
}
