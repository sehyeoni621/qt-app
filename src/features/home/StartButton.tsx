"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function StartButton() {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Link
        href="/study"
        className="flex items-center justify-between gap-3 rounded-full bg-[var(--text-dark)] px-6 py-4 shadow-[0_18px_40px_-18px_rgba(31,35,64,0.55)]"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-white">
            지금 공부 시작
          </span>
          <span className="text-xs text-white/60">QI 쌓기</span>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cta)] text-white">
          <ArrowRight size={16} strokeWidth={2.4} />
        </span>
      </Link>
    </motion.div>
  );
}
