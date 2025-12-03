// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TTB Alcohol Label Verifier",
  description: "AI-Powered TTB Compliance Checker",
};

// This suppresses hydration warnings caused by browser extensions
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="antialiased font-sans bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}