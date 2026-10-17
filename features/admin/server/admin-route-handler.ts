import "server-only";

import { NextRequest, NextResponse } from "next/server";
import type { AuthUser, ProblemDetails } from "@/features/auth/model/types";
import { ACCESS_TOKEN_COOKIE } from "@/features/auth/server/session-cookies";
import { backendFetch } from "@/lib/api/server/backend";

const UUID =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const MAX_REQUEST_BYTES = 32 * 1024;

const ALLOWED_PATHS: Record<string, RegExp[]> = {
  GET: [
    /^categories$/,
    new RegExp(`^categories/${UUID}$`),
    /^brands$/,
    new RegExp(`^brands/${UUID}$`),
    /^colors$/,
    new RegExp(`^colors/${UUID}$`),
  ],
  POST: [/^categories$/, /^brands$/, /^colors$/],
  PUT: [
    new RegExp(`^categories/${UUID}$`),
    new RegExp(`^brands/${UUID}$`),
    new RegExp(`^colors/${UUID}$`),
  ],
  DELETE: [
    new RegExp(`^categories/${UUID}$`),
    new RegExp(`^brands/${UUID}$`),
    new RegExp(`^colors/${UUID}$`),
  ],
};

type RouteContext = { params: Promise<{ path: string[] }> };

function problem(status: number, title: string, detail: string) {
  return NextResponse.json<ProblemDetails>(
    { status, title, detail },
    { status },
  );
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

function isAllowed(method: string, path: string) {
  return (ALLOWED_PATHS[method] ?? []).some((pattern) => pattern.test(path));
}

async function readJsonBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Response("Unsupported Media Type", { status: 415 });
  }
  if (contentLength > MAX_REQUEST_BYTES) {
    throw new Response("Payload Too Large", { status: 413 });
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
    throw new Response("Payload Too Large", { status: 413 });
  }

  try {
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("JSON object required");
    }
  } catch {
    throw new Response("Invalid JSON", { status: 400 });
  }

  return body;
}

async function verifyAdmin(accessToken: string) {
  const response = await backendFetch("/api/auth/me", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return { response, user: null };
  const user = (await response.json()) as AuthUser;
  return { response, user };
}

async function handle(
  method: "GET" | "POST" | "PUT" | "DELETE",
  request: NextRequest,
  context: RouteContext,
) {
  const { path: segments } = await context.params;
  const path = segments.join("/");

  if (!isAllowed(method, path)) {
    return problem(404, "Not Found", "The requested admin endpoint was not found.");
  }
  if (method !== "GET" && !isSameOrigin(request)) {
    return problem(403, "Forbidden", "Cross-origin requests are not allowed.");
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return problem(401, "Unauthorized", "Authentication is required.");
  }

  try {
    const authorization = await verifyAdmin(accessToken);
    if (!authorization.response.ok) {
      return problem(
        authorization.response.status === 401 ? 401 : 403,
        authorization.response.status === 401 ? "Unauthorized" : "Forbidden",
        "An administrator account is required.",
      );
    }
    if (authorization.user?.role?.toLowerCase() !== "admin") {
      return problem(403, "Forbidden", "An administrator account is required.");
    }

    const body = method === "POST" || method === "PUT" ? await readJsonBody(request) : undefined;
    const headers = new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    });
    if (body) headers.set("Content-Type", "application/json");

    const backendResponse = await backendFetch(
      `/api/admin/${path}${request.nextUrl.search}`,
      { method, headers, body, cache: "no-store" },
    );
    const responseBody = await backendResponse.text();

    return new NextResponse(responseBody || null, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return problem(502, "Bad Gateway", "The admin service is unavailable.");
  }
}

export const handleAdminGet = (request: NextRequest, context: RouteContext) =>
  handle("GET", request, context);
export const handleAdminPost = (request: NextRequest, context: RouteContext) =>
  handle("POST", request, context);
export const handleAdminPut = (request: NextRequest, context: RouteContext) =>
  handle("PUT", request, context);
export const handleAdminDelete = (request: NextRequest, context: RouteContext) =>
  handle("DELETE", request, context);
