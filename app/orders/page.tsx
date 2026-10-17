"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  PackageSearch,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cartApi } from "@/features/cart/api/cart-api";
import { formatRialsAsTomans } from "@/features/cart/lib/format";
import type { MyOrdersPage } from "@/features/cart/model/types";
import { getOrderStatusLabel } from "@/features/orders/lib/status";
import { ApiError, getApiErrorMessage } from "@/lib/api/client";

const emptyPage: MyOrdersPage = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<MyOrdersPage>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      router.replace(`/login?next=${encodeURIComponent("/orders")}`);
      return;
    }

    let active = true;
    cartApi
      .getOrders(page)
      .then((orders) => {
        if (active) setResult(orders);
      })
      .catch((reason) => {
        if (!active) return;
        if (reason instanceof ApiError && reason.status === 401) {
          router.replace(`/login?next=${encodeURIComponent("/orders")}`);
          return;
        }
        setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, router, status]);

  return (
    <main
      dir="rtl"
      className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-28 pb-20"
    >
      <header className="mb-10">
        <p className="text-primary text-sm font-medium">حساب کاربری</p>
        <h1 className="mt-2 text-3xl font-medium md:text-4xl">سفارش‌های من</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          وضعیت پرداخت، آماده‌سازی و ارسال سفارش‌ها را اینجا می‌بینید.
        </p>
      </header>

      {error && (
        <p className="bg-destructive/10 text-destructive mb-6 rounded-2xl p-4 text-sm">
          {error}
        </p>
      )}

      {loading ? (
        <div className="text-muted-foreground grid min-h-80 place-items-center">
          <LoaderCircle className="animate-spin" size={30} />
        </div>
      ) : result.items.length === 0 ? (
        <section className="border-foreground/10 grid min-h-80 place-items-center rounded-3xl border text-center">
          <div>
            <PackageSearch className="text-primary mx-auto" size={42} />
            <h2 className="mt-5 text-xl font-medium">هنوز سفارشی ندارید</h2>
            <Link href="/products" className="mt-4 inline-block text-sm underline">
              مشاهده محصولات
            </Link>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {result.items.map((order) => {
            const payable =
              order.status === "PendingPayment" ||
              order.status === "PaymentFailed";
            return (
              <article
                key={order.id}
                className="border-foreground/10 rounded-3xl border p-5 sm:p-7"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-mono text-sm" dir="ltr">
                        {order.orderNumber}
                      </h2>
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-3 text-xs">
                      {formatDate(order.createdAtUtc)} · {order.totalQuantity.toLocaleString("fa-IR")} کالا
                    </p>
                  </div>
                  <div className="sm:text-left">
                    <p className="font-medium">
                      {formatRialsAsTomans(order.totalAmountInRials)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {payable && (
                        <Link
                          href={`/orders/${order.id}/payment`}
                          className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-xs"
                        >
                          {order.status === "PaymentFailed"
                            ? "تلاش دوباره برای پرداخت"
                            : "ادامه پرداخت"}
                        </Link>
                      )}
                      <Link
                        href={`/orders/${order.id}`}
                        className="border-foreground/15 rounded-xl border px-4 py-2 text-xs"
                      >
                        مشاهده جزئیات
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {result.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            disabled={!result.hasPreviousPage || loading}
            onClick={() => {
              setLoading(true);
              setError("");
              setPage((value) => value - 1);
            }}
            className="border-foreground/10 flex items-center gap-1 rounded-xl border px-4 py-2 text-sm disabled:opacity-35"
          >
            <ChevronRight size={16} /> قبلی
          </button>
          <span className="text-muted-foreground text-xs">
            صفحه {result.page.toLocaleString("fa-IR")} از{" "}
            {result.totalPages.toLocaleString("fa-IR")}
          </span>
          <button
            type="button"
            disabled={!result.hasNextPage || loading}
            onClick={() => {
              setLoading(true);
              setError("");
              setPage((value) => value + 1);
            }}
            className="border-foreground/10 flex items-center gap-1 rounded-xl border px-4 py-2 text-sm disabled:opacity-35"
          >
            بعدی <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
