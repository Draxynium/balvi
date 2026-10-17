import "server-only";

import { NextRequest, NextResponse } from "next/server";
import type { AuthUser, ProblemDetails } from "@/features/auth/model/types";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearSessionCookies,
  setSessionCookies,
} from "@/features/auth/server/session-cookies";
import { backendFetch } from "@/lib/api/server/backend";
import { isSameOrigin } from "@/lib/api/server/same-origin";

const MAX_REQUEST_BYTES = 16 * 1024;

const PUBLIC_POST_PATHS = new Set([
  "register/request-code",
  "register/verify-code",
  "password/request-code",
  "password/verify-code",
]);
const SESSION_POST_PATHS = new Set(["login", "register/complete", "refresh"]);
const OTHER_POST_PATHS = new Set(["logout", "password/reset"]);

type BackendAuthResponse = {
  accessToken: string;
  tokenType: string;
  accessTokenExpiresAtUtc: string;
  user: AuthUser;
};

type RouteContext = { params: Promise<{ path: string[] }> };

function problem(status: number, title: string, detail: string) {
  return NextResponse.json<ProblemDetails>(
    { status, title, detail },
    { status },
  );
}

async function readJsonBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Response("نوع محتوای درخواست پشتیبانی نمی‌شود.", { status: 415 });
  }
  if (contentLength > MAX_REQUEST_BYTES) {
    throw new Response("حجم درخواست بیشتر از حد مجاز است.", { status: 413 });
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
    throw new Response("حجم درخواست بیشتر از حد مجاز است.", { status: 413 });
  }

  try {
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Invalid JSON object");
    }
  } catch {
    throw new Response("ساختار اطلاعات ارسالی معتبر نیست.", { status: 400 });
  }

  return body;
}

async function callBackend(
  path: string,
  request: NextRequest,
  options: { body?: string; accessToken?: string; refreshToken?: string } = {},
) {
  const headers = new Headers({ Accept: "application/json" });
  const userAgent = request.headers.get("user-agent");

  if (options.body) headers.set("Content-Type", "application/json");
  if (userAgent) headers.set("User-Agent", userAgent.slice(0, 512));
  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }
  if (options.refreshToken) {
    headers.set("Cookie", `shop.refresh_token=${options.refreshToken}`);
  }

  return backendFetch(`/api/auth/${path}`, {
    method: path === "me" ? "GET" : "POST",
    headers,
    body: options.body,
    cache: "no-store",
  });
}

async function passThrough(response: Response) {
  const body = await response.text();
  return new NextResponse(body || null, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function establishSession(backendResponse: Response) {
  if (!backendResponse.ok) return passThrough(backendResponse);

  const auth = (await backendResponse.json()) as BackendAuthResponse;
  const response = NextResponse.json(
    { user: auth.user },
    { status: backendResponse.status },
  );
  response.headers.set("Cache-Control", "no-store");
  setSessionCookies(response, backendResponse, auth);
  return response;
}

async function refreshSession(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  const backendResponse = await callBackend("refresh", request, {
    refreshToken,
  });
  if (!backendResponse.ok) return null;

  const auth = (await backendResponse.json()) as BackendAuthResponse;
  return { backendResponse, auth };
}

export async function handleAuthGet(
  request: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;
  if (path.join("/") !== "me") {
    return problem(
      404,
      "مسیر پیدا نشد",
      "مسیر درخواستی احراز هویت وجود ندارد.",
    );
  }

  try {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

    if (accessToken) {
      const backendResponse = await callBackend("me", request, { accessToken });
      if (backendResponse.ok) {
        const user = (await backendResponse.json()) as AuthUser;
        const response = NextResponse.json({ user });
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
      if (backendResponse.status !== 401) return passThrough(backendResponse);
    }

    const refreshed = await refreshSession(request);
    if (!refreshed) {
      const response = problem(
        401,
        "نیاز به ورود",
        "نشست فعالی پیدا نشد. لطفاً دوباره وارد شوید.",
      );
      clearSessionCookies(response);
      return response;
    }

    const response = NextResponse.json({ user: refreshed.auth.user });
    response.headers.set("Cache-Control", "no-store");
    setSessionCookies(response, refreshed.backendResponse, refreshed.auth);
    return response;
  } catch {
    return problem(
      502,
      "اختلال در ارتباط",
      "در حال حاضر ارتباط با سرویس احراز هویت برقرار نیست.",
    );
  }
}

export async function handleAuthPost(
  request: NextRequest,
  context: RouteContext,
) {
  if (!isSameOrigin(request)) {
    return problem(
      403,
      "دسترسی غیرمجاز",
      "ارسال درخواست از این مبدأ مجاز نیست.",
    );
  }

  const { path } = await context.params;
  const authPath = path.join("/");
  const isPublic = PUBLIC_POST_PATHS.has(authPath);
  const isSession = SESSION_POST_PATHS.has(authPath);
  const isOther = OTHER_POST_PATHS.has(authPath);

  if (!isPublic && !isSession && !isOther) {
    return problem(
      404,
      "مسیر پیدا نشد",
      "مسیر درخواستی احراز هویت وجود ندارد.",
    );
  }

  try {
    if (authPath === "refresh") {
      const refreshed = await refreshSession(request);
      if (!refreshed) {
        const response = problem(
          401,
          "نیاز به ورود",
          "نشست کاربری قابل تمدید نیست. لطفاً دوباره وارد شوید.",
        );
        clearSessionCookies(response);
        return response;
      }
      const response = NextResponse.json({ user: refreshed.auth.user });
      setSessionCookies(response, refreshed.backendResponse, refreshed.auth);
      return response;
    }

    if (authPath === "logout") {
      const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
      if (refreshToken) {
        try {
          await callBackend("logout", request, { refreshToken });
        } catch {
          // Local cookies must still be cleared if the upstream is unavailable.
        }
      }
      const response = new NextResponse(null, { status: 204 });
      clearSessionCookies(response);
      return response;
    }

    const body = await readJsonBody(request);
    const backendResponse = await callBackend(authPath, request, { body });

    if (authPath === "login" || authPath === "register/complete") {
      return establishSession(backendResponse);
    }

    const response = await passThrough(backendResponse);
    if (authPath === "password/reset" && backendResponse.ok) {
      clearSessionCookies(response);
    }
    return response;
  } catch (error) {
    if (error instanceof Response) return error;
    return problem(
      502,
      "اختلال در ارتباط",
      "در حال حاضر ارتباط با سرویس احراز هویت برقرار نیست.",
    );
  }
}
