import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  /* 700 is here for the wordmark only — the display type stays at 400. */
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sortinghat.ai"),
  title: "Sortinghat | AI Native ATS for staffing firms",
  description:
    "AI Native ATS built for top 1% staffing firms. We don't just track roles. We 10x your recruiters and bet on your firm's growth.",
  openGraph: {
    title: "Sortinghat | AI Native ATS for staffing firms",
    description:
      "AI Native ATS built for top 1% staffing firms. We don't just track roles. We 10x your recruiters and bet on your firm's growth.",
    url: "https://sortinghat.ai",
    siteName: "Sortinghat",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
