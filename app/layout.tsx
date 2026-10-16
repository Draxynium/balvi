import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "@/components/navigation-bar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smooth-scroll";
import PageTransition from "@/components/page-transition";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { AuthDialogHost } from "@/features/auth/components/auth-dialog-host";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang="fa"
      dir="rtl"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <AuthProvider>
          <PageTransition>
            <NavigationBar />
            {children}
            <Footer />
            <SmoothScroll />
          </PageTransition>
          <AuthDialogHost />
        </AuthProvider>
      </body>
    </html>
  );
}
