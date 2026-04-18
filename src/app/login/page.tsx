"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--cta)] text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.6)]">
        <span className="text-2xl font-semibold">QT</span>
      </div>

      <div>
        <p className="text-xs tracking-[0.3em] text-[var(--text-mid)] uppercase">
          welcome back
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-dark)]">
          다시 집중할 준비됐나요?
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          Google 계정으로 3초 만에 시작합니다.
        </p>
      </div>

      <div className="frosted w-full rounded-3xl p-6 shadow-[0_20px_60px_-30px_rgba(31,35,64,0.25)]">
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-4 py-3.5 text-sm font-medium text-[var(--text-dark)] shadow-sm ring-1 ring-[var(--border-strong)] transition-colors hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{loading ? "구글로 이동 중…" : "Google로 계속하기"}</span>
        </button>

        {error && (
          <p className="mt-4 rounded-2xl bg-[var(--danger)]/10 px-3 py-2 text-xs leading-relaxed text-[var(--danger)]">
            {decodeURIComponent(error)}
          </p>
        )}

        <p className="mt-5 text-[11px] leading-relaxed text-[var(--text-light)]">
          로그인 시 이용약관과 개인정보처리방침에 동의하는 것으로 간주됩니다.
          큐티는 성적·감정 데이터를 암호화해 저장합니다.
        </p>
      </div>

      <p className="text-[11px] tracking-wide text-[var(--text-light)] uppercase">
        n수생 전용 · 졸업연도 인증 예정
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden
      className="shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
