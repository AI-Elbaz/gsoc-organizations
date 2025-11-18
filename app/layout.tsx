import {Geist, Geist_Mono} from "next/font/google";

import {NuqsAdapter} from "nuqs/adapters/next";

import type {Metadata} from "next";

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
  title: "Gsoc Organizations List",
  description: "A list of organizations participating in GSoC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
