import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-poppins-loaded" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter-loaded" });

export const metadata: Metadata = {
  title: "FitPlate: personalised exercise and diet plans",
  description: "AI-powered exercise and meal recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}