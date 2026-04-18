import { BottomTabBar } from "./BottomTabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col">
      {/* 상단 세이프 영역 */}
      <div className="h-[calc(env(safe-area-inset-top))]" aria-hidden />

      {/* 메인 영역 — 하단 탭바(≈84px) 공간 확보 */}
      <main className="flex-1 pb-28">{children}</main>

      {/* 하단 탭바 (고정) */}
      <BottomTabBar />
    </div>
  );
}
