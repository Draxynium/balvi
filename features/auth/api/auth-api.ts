import type {
  AuthSession,
  ProblemDetails,
  VerificationCodeResult,
  VerificationResult,
} from "@/features/auth/model/types";

const AUTH_API_PATH = "/api/auth";

export class AuthApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem?: ProblemDetails,
  ) {
    super(problem?.detail || problem?.title || "Authentication request failed");
    this.name = "AuthApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${AUTH_API_PATH}/${path}`, {
      ...init,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new AuthApiError(0);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload =
    contentType.includes("application/json") || contentType.includes("+json")
      ? await response.json()
      : undefined;

  if (!response.ok) {
    throw new AuthApiError(
      response.status,
      payload as ProblemDetails | undefined,
    );
  }

  return payload as T;
}

const post = <T>(path: string, body?: object) =>
  request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

export const authApi = {
  getSession: () => request<AuthSession>("me"),

  login: (phoneNumber: string, password: string) =>
    post<AuthSession>("login", { phoneNumber, password }),

  logout: () => post<void>("logout"),

  requestRegistrationCode: (phoneNumber: string) =>
    post<VerificationCodeResult>("register/request-code", { phoneNumber }),

  verifyRegistrationCode: (challengeId: string, code: string) =>
    post<VerificationResult>("register/verify-code", { challengeId, code }),

  completeRegistration: (
    completionToken: string,
    password: string,
    confirmPassword: string,
  ) =>
    post<AuthSession>("register/complete", {
      completionToken,
      password,
      confirmPassword,
    }),

  requestPasswordResetCode: (phoneNumber: string) =>
    post<VerificationCodeResult>("password/request-code", { phoneNumber }),

  verifyPasswordResetCode: (challengeId: string, code: string) =>
    post<VerificationResult>("password/verify-code", { challengeId, code }),

  resetPassword: (
    completionToken: string,
    newPassword: string,
    confirmPassword: string,
  ) =>
    post<void>("password/reset", {
      completionToken,
      newPassword,
      confirmPassword,
    }),
};

export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof AuthApiError)) {
    return "خطای پیش‌بینی‌نشده‌ای رخ داد. دوباره تلاش کنید.";
  }

  if (error.status === 0 || error.status >= 500) {
    return "ارتباط با سرور برقرار نشد. کمی بعد دوباره تلاش کنید.";
  }

  if (error.status === 401) {
    return "شماره تماس یا رمز عبور صحیح نیست.";
  }

  if (error.status === 409) {
    return "برای این شماره تماس قبلاً حساب کاربری ساخته شده است.";
  }

  if (error.status === 429) {
    return "تعداد درخواست‌ها زیاد است. کمی صبر کنید و دوباره تلاش کنید.";
  }

  const detail = error.problem?.detail?.toLowerCase() ?? "";

  if (detail.includes("expired"))
    return "اعتبار کد تمام شده است؛ کد جدید بگیرید.";
  if (detail.includes("verification") || detail.includes("code")) {
    return "کد تأیید واردشده صحیح نیست.";
  }
  if (detail.includes("password")) {
    return "رمز عبور شرایط لازم را ندارد. حداقل ۸ کاراکتر وارد کنید.";
  }

  return "اطلاعات واردشده معتبر نیست. لطفاً دوباره بررسی کنید.";
}
