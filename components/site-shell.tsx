"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import PageTransition from "@/components/page-transition";
import SmoothScroll from "@/components/smooth-scroll";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <PageTransition>
      <NavigationBar />
      {children}
      <Footer />
      <SmoothScroll />
    </PageTransition>
  );
}
