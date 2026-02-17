import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelGrid } from "geist/font/pixel";

export const metadata: Metadata = {
  title: "Convertor",
  description:
    "Transform media between formats instantly. Support for audio, video, and images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelGrid.variable} antialiased`}
      >
        <div className="min-h-screen font-sans">{children}</div>
      </body>
    </html>
  );
}
