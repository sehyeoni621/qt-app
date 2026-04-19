import { DDayCard } from "@/features/home/DDayCard";
import { GreetingHeader } from "@/features/home/GreetingHeader";
import { MoodCheckin } from "@/features/home/MoodCheckin";
import { QIOverview } from "@/features/home/QIOverview";
import { StartButton } from "@/features/home/StartButton";
import { StaggerItem, StaggerList } from "@/features/home/StaggerContainer";
import { TodoList, type TodoItem } from "@/features/home/TodoList";
import {
  aggregateTodayBreakdown,
  aggregateWeeklyQI,
  sumTodayQI,
  weekAverageDelta,
} from "@/features/home/aggregate";
import { computeDDay } from "@/features/home/dday";
import { fallbackQiBreakdown, fallbackWeeklyQi } from "@/features/home/mockData";
import { seedDefaultTodosAction } from "@/app/actions/home";
import {
  getProfileName,
  getTodayMood,
  getTodayTodos,
  getWeekSessions,
} from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Subject } from "@/features/home/mockData";

function formatDateKo(now: Date) {
  const w = ["일", "월", "화", "수", "목", "금", "토"];
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${w[now.getDay()]}요일`;
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 로그인 사용자 확인
  let isAuthed = false;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAuthed = !!user;
  } catch {
    isAuthed = false;
  }

  // 실데이터 수집 (env 미설정/테이블 미생성 시 자동 폴백)
  const [name, sessions, mood, todosRaw] = await Promise.all([
    getProfileName().catch(() => null),
    getWeekSessions(),
    getTodayMood(),
    getTodayTodos(),
  ]);

  const displayName = name ?? "손님";

  // 투두가 비어있고 로그인 상태면 기본 세팅
  if (isAuthed && todosRaw.length === 0) {
    await seedDefaultTodosAction().catch(() => {});
  }
  const todos = isAuthed ? await getTodayTodos() : todosRaw;

  const weekly =
    sessions.length === 0 ? fallbackWeeklyQi : aggregateWeeklyQI(sessions);
  const breakdown =
    sessions.length === 0
      ? fallbackQiBreakdown
      : aggregateTodayBreakdown(sessions);
  const total = sumTodayQI(sessions);
  const delta = weekAverageDelta(weekly);
  const isEmpty = sessions.length === 0;

  const now = new Date();
  const dday = computeDDay(now);

  const todoItems: TodoItem[] = todos.map((t) => ({
    id: t.id,
    text: t.text,
    subject: t.subject as Subject | null,
    minutes: t.minutes,
    done: t.done,
  }));

  return (
    <>
      <GreetingHeader name={displayName} dateText={formatDateKo(now)} />

      <StaggerList>
        <StaggerItem>
          <DDayCard label={dday.label} sub={dday.sub} target="2026 수능" />
        </StaggerItem>
        <StaggerItem>
          <MoodCheckin initialMood={mood?.mood_level ?? null} />
        </StaggerItem>
        <StaggerItem>
          <QIOverview
            total={Math.min(120, total)}
            weekly={weekly}
            breakdown={breakdown}
            deltaWeek={delta}
            empty={isEmpty}
          />
        </StaggerItem>
        <StaggerItem>
          <TodoList initial={todoItems} />
        </StaggerItem>
        <StaggerItem className="mt-1">
          <StartButton />
        </StaggerItem>
      </StaggerList>
    </>
  );
}
