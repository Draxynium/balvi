import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { AuthDialogHost } from "@/features/auth/components/auth-dialog-host";
import { SiteShell } from "@/components/site-shell";
import { CartProvider } from "@/features/cart/context/cart-context";

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
          <CartProvider>
            <SiteShell>{children}</SiteShell>
            <AuthDialogHost />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
