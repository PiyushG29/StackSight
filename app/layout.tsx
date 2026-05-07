import type { Metadata } from "next";
import "./globals.css";

const title = "StackSight | AI Spend Audit";
const description =
  "A free AI spend audit for startup teams that want a concrete plan to cut waste across coding, writing, research, and data tooling.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

