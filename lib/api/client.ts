import type { ProblemDetails } from "@/features/auth/model/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem?: ProblemDetails,
  ) {
    super(problem?.detail || problem?.title || "API request failed");
    this.name = "ApiError";
  }
}

async function parseResponse(response: Response) {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (
    contentType.includes("application/json") ||
    contentType.includes("+json")
  ) {
    return response.json();
  }

  return undefined;
}

async function refreshSession() {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  return response.ok;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  retryAfterRefresh = true,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`/api/store/${path.replace(/^\//, "")}`, {
      ...init,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0);
  }

  if (response.status === 401 && retryAfterRefresh) {
    try {
      if (await refreshSession()) return apiRequest<T>(path, init, false);
    } catch {
      // The original unauthorized response is handled below.
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new ApiError(response.status, payload as ProblemDetails | undefined);
  }

  return payload as T;
}

export function getApiErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return "خطای پیش‌بینی‌نشده‌ای رخ داد. دوباره تلاش کنید.";
  }
  if (error.status === 0 || error.status >= 500) {
    return "ارتباط با سرور برقرار نشد. کمی بعد دوباره تلاش کنید.";
  }
  if (error.status === 401) return "برای ادامه ابتدا وارد حساب کاربری شوید.";
  if (error.status === 404) return "اطلاعات درخواستی پیدا نشد.";
  if (error.status === 409) {
    return "موجودی یا وضعیت محصول تغییر کرده است. سبد خرید را دوباره بررسی کنید.";
  }
  if (error.status === 429) return "تعداد درخواست‌ها زیاد است؛ کمی صبر کنید.";
  return "اطلاعات واردشده معتبر نیست. لطفاً موارد را دوباره بررسی کنید.";
}
