import type { NextRequest } from "next/server";
import {
  handleAuthGet,
  handleAuthPost,
} from "@/features/auth/server/auth-route-handler";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };

export function GET(request: NextRequest, context: Context) {
  return handleAuthGet(request, context);
}

export function POST(request: NextRequest, context: Context) {
  return handleAuthPost(request, context);
}
