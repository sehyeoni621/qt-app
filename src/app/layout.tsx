import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "큐티 (QT) — 질로 증명하는 N수생 학습",
  description:
    "열품타는 시간을 재고, 큐티는 질을 잰다. N수생을 위한 QI(Quality Index) 기반 학습 허브.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F5F1EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
