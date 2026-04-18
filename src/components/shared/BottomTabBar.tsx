"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Timer, ClipboardList, Map, Users } from "lucide-react";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  icon: typeof Home;
  soon?: boolean;
};

const TABS: Tab[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/study", label: "학습", icon: Timer },
  { href: "/exam", label: "모의", icon: ClipboardList },
  { href: "/roadmap", label: "로드맵", icon: Map, soon: true },
  { href: "/community", label: "커뮤니티", icon: Users, soon: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주 메뉴"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2"
    >
      <div className="frosted pointer-events-auto flex w-full items-center justify-between rounded-full px-2 py-1.5 shadow-[0_20px_60px_-20px_rgba(31,35,64,0.25)]">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 transition-colors",
                active
                  ? "text-[var(--text-dark)]"
                  : "text-[var(--text-light)] hover:text-[var(--text-mid)]"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  active && "bg-[var(--cta)] text-white shadow-sm"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className="text-[10px] font-medium tracking-tight">
                {tab.label}
              </span>
              {tab.soon && (
                <span className="absolute -right-0.5 top-0 rounded-full bg-[var(--lavender)]/90 px-1.5 py-[1px] text-[8px] font-semibold tracking-wide text-white uppercase">
                  soon
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
