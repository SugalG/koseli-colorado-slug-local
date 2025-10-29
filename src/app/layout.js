import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import PageTransition from "@/components/ui/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata = {
  title: "Koseli Colorado",
  description: "Promoting Nepali cinema and music in the US",
  icons: {
    icon: "/site-icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-black text-white`}
      >
       
        {/*  Smooth fade transition for all pages */}
        <PageTransition>{children}</PageTransition>
       
      </body>
    </html>
  );
}
