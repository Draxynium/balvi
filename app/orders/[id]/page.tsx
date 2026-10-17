"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, CreditCard, LoaderCircle, PackageCheck } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cartApi } from "@/features/cart/api/cart-api";
import {
  formatRialsAsTomans,
  resolveCartImage,
} from "@/features/cart/lib/format";
import type { Order } from "@/features/cart/model/types";
import { getOrderStatusLabel } from "@/features/orders/lib/status";
import { ApiError, getApiErrorMessage } from "@/lib/api/client";
import {
  formatDeliveryTime,
  formatPersianDeliveryDate,
} from "@/features/delivery/lib/persian-calendar";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
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
          router.replace(`/login?next=${encodeURIComponent(`/orders/${id}`)}`);
          return;
        }
        setError(getApiErrorMessage(reason));
      });

    return () => {
      active = false;
    };
  }, [id, router, status]);

  return (
    <main
      dir="rtl"
      className="mx-auto min-h-screen w-full max-w-5xl px-6 pt-28 pb-20"
    >
      {error ? (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-6 text-center">
          {error}
        </div>
      ) : !order ? (
        <div className="text-muted-foreground flex min-h-96 items-center justify-center">
          <LoaderCircle className="animate-spin" size={30} />
        </div>
      ) : (
        <div className="space-y-8">
          <section className="border-foreground/10 rounded-3xl border p-7 sm:p-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="bg-primary/10 text-primary mb-5 grid size-14 place-items-center rounded-full">
                  {order.status === "Paid" || order.status === "Delivered" ? (
                    <Check size={27} />
                  ) : (
                    <PackageCheck size={27} />
                  )}
                </div>
                <h1 className="text-3xl font-medium">
                  سفارش {order.orderNumber}
                </h1>
                <p className="text-muted-foreground mt-3 text-sm">
                  {getOrderStatusLabel(order.status)}
                </p>
              </div>
              <div className="sm:text-left">
                <p className="text-muted-foreground text-sm">مبلغ نهایی</p>
                <p className="mt-2 text-xl font-medium">
                  {formatRialsAsTomans(order.totalAmountInRials)}
                </p>
              </div>
            </div>
          </section>

          <section className="border-foreground/10 overflow-hidden rounded-3xl border">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="border-foreground/10 flex gap-5 border-b p-5 last:border-b-0"
              >
                <Link
                  href={`/products/${item.productId}`}
                  className="bg-muted size-24 shrink-0 overflow-hidden rounded-xl"
                >
                  <span
                    role="img"
                    aria-label={item.productName}
                    className="block size-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${resolveCartImage(item.mainImageUrl)})`,
                    }}
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {item.colorName}، سایز {item.sizeName}، تعداد{" "}
                      {item.quantity.toLocaleString("fa-IR")}
                    </p>
                  </div>
                  <p className="font-medium whitespace-nowrap">
                    {formatRialsAsTomans(item.lineTotalInRials)}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <section className="border-foreground/10 space-y-4 rounded-3xl border p-7 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">جمع محصولات</span>
              <span>{formatRialsAsTomans(order.productsTotalInRials)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                مالیات ({order.taxPercentage.toLocaleString("fa-IR")}٪)
              </span>
              <span>{formatRialsAsTomans(order.taxAmountInRials)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">هزینه ارسال</span>
              <span>{formatRialsAsTomans(order.shippingCostInRials)}</span>
            </div>
            <div className="border-foreground/10 flex justify-between gap-4 border-t pt-4 text-base font-medium">
              <span>مبلغ نهایی</span>
              <span>{formatRialsAsTomans(order.totalAmountInRials)}</span>
            </div>
          </section>

          {order.payments.length > 0 && (
            <section className="border-foreground/10 rounded-3xl border p-7">
              <h2 className="flex items-center gap-2 text-lg font-medium">
                <CreditCard size={20} /> سابقه پرداخت
              </h2>
              <div className="mt-5 space-y-3">
                {order.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-muted/50 flex flex-col justify-between gap-3 rounded-2xl p-4 text-sm sm:flex-row sm:items-center"
                  >
                    <div>
                      <p
                        className={
                          payment.status === "Succeeded"
                            ? "text-emerald-700"
                            : "text-red-700"
                        }
                      >
                        {payment.status === "Succeeded"
                          ? "تراکنش موفق"
                          : "تراکنش ناموفق"}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {new Intl.DateTimeFormat("fa-IR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(payment.createdAtUtc))}
                      </p>
                    </div>
                    <div className="sm:text-left">
                      <p>{formatRialsAsTomans(payment.amountInRials)}</p>
                      {payment.referenceNumber && (
                        <p
                          className="text-muted-foreground mt-1 font-mono text-[11px]"
                          dir="ltr"
                        >
                          {payment.referenceNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="border-foreground/10 grid gap-6 rounded-3xl border p-7 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">تحویل‌گیرنده</p>
              <p className="mt-2 font-medium">{order.fullName}</p>
              <p className="mt-1" dir="ltr">
                {order.phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">نشانی ارسال</p>
              <p className="mt-2 leading-7">
                {order.provinceName}، {order.cityName}، {order.address}
              </p>
              <p className="mt-1">کد پستی: {order.postalCode}</p>
            </div>
            {order.deliveryDate &&
              order.deliveryWindowStart &&
              order.deliveryWindowEnd && (
                <div className="border-foreground/10 border-t pt-5 sm:col-span-2">
                  <p className="text-muted-foreground">زمان تحویل انتخاب‌شده</p>
                  <p className="mt-2 font-medium">
                    {formatPersianDeliveryDate(order.deliveryDate)}، ساعت{" "}
                    {formatDeliveryTime(order.deliveryWindowStart)} تا{" "}
                    {formatDeliveryTime(order.deliveryWindowEnd)}
                  </p>
                </div>
              )}
          </section>

          <div className="flex flex-wrap gap-3">
            {(order.status === "PendingPayment" ||
              order.status === "PaymentFailed") && (
              <Link
                href={`/orders/${order.id}/payment`}
                className="bg-primary text-primary-foreground inline-flex h-12 items-center rounded-xl px-7"
              >
                {order.status === "PaymentFailed"
                  ? "تلاش دوباره برای پرداخت"
                  : "ادامه پرداخت"}
              </Link>
            )}
            <Link
              href="/orders"
              className="bg-foreground text-background inline-flex h-12 items-center rounded-xl px-7"
            >
              سفارش‌های من
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
