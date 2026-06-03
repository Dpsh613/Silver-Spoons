import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

// Standard font for text
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Elegant font for headings
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "The Golden Fork | Fine Dining",
  description: "Experience culinary excellence at The Golden Fork.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-stone-50 text-stone-900 antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}