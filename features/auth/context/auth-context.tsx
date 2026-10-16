"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/features/auth/api/auth-api";
import type { AuthStatus, AuthUser } from "@/features/auth/model/types";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  login: (phoneNumber: string, password: string) => Promise<AuthUser>;
  completeRegistration: (
    completionToken: string,
    password: string,
    confirmPassword: string,
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;

    authApi
      .getSession()
      .then(({ user: sessionUser }) => {
        if (!active) return;
        setUser(sessionUser);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus("anonymous");
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (phoneNumber: string, password: string) => {
    const session = await authApi.login(phoneNumber, password);
    setUser(session.user);
    setStatus("authenticated");
    return session.user;
  }, []);

  const completeRegistration = useCallback(
    async (
      completionToken: string,
      password: string,
      confirmPassword: string,
    ) => {
      const session = await authApi.completeRegistration(
        completionToken,
        password,
        confirmPassword,
      );
      setUser(session.user);
      setStatus("authenticated");
      return session.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  const openDialog = useCallback(() => setIsDialogOpen(true), []);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const value = useMemo(
    () => ({
      user,
      status,
      isDialogOpen,
      openDialog,
      closeDialog,
      login,
      completeRegistration,
      logout,
    }),
    [
      user,
      status,
      isDialogOpen,
      openDialog,
      closeDialog,
      login,
      completeRegistration,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
