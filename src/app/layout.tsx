import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/appDownloadPrompt";
import BottomNavigation from "@/components/BottomNavigation";

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
          <div>
            <InstallPrompt />
          </div>

          <div className="">
            <div className="relative z-10 mb-18 sm:mb-16">{children}</div>
            <div className="fixed bottom-0 left-0 w-full z-20">
              <BottomNavigation />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
