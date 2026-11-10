import type { Metadata } from "next";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import { cn } from "@/lib/utils";



export const metadata: Metadata = {

  title: "REMERA CHURCH OF THE NAZARENE - Welcome Home",

  description: "A place of worship, fellowship, and spiritual growth",

};



export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (

    <html lang="en" suppressHydrationWarning>

      <body

        className={cn(

          "min-h-screen bg-background text-foreground font-sans antialiased"

        )}

      >

        <ThemeProvider>

          <Navbar />

          <main className="min-h-screen">{children}</main>

          <Footer />

        </ThemeProvider>

      </body>

    </html>

  );

}

