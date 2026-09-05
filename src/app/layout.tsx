import type { Metadata } from "next";
import "./globals.css";
import "./report.css";
import "./tweaks.css";
import "./responsive.css";

export const metadata: Metadata = {
  title: "LaunchLens — Website health, made clear",
  description: "A clear, shareable audit for any public website.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
