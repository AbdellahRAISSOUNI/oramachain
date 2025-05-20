import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter as a fallback font until we add the custom fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-general-sans",
});

export const metadata: Metadata = {
  title: "OramaChain Premium | AI-Powered Blockchain Solutions",
  description: "Experience the future of blockchain with OramaChain's premium AI-powered solutions.",
  keywords: ["OramaChain", "blockchain", "AI", "premium", "crypto", "web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-primary text-text">
        {children}
      </body>
    </html>
  );
}
