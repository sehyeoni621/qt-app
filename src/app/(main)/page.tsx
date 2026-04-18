import { DDayCard } from "@/features/home/DDayCard";
import { GreetingHeader } from "@/features/home/GreetingHeader";
import { MoodCheckin } from "@/features/home/MoodCheckin";
import { QIOverview } from "@/features/home/QIOverview";
import { StartButton } from "@/features/home/StartButton";
import { StaggerItem, StaggerList } from "@/features/home/StaggerContainer";
import { TodoList } from "@/features/home/TodoList";
import { computeDDay } from "@/features/home/dday";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatDateKo(now: Date) {
  const w = ["일", "월", "화", "수", "목", "금", "토"];
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${w[now.getDay()]}요일`;
}

export default async function HomePage() {
  let name = "재현";
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      name =
        (user.user_metadata?.nickname as string | undefined) ??
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "재현";
    }
  } catch {
    // env 미설정 등은 무시 — 기본 이름 사용
  }

  const now = new Date();
  const dday = computeDDay(now);

  return (
    <>
      <GreetingHeader name={name} dateText={formatDateKo(now)} />

      <StaggerList>
        <StaggerItem>
          <DDayCard label={dday.label} sub={dday.sub} target="2026 수능" />
        </StaggerItem>
        <StaggerItem>
          <MoodCheckin />
        </StaggerItem>
        <StaggerItem>
          <QIOverview />
        </StaggerItem>
        <StaggerItem>
          <TodoList />
        </StaggerItem>
        <StaggerItem className="mt-1">
          <StartButton />
        </StaggerItem>
      </StaggerList>
    </>
  );
}
