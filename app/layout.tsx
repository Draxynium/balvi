import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "@/components/navigation-bar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Your Website",
  description: "Your website description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <NavigationBar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}