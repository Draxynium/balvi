import type { ProblemDetails } from "@/features/auth/model/types";

export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem?: ProblemDetails,
  ) {
    super(problem?.detail || problem?.title || "Admin request failed");
    this.name = "AdminApiError";
  }
}

async function parseResponse(response: Response) {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json") || contentType.includes("+json")) {
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

export async function adminRequest<T>(
  path: string,
  init: RequestInit = {},
  retryAfterRefresh = true,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`/api/admin/${path.replace(/^\//, "")}`, {
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
    throw new AdminApiError(0);
  }

  if (response.status === 401 && retryAfterRefresh) {
    try {
      if (await refreshSession()) return adminRequest<T>(path, init, false);
    } catch {
      // The original unauthorized response is handled below.
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw new AdminApiError(response.status, payload as ProblemDetails | undefined);
  }

  return payload as T;
}

export function getAdminApiErrorMessage(error: unknown, subject: string) {
  if (!(error instanceof AdminApiError)) {
    return "خطای پیش‌بینی‌نشده‌ای رخ داد. دوباره تلاش کنید.";
  }
  if (error.status === 0 || error.status >= 500) {
    return "ارتباط با سرور برقرار نشد. کمی بعد دوباره تلاش کنید.";
  }
  if (error.status === 401) return "نشست شما منقضی شده است. دوباره وارد شوید.";
  if (error.status === 403) return "این عملیات فقط برای مدیر سیستم مجاز است.";
  if (error.status === 404) return `${subject} موردنظر پیدا نشد.`;
  if (error.status === 409) {
    return error.problem?.detail || `${subject} قابل حذف یا تغییر نیست.`;
  }
  return error.problem?.detail || "اطلاعات واردشده معتبر نیست.";
}
