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
  title: "ContactUs",
  description: "Chat app",
  themeColor: "#317EFB",
  icons: {
    icon: "/images/connect-us-logo.png",
    apple: "/images/connect-us-logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="relative h-full w-full bg-white">
          <div
            className="absolute inset-0 bg-[url('/images/connect-us-logo.png')] bg-repeat opacity-5"
            aria-hidden="true"></div>

          <div className="relative z-10"> {children}</div>
        </div>
      </body>
    </html>
  );
}
