import { PageHeader } from "@/components/shared/PageHeader";
import { GoalForm } from "@/features/roadmap/GoalForm";
import { PlanView } from "@/features/roadmap/PlanView";
import type { Goal, Subject } from "@/features/roadmap/generator";
import { SUNEUNG_DATE } from "@/features/home/mockData";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWeekSessions } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

type ProfileGoal = {
  target_university: string | null;
  target_score: number | null;
  start_score: number | null;
  priority_subjects: string[] | null;
  weekly_hours: number | null;
};

export default async function RoadmapPage() {
  let profile: ProfileGoal | null = null;
  let isAuthed = false;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      isAuthed = true;
      const { data } = await supabase
        .from("profiles")
        .select(
          "target_university, target_score, start_score, priority_subjects, weekly_hours"
        )
        .eq("id", user.id)
        .maybeSingle();
      profile = (data ?? null) as ProfileGoal | null;
    }
  } catch {
    isAuthed = false;
  }

  const hasGoal =
    !!profile?.target_university &&
    profile?.target_score != null &&
    profile?.start_score != null;

  // 이번 주 학습 시간 계산
  let hoursThisWeek = 0;
  if (isAuthed) {
    const sessions = await getWeekSessions();
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const secs = sessions
      .filter((s) => new Date(s.ended_at) >= monday)
      .reduce((a, s) => a + s.seconds, 0);
    hoursThisWeek = secs / 3600;
  }

  return (
    <>
      <PageHeader
        eyebrow="roadmap"
        title="D-day 로드맵"
        subtitle="목표를 역산한 주간 계획."
      />

      {!isAuthed && (
        <div className="mx-5 mb-3 rounded-2xl bg-white/70 p-4 text-sm text-[var(--text-mid)] ring-1 ring-[var(--border-strong)]">
          로그인 후 목표를 저장하면 수능까지의 주간 계획이 자동 생성됩니다.
        </div>
      )}

      {isAuthed && !hasGoal && (
        <div className="px-5 pb-6">
          <GoalForm />
        </div>
      )}

      {isAuthed && hasGoal && profile && (
        <PlanView
          goal={
            {
              targetUniversity: profile.target_university!,
              targetScore: profile.target_score!,
              startScore: profile.start_score!,
              prioritySubjects:
                (profile.priority_subjects as Subject[] | null) ?? [],
              weeklyHours: profile.weekly_hours ?? 40,
            } satisfies Goal
          }
          targetDday={SUNEUNG_DATE}
          hoursThisWeek={hoursThisWeek}
        />
      )}
    </>
  );
}
