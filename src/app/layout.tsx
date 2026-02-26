import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kevin Olson | AI Integration Specialist",
  description:
    "I help businesses integrate AI into their products and workflows. Faster delivery, smarter automation, real results.",
  openGraph: {
    title: "Kevin Olson | AI Integration Specialist",
    description:
      "I help businesses integrate AI into their products and workflows. Faster delivery, smarter automation, real results.",
    url: "https://kevinolson.ai",
    siteName: "Kevin Olson",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
