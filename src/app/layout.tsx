import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delish Mama | Cake Studio & Cafe",
  description: "Artisanal cakes, handcrafted pastries, and specialty coffee at Delish Mama.",
  icons: {
    icon: "/logo.png",
  }
};

import { CartProvider } from "@/context/CartContext";
import PincodeChecker from "@/components/PincodeChecker";
import Chatbot from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <CartProvider>
          <PincodeChecker />
          {children}
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}
