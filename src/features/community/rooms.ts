export type Room = {
  id: string; // DB room field와 일치
  name: string;
  emoji: string;
  tint: string;
  description: string;
};

export const ROOMS: Room[] = [
  {
    id: "의대",
    name: "의대반",
    emoji: "🩺",
    tint: "var(--cta)",
    description: "의학계열 지망 N수생",
  },
  {
    id: "서울대",
    name: "서울대반",
    emoji: "🌟",
    tint: "var(--primary)",
    description: "SKY 상위권 목표",
  },
  {
    id: "한의대",
    name: "한의대반",
    emoji: "🌿",
    tint: "var(--success)",
    description: "한의학 계열",
  },
  {
    id: "치대",
    name: "치대반",
    emoji: "🦷",
    tint: "var(--gold)",
    description: "치의학 계열",
  },
  {
    id: "사범대",
    name: "사범·교대반",
    emoji: "✏️",
    tint: "var(--lavender)",
    description: "교원 양성 계열",
  },
  {
    id: "고민",
    name: "익명 고민방",
    emoji: "🫂",
    tint: "var(--text-mid)",
    description: "슬럼프·멘탈 이야기",
  },
];

export function getRoom(id: string): Room | null {
  return ROOMS.find((r) => r.id === id) ?? null;
}
