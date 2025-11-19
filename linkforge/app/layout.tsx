import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkForge",
  description: "One link for everything you create.",
  applicationName: "LinkForge"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

