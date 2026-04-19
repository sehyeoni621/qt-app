"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

type Mode = "signin" | "signup";

const VIRTUAL_EMAIL_DOMAIN = "qt-app.com";

function isEmail(s: string) {
  return /@/.test(s);
}

function toEmail(idOrEmail: string) {
  const v = idOrEmail.trim();
  return isEmail(v) ? v.toLowerCase() : `${v.toLowerCase()}@${VIRTUAL_EMAIL_DOMAIN}`;
}

function validateId(id: string) {
  // 영문/숫자/언더스코어/하이픈, 3~20자
  return /^[a-zA-Z0-9_-]{3,20}$/.test(id);
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");

  // 로그인
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 회원가입
  const [signupName, setSignupName] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPw, setSignupPw] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") && decodeURIComponent(searchParams.get("error")!)
  );

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const email = toEmail(loginId);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: loginPw,
    });
    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const name = signupName.trim();
    const id = signupId.trim();
    if (!name) return setError("이름을 입력해주세요.");
    if (!validateId(id)) {
      return setError(
        "아이디는 영문·숫자·_·- 만 가능해요 (3~20자)."
      );
    }
    if (signupPw.length < 6) {
      return setError("비밀번호는 최소 6자 이상이어야 합니다.");
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const email = toEmail(id);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: signupPw,
      options: {
        data: { nickname: name, username: id },
      },
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }

    // 세션 바로 돌아오면 성공
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    // 세션 없을 때 (서버 설정에 따라): 같은 자격으로 즉시 로그인 시도
    const { error: signinErr } = await supabase.auth.signInWithPassword({
      email,
      password: signupPw,
    });
    if (signinErr) {
      setError("계정은 생성됐어요. 로그인 탭에서 다시 시도해주세요.");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
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

      {mode === "signin" ? (
        <form
          onSubmit={handleSignIn}
          className="frosted flex flex-col gap-3 rounded-3xl p-6 shadow-[0_20px_60px_-30px_rgba(31,35,64,0.25)]"
        >
          <Field label="아이디" hint="이메일로 가입한 계정이면 이메일도 가능">
            <input
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="ed4421 또는 email@…"
              autoComplete="username"
              required
              className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
            />
          </Field>
          <Field label="비밀번호">
            <input
              type="password"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
              className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
            />
          </Field>

          {error && <ErrorBox>{error}</ErrorBox>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[var(--cta)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.6)] transition-colors hover:bg-[var(--cta-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "로그인 중…" : "로그인"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSignUp}
          className="frosted flex flex-col gap-3 rounded-3xl p-6 shadow-[0_20px_60px_-30px_rgba(31,35,64,0.25)]"
        >
          <Field label="이름" hint="앱에서 표시될 이름">
            <input
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              placeholder="김재현"
              maxLength={24}
              required
              className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
            />
          </Field>
          <Field label="아이디" hint="영문·숫자·_·- · 3~20자">
            <input
              value={signupId}
              onChange={(e) =>
                setSignupId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))
              }
              placeholder="ed4421"
              maxLength={20}
              required
              autoComplete="username"
              autoCapitalize="none"
              className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
            />
          </Field>
          <Field label="비밀번호">
            <input
              type="password"
              value={signupPw}
              onChange={(e) => setSignupPw(e.target.value)}
              placeholder="최소 6자"
              minLength={6}
              required
              autoComplete="new-password"
              className="rounded-2xl bg-white/80 px-4 py-3 text-[15px] text-[var(--text-dark)] outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--cta)]"
            />
          </Field>

          {error && <ErrorBox>{error}</ErrorBox>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[var(--cta)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(245,155,130,0.6)] transition-colors hover:bg-[var(--cta-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "가입 중…" : "가입하고 시작하기"}
          </button>
        </form>
      )}

      <p className="text-center text-[11px] leading-relaxed text-[var(--text-light)]">
        가입 시 이용약관과 개인정보처리방침에 동의하는 것으로 간주됩니다.
        <br />
        큐티는 성적·감정 데이터를 암호화해 저장합니다.
      </p>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium tracking-wide text-[var(--text-mid)] uppercase">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-[var(--text-light)]">{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl bg-[var(--danger)]/10 px-3 py-2 text-xs leading-relaxed text-[var(--danger)]">
      {children}
    </p>
  );
}

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "아이디 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("user already registered"))
    return "이미 사용 중인 아이디입니다. 로그인 탭에서 시도해보세요.";
  if (m.includes("email address") && m.includes("invalid"))
    return "아이디에 허용되지 않은 문자가 들어있어요.";
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
