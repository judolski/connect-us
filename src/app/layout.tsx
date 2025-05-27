import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/appDownloadPrompt";
import BottomNavigation from "@/components/BottomNavigation";
import ClientLayout from "@/components/myLayout";

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
      <body className="antialiased">
        <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white">
          {/* Fixed background image */}
          <div
            className="fixed inset-0 bg-[url('/images/connect-us-logo.png')] bg-repeat opacity-4 z-0"
            aria-hidden="true"></div>

          <InstallPrompt />

          <div className="w-full  relative z-10">
            <div className="flex items-start justify-center overflow-y-auto ">
              <div className="relative bg-white z-10 sm:max-w-lg sm:mt-4 w-full">
                <ClientLayout>{children}</ClientLayout>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
