import type { NextRequest } from "next/server";
import {
  handleStoreDelete,
  handleStoreGet,
  handleStorePost,
  handleStorePut,
} from "@/lib/api/server/store-route-handler";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };

export const GET = (request: NextRequest, context: Context) =>
  handleStoreGet(request, context);
export const POST = (request: NextRequest, context: Context) =>
  handleStorePost(request, context);
export const PUT = (request: NextRequest, context: Context) =>
  handleStorePut(request, context);
export const DELETE = (request: NextRequest, context: Context) =>
  handleStoreDelete(request, context);
