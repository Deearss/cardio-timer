import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = "https://cardiotimer.netlify.app";

export const metadata: Metadata = {
  title: "Cardio Timer — HIIT Workout Timer Online",
  description:
    "Timer olahraga HIIT otomatis dengan 5 gerakan cardio: Jumping Jacks, Jump Squats, Burpees, Mountain Climbers. Pilih durasi & tingkat kesulitan, langsung mulai — gratis, tanpa install.",
  keywords: [
    "cardio timer",
    "HIIT timer",
    "workout timer",
    "interval timer",
    "exercise timer",
    "timer olahraga",
    "HIIT online",
    "cardio workout",
    "jumping jacks timer",
    "burpees timer",
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Cardio Timer — HIIT Workout Timer Online",
    description:
      "Timer olahraga HIIT otomatis dengan 5 gerakan cardio. Pilih durasi & tingkat kesulitan, langsung mulai.",
    url: BASE_URL,
    siteName: "Cardio Timer",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="ct-body">
        {children}
      </body>
    </html>
  );
}
