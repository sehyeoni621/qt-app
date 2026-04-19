import type { LucideIcon } from "lucide-react";
import { BookOpen, Calculator, Globe2, Microscope } from "lucide-react";
import type { Subject } from "@/features/home/mockData";

export const SUBJECT_META: Record<
  Subject,
  { icon: LucideIcon; tint: string; todaySeconds: number }
> = {
  국어: { icon: BookOpen, tint: "var(--cta)", todaySeconds: 72 * 60 },
  수학: { icon: Calculator, tint: "var(--primary)", todaySeconds: 135 * 60 },
  영어: { icon: Globe2, tint: "var(--success)", todaySeconds: 0 },
  탐구: { icon: Microscope, tint: "var(--lavender)", todaySeconds: 48 * 60 },
};

export const SUBJECTS: Subject[] = ["국어", "수학", "영어", "탐구"];
