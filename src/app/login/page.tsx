"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

type Mode = "signin" | "signup";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") && decodeURIComponent(searchParams.get("error")!)
  );
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(translateError(error.message));
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname || email.split("@")[0] },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setInfo(
        "인증 메일을 보냈어요. 받은편지함에서 링크를 눌러주세요. (개발 중엔 Supabase 대시보드에서 Confirm email을 OFF 해주세요)"
      );
      setLoading(false);
    }
  }

  async function resetPassword() {
    if (!email) {
      setError("이메일을 먼저 입력해주세요.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) setError(translateError(error.message));
    else setInfo("비밀번호 재설정 링크를 메일로 보냈습니다.");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6 py-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--cta)] text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.6)]">
          <span className="text-2xl font-semibold">QT</span>
        </div>
        <p className="mt-5 text-xs tracking-[0.3em] text-[var(--text-mid)] uppercase">
          dawn study
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-dark)]">
          {mode === "signin"
            ? "다시 집중할 준비됐나요?"
            : "오늘부터 질(QI)을 쌓아요"}
        </h1>
      </div>

      <div className="mx-auto flex w-full max-w-xs rounded-full bg-white/50 p-1 text-sm font-medium ring-1 ring-[var(--border)]">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={cn(
              "flex-1 rounded-full py-2 transition-colors",
              mode === m
                ? "bg-[var(--text-dark)] text-white"
                : "text-[var(--text-mid)]"
            )}
          >
            {m === "signin" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="frosted flex flex-col gap-3 rounded-3xl p-6 shadow-[0_20px_60px_-30px_rgba(31,35,64,0.25)]"
      >
        {mode === "signup" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-[var(--text-mid)] uppercase">
              닉네임 <span className="text-[var(--text-light)]">(선택)</span>
            </span>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="재현"
              maxLength={16}
              className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-[var(--text-mid)] uppercase">
            이메일
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-[var(--text-mid)] uppercase">
            비밀번호
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="최소 6자"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
          />
        </label>

        {error && (
          <p className="rounded-2xl bg-[var(--danger)]/10 px-3 py-2 text-xs leading-relaxed text-[var(--danger)]">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-2xl bg-[var(--success)]/15 px-3 py-2 text-xs leading-relaxed text-[var(--success)]">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-[var(--cta)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.6)] transition-colors hover:bg-[var(--cta-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "잠시만요…"
            : mode === "signin"
              ? "로그인"
              : "가입하고 시작하기"}
        </button>

        {mode === "signin" && (
          <button
            type="button"
            onClick={resetPassword}
            className="mt-1 text-xs text-[var(--text-mid)] hover:text-[var(--text-dark)]"
          >
            비밀번호 잊으셨나요?
          </button>
        )}
      </form>

      <p className="text-center text-[11px] leading-relaxed text-[var(--text-light)]">
        Google 간편 로그인은 배포 직전에 활성화됩니다.
      </p>
    </main>
  );
}

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("user already registered"))
    return "이미 가입된 이메일입니다. 로그인 탭에서 시도해보세요.";
  if (m.includes("email not confirmed"))
    return "메일함에서 인증 링크를 먼저 눌러주세요. (개발 중엔 Supabase의 Confirm email 토글 OFF 권장)";
  if (m.includes("password should be at least"))
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  if (m.includes("rate limit"))
    return "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.";
  return message;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
