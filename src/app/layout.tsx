import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/app/Providers";
import Footer from "@/components/Footer";
import { ModernNavbar } from "@/components/ui/navbar-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photo Elevate - AI Image Upscaler",
  description:
    "Enhance and upscale your photos using state-of-the-art AI technology. Fast, free, and easy to use.",
  openGraph: {
    title: "Photo Elevate - AI Image Upscaler",
    description:
      "Enhance and upscale your photos using state-of-the-art AI technology.",
    url: "https://www.photoelevate.tech/",
    siteName: "Photo Elevate",
    images: [
      {
        url: "/website-preview.png",
        width: 1200,
        height: 630,
        alt: "Photo Elevate preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <header className="z-100 ">
            <ModernNavbar />
          </header>
          <main className="mx-auto">{children}</main>
          <footer id="contact" className="z-100 text-white">
            <Footer />
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
