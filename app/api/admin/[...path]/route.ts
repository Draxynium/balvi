import type { NextRequest } from "next/server";
import {
  handleAdminDelete,
  handleAdminGet,
  handleAdminPost,
  handleAdminPut,
} from "@/features/admin/server/admin-route-handler";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };

export function GET(request: NextRequest, context: Context) {
  return handleAdminGet(request, context);
}

export function POST(request: NextRequest, context: Context) {
  return handleAdminPost(request, context);
}

export function PUT(request: NextRequest, context: Context) {
  return handleAdminPut(request, context);
}

export function DELETE(request: NextRequest, context: Context) {
  return handleAdminDelete(request, context);
}
