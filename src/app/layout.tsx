import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from '@/components/Providers';
import {Toaster} from 'react-hot-toast'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Chatwithpdf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
          </body>
          <Toaster />
        </html>
      </Providers>  
    </ClerkProvider>
  );
}
