import "server-only";

import { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "shop.access_token";
export const REFRESH_TOKEN_COOKIE = "shop.refresh_token";

type BackendAuthPayload = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
};

const sharedOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  priority: "high" as const,
};

function parseRefreshCookie(setCookieHeader: string | null) {
  if (!setCookieHeader) return null;

  const valueMatch = setCookieHeader.match(
    /(?:^|,\s*)shop\.refresh_token=([^;]*)/i,
  );
  if (!valueMatch?.[1]) return null;

  const expiresMatch = setCookieHeader.match(/expires=([^;]+)/i);
  const expires = expiresMatch?.[1] ? new Date(expiresMatch[1]) : undefined;

  return {
    value: valueMatch[1],
    expires: expires && !Number.isNaN(expires.getTime()) ? expires : undefined,
  };
}

export function setSessionCookies(
  response: NextResponse,
  backendResponse: Response,
  auth: BackendAuthPayload,
) {
  const accessTokenExpiresAt = new Date(auth.accessTokenExpiresAtUtc);
  const refresh = parseRefreshCookie(backendResponse.headers.get("set-cookie"));

  response.cookies.set(ACCESS_TOKEN_COOKIE, auth.accessToken, {
    ...sharedOptions,
    path: "/api",
    expires: Number.isNaN(accessTokenExpiresAt.getTime())
      ? undefined
      : accessTokenExpiresAt,
  });

  if (refresh) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, refresh.value, {
      ...sharedOptions,
      path: "/api/auth",
      expires: refresh.expires,
    });
  }
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...sharedOptions,
    path: "/api",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...sharedOptions,
    path: "/api/auth",
    maxAge: 0,
  });
}
