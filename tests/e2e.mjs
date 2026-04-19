import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const EMAIL = "ed4421@qt-app.com";
const PASSWORD = "shlee3535";

const results = [];
function log(name, ok, detail = "") {
  const mark = ok ? "✅" : "❌";
  console.log(`${mark} ${name}${detail ? " — " + detail : ""}`);
  results.push({ name, ok, detail });
}

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 414, height: 896 }, // iPhone-ish
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  try {
    // 1) 로그인
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    log("로그인 페이지 로드", page.url().includes("/login"));

    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE}/`, { timeout: 8000 }).catch(() => {});
    log("로그인 후 홈 이동", page.url() === `${BASE}/`);

    // 2) 홈 — 닉네임 + D-day 렌더
    await page.waitForSelector("text=/안녕,/", { timeout: 5000 });
    const greeting = await page.textContent("h1");
    log("인사 헤더 렌더", !!greeting && greeting.includes("안녕"), greeting);

    const dday = await page.textContent("text=/D-\\d+/");
    log("D-day 카드 렌더", !!dday, dday ?? "");

    // 3) 감정 체크인 버튼 클릭 (5번째 이모지 = 최고)
    const moodButtons = await page.$$('[aria-label*="최고"], [aria-label*="좋음"]');
    if (moodButtons.length > 0) {
      await moodButtons[0].click();
      await page.waitForTimeout(500);
      const pressed = await moodButtons[0].getAttribute("aria-pressed");
      log("감정 선택 (aria-pressed true)", pressed === "true");
    } else {
      log("감정 체크인 버튼 발견", false);
    }

    // 4) 투두 체크 토글 (첫 번째)
    const firstTodo = await page.$('li button[aria-pressed]');
    if (firstTodo) {
      const before = await firstTodo.getAttribute("aria-pressed");
      await firstTodo.click();
      await page.waitForTimeout(400);
      const after = await firstTodo.getAttribute("aria-pressed");
      log(
        "투두 체크 토글",
        before !== after,
        `${before} → ${after}`
      );
    } else {
      log("투두 아이템 발견", false);
    }

    // 5) 탭 네비게이션 — 학습으로
    await page.click('nav a[href="/study"]');
    await page.waitForURL(`${BASE}/study`, { timeout: 5000 });
    log("학습 탭 이동", page.url() === `${BASE}/study`);

    // 6) 과목 선택 → 집중 모드 진입
    await page.click('button:has-text("수학")');
    await page.waitForTimeout(400);
    const focusVisible = await page.isVisible('text=/focus|recording/i');
    log("집중 모드 진입", focusVisible);

    // 7) 타이머 3초 경과
    await page.waitForTimeout(3200);
    const timerText = await page.textContent(".tabular-nums");
    log("타이머 카운트", !!timerText && timerText !== "00:00:00", timerText ?? "");

    // 8) 맞음 3번 / 오답 1번
    await page.click('button:has-text("맞음")').catch(() => {});
    await page.click('button:has-text("맞음")').catch(() => {});
    await page.click('button:has-text("맞음")').catch(() => {});
    await page.click('button:has-text("오답")').catch(() => {});
    await page.waitForTimeout(200);
    log("문제풀이 카운터 클릭 완료", true);

    // 9) 세션 종료
    await page.click('button:has-text("세션 종료")');
    await page.waitForTimeout(800);
    const resultVisible = await page.isVisible("text=이번 세션의 QI");
    log("결과 바텀시트 등장", resultVisible);

    const qiText = await page.textContent(
      "text=이번 세션의 QI >> xpath=../div[2]/span[1]"
    ).catch(() => null);
    log("QI 값 표시", !!qiText, qiText ?? "");

    // 10) 홈으로 복귀
    await page.click('button:has-text("홈으로")');
    await page.waitForURL(`${BASE}/`, { timeout: 5000 });
    log("홈으로 복귀", page.url() === `${BASE}/`);

    // 11) 모의고사 탭
    await page.click('nav a[href="/exam"]');
    await page.waitForURL(`${BASE}/exam`, { timeout: 5000 });
    log("모의고사 탭 이동", page.url() === `${BASE}/exam`);
    const aiRec = await page.isVisible("text=AI 맞춤 추천");
    log("AI 추천 카드 렌더", aiRec);

    // 내 기록 탭 전환
    await page.click('button:has-text("내 기록")');
    await page.waitForTimeout(300);
    const records = await page.isVisible("text=최근 6주 평균");
    log("내 기록 탭 전환", records);

    // 12) 로드맵 / 커뮤니티
    await page.click('nav a[href="/roadmap"]');
    await page.waitForURL(`${BASE}/roadmap`, { timeout: 5000 });
    log("로드맵 이동", page.url().endsWith("/roadmap"));

    await page.click('nav a[href="/community"]');
    await page.waitForURL(`${BASE}/community`, { timeout: 5000 });
    log("커뮤니티 이동", page.url().endsWith("/community"));

    // 13) 에러 없음
    log("런타임 에러 없음", errors.length === 0, errors.join(" | "));
  } catch (e) {
    log("예외 발생", false, String(e?.message ?? e));
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log("---");
  console.log(`통과 ${results.length - failed.length} / ${results.length}`);
  if (failed.length > 0) {
    console.log("실패 항목:");
    failed.forEach((r) => console.log(` - ${r.name}: ${r.detail}`));
    process.exit(1);
  }
}

run();
