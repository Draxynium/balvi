"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/features/auth/components/auth-dialog";
import { useAuth } from "@/features/auth/hooks/use-auth";

function getSafeReturnPath() {
  const requestedPath = new URLSearchParams(window.location.search).get("next");
  return requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
    ? requestedPath
    : "/";
}

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getSafeReturnPath());
    }
  }, [router, status]);

  const close = useCallback(() => {
    router.replace("/");
  }, [router]);

  return (
    <main className="bg-muted/30 min-h-screen">
      <AuthDialog open onClose={close} />
    </main>
  );
}
