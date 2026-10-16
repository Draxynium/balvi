export type AuthUser = {
  id: string;
  phoneNumber: string;
  role: string | null;
};

export type AuthSession = {
  user: AuthUser;
};

export type VerificationCodeResult = {
  challengeId: string;
  phoneNumber: string;
  expiresAtUtc: string;
  retryAfterSeconds: number;
  developmentCode: string | null;
};

export type VerificationResult = {
  completionToken: string;
  expiresAtUtc: string;
};

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
};

export type AuthStatus = "loading" | "authenticated" | "anonymous";
