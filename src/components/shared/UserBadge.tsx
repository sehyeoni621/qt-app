import Link from "next/link";
import { LogIn } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function UserBadge() {
  let email: string | null = null;
  let name: string | null = null;
  let avatarUrl: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      email = user.email ?? null;
      name =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        email?.split("@")[0] ??
        null;
      avatarUrl =
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        null;
    }
  } catch {
    // env 미설정 등 — 그냥 비로그인 상태로 취급
  }

  if (!name) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <LogIn size={13} strokeWidth={2.4} />
        로그인
      </Link>
    );
  }

  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        title="로그아웃"
        className="flex items-center gap-2 rounded-full bg-white/70 py-1 pr-3 pl-1 text-xs font-medium text-[var(--text-dark)] ring-1 ring-[var(--border)] transition-colors hover:bg-white"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cta)] text-[11px] font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="max-w-[90px] truncate">{name}</span>
      </button>
    </form>
  );
}
