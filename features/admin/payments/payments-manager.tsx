"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LoaderCircle,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { formatProductPrice } from "@/features/catalog/lib/format";
import { cn } from "@/lib/utils";
import { paymentAdminApi } from "./api";
import type { PagedPayments, PaymentStatus } from "./types";

const emptyPage: PagedPayments = {
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

export function PaymentsManager() {
  const [result, setResult] = useState(emptyPage);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [fromUtc, setFromUtc] = useState("");
  const [toUtc, setToUtc] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const loadPayments = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setResult(
          await paymentAdminApi.list({
            search,
            status,
            fromUtc,
            toUtc,
            page,
            pageSize: 20,
          }),
        );
      } catch (reason) {
        setError(getAdminApiErrorMessage(reason, "پرداخت"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fromUtc, page, search, status, toUtc],
  );

  useEffect(() => {
    let active = true;
    paymentAdminApi
      .list({ search, status, fromUtc, toUtc, page, pageSize: 20 })
      .then((payments) => {
        if (active) setResult(payments);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "پرداخت"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fromUtc, page, search, status, toUtc]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(query.trim());
  };

  return (
    <div className="mx-auto max-w-7xl" dir="rtl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#b17b42]">
          <CreditCard className="size-4" /> تراکنش‌های فروشگاه
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">لیست پرداخت‌ها</h1>
        <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
          تراکنش‌های موفق و ناموفق را همراه با سفارش و مشخصات مشتری بررسی کنید.
        </p>
      </div>

      {error ? (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-5 shrink-0" /> {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] border border-[#173f37]/10 bg-white shadow-xl shadow-[#173f37]/5">
        <div className="grid gap-3 border-b border-[#173f37]/8 p-4 md:grid-cols-2 md:p-6 xl:grid-cols-[minmax(260px,1fr)_170px_165px_165px_auto]">
          <form className="relative" onSubmit={submitSearch}>
            <Search className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#173f37]/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="شماره سفارش، پیگیری، نام یا تلفن…"
              className="admin-input pr-11"
            />
          </form>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as PaymentStatus | "");
              setPage(1);
            }}
            className="admin-input"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="Succeeded">موفق</option>
            <option value="Failed">ناموفق</option>
          </select>
          <input
            type="date"
            value={fromUtc}
            onChange={(event) => {
              setFromUtc(event.target.value);
              setPage(1);
            }}
            title="از تاریخ"
            className="admin-input"
          />
          <input
            type="date"
            value={toUtc}
            onChange={(event) => {
              setToUtc(event.target.value);
              setPage(1);
            }}
            title="تا تاریخ"
            className="admin-input"
          />
          <button
            type="button"
            onClick={() => void loadPayments(true)}
            disabled={refreshing}
            className="grid size-12 place-items-center rounded-xl border border-[#173f37]/10"
            aria-label="به‌روزرسانی"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          </button>
        </div>

        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <LoaderCircle className="size-8 animate-spin" />
          </div>
        ) : result.items.length ? (
          <div className="divide-y divide-[#173f37]/8">
            {result.items.map((payment) => (
              <article
                key={payment.id}
                className="grid gap-4 p-5 md:grid-cols-[minmax(170px,1.2fr)_minmax(160px,1fr)_minmax(150px,.9fr)_auto] md:items-center md:px-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {payment.status === "Succeeded" ? (
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    ) : (
                      <XCircle className="size-5 text-red-600" />
                    )}
                    <strong>
                      {payment.status === "Succeeded"
                        ? "تراکنش موفق"
                        : "تراکنش ناموفق"}
                    </strong>
                  </div>
                  <p className="mt-2 text-xs text-[#173f37]/50">
                    {formatDate(payment.createdAtUtc)}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold">سفارش {payment.orderNumber}</p>
                  <p className="mt-1 text-xs text-[#173f37]/50">
                    {payment.customerName} ·{" "}
                    <span dir="ltr">{payment.phoneNumber}</span>
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-bold">
                    {formatProductPrice(payment.amountInRials)}
                  </p>
                  <p className="mt-1 text-xs text-[#173f37]/50">
                    درگاه:{" "}
                    {payment.provider === "Test" ? "آزمایشی" : payment.provider}
                  </p>
                </div>
                <div className="min-w-40 text-xs">
                  <p className="text-[#173f37]/45">شماره پیگیری</p>
                  <p dir="ltr" className="mt-1 font-mono font-semibold">
                    {payment.referenceNumber || "—"}
                  </p>
                  {payment.failureReason ? (
                    <p className="mt-2 max-w-56 text-red-600">
                      {payment.failureReason}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center text-sm text-[#173f37]/50">
            پرداختی با این مشخصات پیدا نشد.
          </div>
        )}
      </section>

      {result.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((value) => value - 1)}
            disabled={!result.hasPreviousPage}
            className="grid size-10 place-items-center rounded-xl border disabled:opacity-35"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="text-sm">
            صفحه {result.page} از {result.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => value + 1)}
            disabled={!result.hasNextPage}
            className="grid size-10 place-items-center rounded-xl border disabled:opacity-35"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
