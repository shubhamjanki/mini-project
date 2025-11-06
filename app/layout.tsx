import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "./_component/ui/page-transition";
import { NavigationTransition } from "./_component/ui/navigation-transition";
import { Dancing_Script, Caveat } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interview AI - Master Your Next Interview",
  description:
    "Practice real interview scenarios with AI. Get instant feedback, track your progress, and land your dream job with confidence.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`font-sans antialiased ${dancingScript.variable} ${caveat.variable}`}>
          <ConvexClientProvider>
            <Suspense fallback={null}>
              <NavigationTransition />
              <PageTransition>{children}</PageTransition>
            </Suspense>
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
