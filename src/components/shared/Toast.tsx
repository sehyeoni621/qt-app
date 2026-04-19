"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type ToastState = { message: string; key: number } | null;
let setter: ((t: ToastState) => void) | null = null;

export function toast(message: string) {
  if (setter) setter({ message, key: Date.now() });
}

export function ToastHost() {
  const [t, setT] = useState<ToastState>(null);

  useEffect(() => {
    setter = setT;
    return () => {
      setter = null;
    };
  }, []);

  useEffect(() => {
    if (!t) return;
    const id = window.setTimeout(() => setT(null), 2400);
    return () => window.clearTimeout(id);
  }, [t]);

  return (
    <div className="pointer-events-none fixed top-[calc(env(safe-area-inset-top)+12px)] left-1/2 z-[60] -translate-x-1/2">
      <AnimatePresence>
        {t && (
          <motion.div
            key={t.key}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="frosted rounded-full px-4 py-2 text-[13px] font-medium text-[var(--text-dark)] shadow-lg"
          >
            {t.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
