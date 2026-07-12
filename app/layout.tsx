import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danumai.com"),
  title: {
    default: "Danumai Inc. — A house of ventures",
    template: "%s — Danumai Inc.",
  },
  description:
    "Danumai builds and operates its own products — from BanglaReels and Danumai Studios to caregiver technology — engineered in-house by Danumai Labs.",
  openGraph: {
    title: "Danumai Inc. — A house of ventures",
    description:
      "We don't build for clients. We build for ourselves — streaming, stories, and care technology, engineered under one roof.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-ink text-paper">
        {children}
      </body>
    </html>
  );
}
