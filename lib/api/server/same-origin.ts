import "server-only";

import type { NextRequest } from "next/server";

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    const originUrl = new URL(origin);
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const requestProtocol =
      forwardedProtocol || request.nextUrl.protocol.replace(/:$/, "");

    return (
      originUrl.host.toLowerCase() === host.toLowerCase() &&
      originUrl.protocol === `${requestProtocol}:`
    );
  } catch {
    return false;
  }
}
