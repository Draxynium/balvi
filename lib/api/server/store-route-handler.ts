import "server-only";

import { NextRequest, NextResponse } from "next/server";
import type { ProblemDetails } from "@/features/auth/model/types";
import { ACCESS_TOKEN_COOKIE } from "@/features/auth/server/session-cookies";
import { backendFetch } from "@/lib/api/server/backend";
import { isSameOrigin } from "@/lib/api/server/same-origin";

const UUID =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const MAX_REQUEST_BYTES = 32 * 1024;

const PUBLIC_GET_ROUTES = [
  /^products$/,
  new RegExp(`^products/${UUID}$`),
  /^categories$/,
  /^articles$/,
  new RegExp(`^articles/${UUID}$`),
  /^locations\/provinces$/,
  new RegExp(`^locations/provinces/${UUID}/cities$`),
  /^delivery-schedule\/available$/,
];

const PROTECTED_ROUTES: Record<string, RegExp[]> = {
  GET: [/^cart$/, /^orders$/, new RegExp(`^orders/${UUID}$`)],
  POST: [
    /^cart\/items$/,
    /^orders$/,
    new RegExp(`^orders/${UUID}/payments/test$`),
  ],
  PUT: [new RegExp(`^cart/items/${UUID}$`)],
  DELETE: [new RegExp(`^cart/items/${UUID}$`)],
};

type RouteContext = { params: Promise<{ path: string[] }> };

function problem(status: number, title: string, detail: string) {
  return NextResponse.json<ProblemDetails>(
    { status, title, detail },
    { status },
  );
}

function matches(path: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(path));
}

async function readBody(request: NextRequest) {
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
      throw new Error("JSON object required");
    }
  } catch {
    throw new Response("ساختار اطلاعات ارسالی معتبر نیست.", { status: 400 });
  }
  return body;
}

async function handle(
  method: "GET" | "POST" | "PUT" | "DELETE",
  request: NextRequest,
  context: RouteContext,
) {
  const { path: segments } = await context.params;
  const path = segments.join("/");
  const isPublicGet = method === "GET" && matches(path, PUBLIC_GET_ROUTES);
  const isProtected = matches(path, PROTECTED_ROUTES[method] ?? []);

  if (!isPublicGet && !isProtected) {
    return problem(404, "مسیر پیدا نشد", "مسیر درخواستی فروشگاه وجود ندارد.");
  }
  if (method !== "GET" && !isSameOrigin(request)) {
    return problem(
      403,
      "دسترسی غیرمجاز",
      "ارسال درخواست از این مبدأ مجاز نیست.",
    );
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (isProtected && !accessToken) {
    return problem(
      401,
      "نیاز به ورود",
      "برای ادامه باید وارد حساب کاربری شوید.",
    );
  }

  try {
    const body =
      method === "POST" || method === "PUT"
        ? await readBody(request)
        : undefined;
    const headers = new Headers({ Accept: "application/json" });
    const userAgent = request.headers.get("user-agent");
    if (body) headers.set("Content-Type", "application/json");
    if (userAgent) headers.set("User-Agent", userAgent.slice(0, 512));
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const backendResponse = await backendFetch(
      `/api/${path}${request.nextUrl.search}`,
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
    return problem(
      502,
      "اختلال در ارتباط",
      "در حال حاضر ارتباط با سرویس فروشگاه برقرار نیست.",
    );
  }
}

export const handleStoreGet = (request: NextRequest, context: RouteContext) =>
  handle("GET", request, context);
export const handleStorePost = (request: NextRequest, context: RouteContext) =>
  handle("POST", request, context);
export const handleStorePut = (request: NextRequest, context: RouteContext) =>
  handle("PUT", request, context);
export const handleStoreDelete = (
  request: NextRequest,
  context: RouteContext,
) => handle("DELETE", request, context);
