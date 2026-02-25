import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import AmbientBackground from "@/components/ambient-background";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
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
      <body className={`${inter.variable} ${sourceSerif.variable} antialiased`}>
        <Providers>
          <div className="gradient-mesh relative min-h-screen overflow-hidden">
            <AmbientBackground />
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
