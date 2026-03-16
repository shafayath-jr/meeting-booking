import type { Metadata } from "next";
import { Poppins, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import GradientBackground from "@/components/gradient-background";

import FeedbackButton from "@/components/feedback-button";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planet Education Networks",
  description: "Meeting booking system for Planet Education Networks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${sourceSerif.variable} antialiased`}>
        <Providers>
          <GradientBackground>
            <div className="relative z-10 flex min-h-screen flex-col">
              {/* <Navbar /> */}
              <main className="flex-1">{children}</main>
              {/* <Footer /> */}

              <FeedbackButton />
            </div>
          </GradientBackground>
        </Providers>
      </body>
    </html>
  );
}
