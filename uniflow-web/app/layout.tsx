import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFlow",
  description: "University project — do not modify without team warning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
