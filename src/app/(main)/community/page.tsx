import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ROOMS } from "@/features/community/rooms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  // 각 방의 최신 글 수 + 마지막 글 미리보기
  type RoomCount = { room: string; count: number; latest?: string };
  const stats: Record<string, { count: number; latest?: string }> = {};

  try {
    const supabase = await createSupabaseServerClient();
    // 최근 50개만 스캔해서 방별 카운트
    const { data } = await supabase
      .from("community_posts")
      .select("room, content, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) {
      for (const p of data) {
        const s = stats[p.room] ?? { count: 0, latest: undefined };
        s.count += 1;
        if (!s.latest) s.latest = p.content;
        stats[p.room] = s;
      }
    }
  } catch {
    // env 미설정 시 stats 비어있음
  }

  return (
    <>
      <PageHeader
        eyebrow="community"
        title="N수생 커뮤니티"
        subtitle="같은 목표, 같은 속도의 사람들."
      />

      <div className="flex flex-col gap-3 px-5 pb-6">
        {/* 인증 배지 */}
        <div className="frosted flex items-start gap-3 rounded-3xl p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--success)]/15 text-[var(--success)]">
            <ShieldCheck size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-dark)]">
              N수생 인증 커뮤니티
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--text-mid)]">
              초·중·고등학생 혼재 없이. Phase 2에 졸업연도 증빙 추가 예정.
            </p>
          </div>
        </div>

        {/* 방 리스트 */}
        <p className="mt-2 text-[11px] tracking-[0.25em] text-[var(--text-mid)] uppercase">
          목표군별 방
        </p>
        <ul className="flex flex-col gap-2">
          {ROOMS.map((r) => {
            const s = stats[r.id] ?? { count: 0 };
            return (
              <li key={r.id}>
                <Link
                  href={`/community/${encodeURIComponent(r.id)}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 px-3.5 py-3 ring-1 ring-[var(--border-strong)] transition-colors hover:bg-white"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                    style={{
                      background: `color-mix(in oklab, ${r.tint} 22%, white)`,
                    }}
                  >
                    {r.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-[var(--text-dark)]">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-[var(--text-light)]">
                        {r.description}
                      </p>
                    </div>
                    {s.latest ? (
                      <p className="mt-0.5 truncate text-[12px] text-[var(--text-mid)]">
                        {s.latest}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[11px] text-[var(--text-light)]">
                        아직 글이 없어요
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    {s.count > 0 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ background: r.tint }}
                      >
                        {s.count}
                      </span>
                    )}
                    <ChevronRight
                      size={16}
                      className="text-[var(--text-light)]"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
