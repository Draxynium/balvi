import "server-only";

import { NextRequest, NextResponse } from "next/server";
import type { AuthUser, ProblemDetails } from "@/features/auth/model/types";
import { ACCESS_TOKEN_COOKIE } from "@/features/auth/server/session-cookies";
import { backendFetch } from "@/lib/api/server/backend";
import { isSameOrigin } from "@/lib/api/server/same-origin";

const UUID =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const ISO_DATE = "\\d{4}-\\d{2}-\\d{2}";
const MAX_JSON_BYTES = 128 * 1024;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const ALLOWED_PATHS: Record<string, RegExp[]> = {
  GET: [
    /^categories$/,
    new RegExp(`^categories/${UUID}$`),
    /^brands$/,
    new RegExp(`^brands/${UUID}$`),
    /^colors$/,
    new RegExp(`^colors/${UUID}$`),
    /^sizes$/,
    new RegExp(`^sizes/${UUID}$`),
    /^materials$/,
    new RegExp(`^materials/${UUID}$`),
    /^linings$/,
    new RegExp(`^linings/${UUID}$`),
    /^products$/,
    new RegExp(`^products/${UUID}$`),
    /^orders$/,
    new RegExp(`^orders/${UUID}$`),
    /^articles$/,
    new RegExp(`^articles/${UUID}$`),
    /^users$/,
    /^payments$/,
    /^settings\/checkout$/,
    /^delivery-schedule\/settings$/,
    /^delivery-schedule\/days$/,
  ],
  POST: [
    /^categories$/,
    /^brands$/,
    /^colors$/,
    /^sizes$/,
    /^materials$/,
    /^linings$/,
    /^products$/,
    /^articles$/,
    /^files\/images$/,
  ],
  PUT: [
    new RegExp(`^categories/${UUID}$`),
    new RegExp(`^brands/${UUID}$`),
    new RegExp(`^colors/${UUID}$`),
    new RegExp(`^sizes/${UUID}$`),
    new RegExp(`^materials/${UUID}$`),
    new RegExp(`^linings/${UUID}$`),
    new RegExp(`^products/${UUID}$`),
    new RegExp(`^articles/${UUID}$`),
    new RegExp(`^users/${UUID}/status$`),
    new RegExp(`^users/${UUID}/password$`),
    new RegExp(`^orders/${UUID}/status$`),
    /^settings\/checkout$/,
    /^delivery-schedule\/settings$/,
    new RegExp(`^delivery-schedule/days/${ISO_DATE}$`),
  ],
  DELETE: [
    new RegExp(`^categories/${UUID}$`),
    new RegExp(`^brands/${UUID}$`),
    new RegExp(`^colors/${UUID}$`),
    new RegExp(`^sizes/${UUID}$`),
    new RegExp(`^materials/${UUID}$`),
    new RegExp(`^linings/${UUID}$`),
    new RegExp(`^products/${UUID}$`),
    new RegExp(`^articles/${UUID}$`),
    new RegExp(`^delivery-schedule/days/${ISO_DATE}$`),
  ],
};

type RouteContext = { params: Promise<{ path: string[] }> };

function problem(status: number, title: string, detail: string) {
  return NextResponse.json<ProblemDetails>(
    { status, title, detail },
    { status },
  );
}

function isAllowed(method: string, path: string) {
  return (ALLOWED_PATHS[method] ?? []).some((pattern) => pattern.test(path));
}

async function readJsonBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Response("نوع محتوای درخواست پشتیبانی نمی‌شود.", { status: 415 });
  }
  if (contentLength > MAX_JSON_BYTES) {
    throw new Response("حجم درخواست بیشتر از حد مجاز است.", { status: 413 });
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_JSON_BYTES) {
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

async function readImageFormData(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    throw new Response("نوع فایل ارسالی پشتیبانی نمی‌شود.", { status: 415 });
  }
  if (contentLength > MAX_UPLOAD_BYTES) {
    throw new Response("حجم فایل‌های ارسالی بیشتر از حد مجاز است.", {
      status: 413,
    });
  }

  const formData = await request.formData();
  const images = formData.getAll("Images");
  if (
    images.length < 1 ||
    images.length > 20 ||
    images.some(
      (entry) =>
        typeof entry === "string" ||
        entry.size < 1 ||
        entry.size > 5 * 1024 * 1024,
    )
  ) {
    throw new Response("تصاویر انتخاب‌شده معتبر نیستند.", { status: 400 });
  }

  return formData;
}

function upstreamPath(path: string) {
  return path === "products" || path.startsWith("products/")
    ? `/api/${path}`
    : `/api/admin/${path}`;
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
    return problem(
      404,
      "مسیر پیدا نشد",
      "مسیر درخواستی پنل مدیریت وجود ندارد.",
    );
  }
  if (method !== "GET" && !isSameOrigin(request)) {
    return problem(
      403,
      "دسترسی غیرمجاز",
      "ارسال درخواست از این مبدأ مجاز نیست.",
    );
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return problem(
      401,
      "نیاز به ورود",
      "برای ادامه باید وارد حساب مدیریت شوید.",
    );
  }

  try {
    const authorization = await verifyAdmin(accessToken);
    if (!authorization.response.ok) {
      return problem(
        authorization.response.status === 401 ? 401 : 403,
        authorization.response.status === 401
          ? "نیاز به ورود"
          : "دسترسی غیرمجاز",
        "برای انجام این عملیات باید با حساب مدیر وارد شوید.",
      );
    }
    if (authorization.user?.role?.toLowerCase() !== "admin") {
      return problem(
        403,
        "دسترسی غیرمجاز",
        "برای انجام این عملیات باید با حساب مدیر وارد شوید.",
      );
    }

    const body =
      path === "files/images"
        ? await readImageFormData(request)
        : method === "POST" || method === "PUT"
          ? await readJsonBody(request)
          : undefined;
    const headers = new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    });
    if (typeof body === "string")
      headers.set("Content-Type", "application/json");

    const backendResponse = await backendFetch(
      `${upstreamPath(path)}${request.nextUrl.search}`,
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
      "در حال حاضر ارتباط با سرویس مدیریت برقرار نیست.",
    );
  }
}

export const handleAdminGet = (request: NextRequest, context: RouteContext) =>
  handle("GET", request, context);
export const handleAdminPost = (request: NextRequest, context: RouteContext) =>
  handle("POST", request, context);
export const handleAdminPut = (request: NextRequest, context: RouteContext) =>
  handle("PUT", request, context);
export const handleAdminDelete = (
  request: NextRequest,
  context: RouteContext,
) => handle("DELETE", request, context);
