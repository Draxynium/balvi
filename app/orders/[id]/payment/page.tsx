"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  CircleX,
  CreditCard,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cartApi } from "@/features/cart/api/cart-api";
import { formatRialsAsTomans } from "@/features/cart/lib/format";
import type { Order } from "@/features/cart/model/types";
import { getOrderStatusLabel } from "@/features/orders/lib/status";
import { ApiError, getApiErrorMessage } from "@/lib/api/client";

export default function TestPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState<"success" | "failed" | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      router.replace(
        `/login?next=${encodeURIComponent(`/orders/${id}/payment`)}`,
      );
      return;
    }

    let active = true;
    cartApi
      .getOrder(id)
      .then((result) => {
        if (active) setOrder(result);
      })
      .catch((reason) => {
        if (!active) return;
        if (reason instanceof ApiError && reason.status === 401) {
          router.replace(
            `/login?next=${encodeURIComponent(`/orders/${id}/payment`)}`,
          );
          return;
        }
        setError(getApiErrorMessage(reason));
      });

    return () => {
      active = false;
    };
  }, [id, router, status]);

  const processPayment = async (succeeded: boolean) => {
    setSubmitting(succeeded ? "success" : "failed");
    setError("");
    try {
      setOrder(await cartApi.processTestPayment(id, succeeded));
    } catch (reason) {
      setError(getApiErrorMessage(reason));
    } finally {
      setSubmitting(null);
    }
  };

  const payable =
    order?.status === "PendingPayment" || order?.status === "PaymentFailed";
  const latestPayment = order?.payments[0];
  const paymentSucceeded = latestPayment?.status === "Succeeded";

  return (
    <main
      dir="rtl"
      className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-28"
    >
      <section className="border-foreground/10 w-full rounded-3xl border p-7 shadow-sm sm:p-10">
        {!order && !error ? (
          <div className="text-muted-foreground grid min-h-64 place-items-center">
            <LoaderCircle className="animate-spin" size={30} />
          </div>
        ) : paymentSucceeded && order ? (
          <div className="flex min-h-96 flex-col items-center justify-center text-center">
            <div className="bg-emerald-100 text-emerald-700 grid size-16 place-items-center rounded-full">
              <CheckCircle2 size={34} />
            </div>
            <h1 className="mt-6 text-3xl font-medium">
              خرید شما با موفقیت انجام شد
            </h1>
            <p className="text-muted-foreground mt-3">
              شماره سفارش:{" "}
              <span className="text-foreground font-medium">
                {order.orderNumber}
              </span>
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              مبلغ پرداخت‌شده {formatRialsAsTomans(order.totalAmountInRials)}
            </p>
            {latestPayment.referenceNumber && (
              <p className="text-muted-foreground mt-3 text-xs">
                شماره پیگیری:{" "}
                <span className="text-foreground font-mono" dir="ltr">
                  {latestPayment.referenceNumber}
                </span>
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={`/orders/${order.id}`}
                className="bg-foreground text-background rounded-xl px-6 py-3 text-sm"
              >
                مشاهده جزئیات سفارش
              </Link>
              <Link
                href="/products"
                className="border-foreground/15 rounded-xl border px-6 py-3 text-sm"
              >
                بازگشت به فروشگاه
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-primary/10 text-primary grid size-14 place-items-center rounded-full">
              <CreditCard size={27} />
            </div>
            <h1 className="mt-6 text-3xl font-medium">درگاه پرداخت آزمایشی</h1>
            <p className="text-muted-foreground mt-3 text-sm leading-7">
              این صفحه موقتاً جایگزین زرین‌پال است. یکی از نتیجه‌های تراکنش را
              برای تست انتخاب کنید.
            </p>

            {error && (
              <p className="bg-destructive/10 text-destructive mt-6 rounded-2xl p-4 text-sm">
                {error}
              </p>
            )}

            {order && (
              <div className="bg-muted/50 mt-7 rounded-2xl p-5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">شماره سفارش</span>
                  <span className="font-mono" dir="ltr">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="mt-3 flex justify-between gap-4">
                  <span className="text-muted-foreground">مبلغ پرداخت</span>
                  <span className="font-medium">
                    {formatRialsAsTomans(order.totalAmountInRials)}
                  </span>
                </div>
                <div className="mt-3 flex justify-between gap-4">
                  <span className="text-muted-foreground">وضعیت سفارش</span>
                  <span>{getOrderStatusLabel(order.status)}</span>
                </div>
              </div>
            )}

            {order && payable && (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={submitting !== null}
                  onClick={() => void processPayment(true)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 font-medium text-white disabled:opacity-50"
                >
                  {submitting === "success" ? (
                    <LoaderCircle className="animate-spin" size={19} />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  تراکنش موفق
                </button>
                <button
                  type="button"
                  disabled={submitting !== null}
                  onClick={() => void processPayment(false)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-600 font-medium text-white disabled:opacity-50"
                >
                  {submitting === "failed" ? (
                    <LoaderCircle className="animate-spin" size={19} />
                  ) : (
                    <CircleX size={20} />
                  )}
                  تراکنش ناموفق
                </button>
              </div>
            )}

            {latestPayment && (
              <div
                className={`mt-7 rounded-2xl border p-5 text-sm ${
                  latestPayment.status === "Succeeded"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">
                  {latestPayment.status === "Succeeded"
                    ? "پرداخت با موفقیت ثبت شد."
                    : "تراکنش ناموفق ثبت شد؛ می‌توانید دوباره تلاش کنید."}
                </p>
                {latestPayment.referenceNumber && (
                  <p className="mt-2 font-mono text-xs" dir="ltr">
                    {latestPayment.referenceNumber}
                  </p>
                )}
              </div>
            )}

            {order && (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-foreground text-background rounded-xl px-5 py-3 text-sm"
                >
                  مشاهده جزئیات سفارش
                </Link>
                <Link
                  href="/orders"
                  className="border-foreground/15 rounded-xl border px-5 py-3 text-sm"
                >
                  سفارش‌های من
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
