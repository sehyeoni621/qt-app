import { createSupabaseServerClient } from "./server";
import type { Subject } from "@/features/home/mockData";

export type DBSession = {
  id: string;
  subject: Subject;
  started_at: string;
  ended_at: string;
  seconds: number;
  focus: number;
  correct: number;
  wrong: number;
  qi_total: number;
};

export type DBMood = {
  id: string;
  checked_at: string;
  mood_level: 1 | 2 | 3 | 4 | 5;
};

export type DBTodo = {
  id: string;
  date: string;
  text: string;
  subject: Subject | null;
  minutes: number | null;
  done: boolean;
  position: number;
};

function dayStartISO(d: Date = new Date()) {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}
function dayEndISO(d: Date = new Date()) {
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

function todayYMD(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// ───────────── 세션 ─────────────
export async function getTodaySessions(): Promise<DBSession[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("study_sessions")
      .select("id, subject, started_at, ended_at, seconds, focus, correct, wrong, qi_total")
      .gte("ended_at", dayStartISO())
      .lte("ended_at", dayEndISO())
      .order("ended_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as DBSession[];
  } catch {
    return [];
  }
}

export async function getWeekSessions(): Promise<DBSession[]> {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    weekAgo.setHours(0, 0, 0, 0);
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("study_sessions")
      .select("id, subject, started_at, ended_at, seconds, focus, correct, wrong, qi_total")
      .gte("ended_at", weekAgo.toISOString())
      .order("ended_at", { ascending: true });
    if (error) return [];
    return (data ?? []) as DBSession[];
  } catch {
    return [];
  }
}

// ───────────── 감정 ─────────────
export async function getTodayMood(): Promise<DBMood | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("mood_checkins")
      .select("id, checked_at, mood_level")
      .gte("checked_at", dayStartISO())
      .lte("checked_at", dayEndISO())
      .order("checked_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return null;
    return (data ?? null) as DBMood | null;
  } catch {
    return null;
  }
}

// ───────────── 투두 ─────────────
export async function getTodayTodos(): Promise<DBTodo[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("todos")
      .select("id, date, text, subject, minutes, done, position")
      .eq("date", todayYMD())
      .order("position", { ascending: true });
    if (error) return [];
    return (data ?? []) as DBTodo[];
  } catch {
    return [];
  }
}

// ───────────── 이름 ─────────────
export async function getProfileName(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return null;
    const { data: p } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .maybeSingle();
    return (
      p?.nickname ??
      (user.user_metadata?.nickname as string | undefined) ??
      user.email?.split("@")[0] ??
      null
    );
  } catch {
    return null;
  }
}
