import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINE Answers",
  description: "Created by Ryosuke Fukuchi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="ja">
      <body className="relative bg-[#e9f5e6]">
        {children}
        <footer className="absolute bottom-0 inset-x-0 text-center text-stone-700 p-1">
          <small>© {year} LINE Answers</small>
        </footer>
      </body>
    </html>
  );
}
