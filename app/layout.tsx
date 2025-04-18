import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '플로우차트를 그려줄게요',
  description: 'Convert between Mermaid, JSON, and HTML Table formats by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
