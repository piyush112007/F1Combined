import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "F1 Combined | Engineering Analytics",
  description: "Enterprise Formula 1 analytics platform for post-race intelligence.",
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image.png" type="image/png" />
        <link rel="shortcut icon" href="/image.png" />
        <link rel="apple-touch-icon" href="/image.png" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
