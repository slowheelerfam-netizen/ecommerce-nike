import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import {Navbar, Footer, CookieConsent} from '../components';

const jost = Jost({
  variable: "--font-jost",
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "Nike",
  description: "An e-commerce platform for Nike products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
