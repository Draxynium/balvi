import "server-only";

import type { NextRequest } from "next/server";

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin.toLowerCase();
  } catch {
    return null;
  }
}

function configuredOrigins() {
  return (process.env.APP_ORIGIN ?? "https://195.254.165.41:8843")
    .split(",")
    .map((value) => normalizeOrigin(value.trim()))
    .filter((value): value is string => value !== null);
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;

  if (configuredOrigins().includes(normalizedOrigin)) return true;

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const host = forwardedHost || request.headers.get("host");
  if (!host) return false;

  try {
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const requestProtocol =
      forwardedProtocol || request.nextUrl.protocol.replace(/:$/, "");

    return (
      normalizedOrigin ===
      normalizeOrigin(`${requestProtocol}://${host.toLowerCase()}`)
    );
  } catch {
    return false;
  }
}
