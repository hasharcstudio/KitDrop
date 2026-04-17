import type { Metadata } from "next";
import { Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";
import { Toaster } from 'sonner';
import AuthProvider from "@/components/providers/AuthProvider";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KITDROP — Global Football Kit Shop",
  description:
    "Shop 200+ authentic kits from Premier League, La Liga, Bundesliga, Serie A and elite global leagues. Technical gear for the modern supporter.",
  keywords: [
    "football kits",
    "soccer jerseys",
    "authentic kits",
    "premier league",
    "la liga",
    "bundesliga",
    "serie a",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body className="bg-background text-on-surface font-body antialiased min-h-screen">
        <AuthProvider>
          <ClientShell>{children}</ClientShell>
          <Toaster theme="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
