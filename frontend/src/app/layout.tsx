import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Champions League Draw",
  description: "UCL Swiss Round Draw — 36 teams, 8 match days, 144 matches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
