"use client";

import { AuthDialog } from "@/features/auth/components/auth-dialog";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function AuthDialogHost() {
  const { isDialogOpen, closeDialog } = useAuth();
  return isDialogOpen ? <AuthDialog open onClose={closeDialog} /> : null;
}
