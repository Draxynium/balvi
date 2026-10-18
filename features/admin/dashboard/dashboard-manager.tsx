"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Boxes,
  CalendarDays,
  FileText,
  LoaderCircle,
  PackageOpen,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { dashboardAdminApi } from "./api";
import type {
  AdminDashboard,
  DashboardDailyPoint,
  DashboardMonthlyPoint,
} from "./types";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { formatProductPrice } from "@/features/catalog/lib/format";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  string,
  { label: string; color: string; badge: string }
> = {
  PendingPayment: {
    label: "در انتظار پرداخت",
    color: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  Paid: {
    label: "پرداخت‌شده",
    color: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700",
  },
  Processing: {
    label: "در حال پردازش",
    color: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
  },
  Shipped: {
    label: "ارسال‌شده",
    color: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700",
  },
  Delivered: {
    label: "تحویل‌شده",
    color: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
  Cancelled: {
    label: "لغوشده",
    color: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700",
  },
  PaymentFailed: {
    label: "پرداخت ناموفق",
    color: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700",
  },
};

function formatNumber(value: number) {
  return value.toLocaleString("fa-IR");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("fa-IR", { month: "short" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

function StatCard({
  title,
  value,
  detail,
  href,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  href: string;
  icon: typeof ShoppingBag;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.75rem] border border-[#173f37]/8 bg-white p-5 shadow-sm shadow-[#173f37]/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173f37]/8"
    >
      <div
        className={cn(
          "absolute -top-10 -left-10 size-32 rounded-full opacity-45 blur-2xl",
          tone,
        )}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#173f37]/55">{title}</p>
          <p className="mt-4 text-3xl font-black tracking-tight text-[#173f37]">
            {value}
          </p>
          <p className="mt-2 text-xs text-[#173f37]/45">{detail}</p>
        </div>
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl",
            tone,
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <ArrowLeft className="absolute bottom-5 left-5 size-4 text-[#173f37]/25 transition group-hover:-translate-x-1 group-hover:text-[#173f37]" />
    </Link>
  );
}

function DailyOrdersChart({ points }: { points: DashboardDailyPoint[] }) {
  const width = 760;
  const height = 260;
  const left = 44;
  const right = 18;
  const top = 24;
  const bottom = 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maximum = Math.max(...points.map((point) => point.orderCount), 1);
  const coordinates = points.map((point, index) => ({
    x: left + (index * plotWidth) / Math.max(points.length - 1, 1),
    y: top + plotHeight - (point.orderCount / maximum) * plotHeight,
    point,
  }));
  const line = coordinates
    .map(({ x, y }, index) => `${index ? "L" : "M"} ${x} ${y}`)
    .join(" ");
  const area = coordinates.length
    ? `${line} L ${coordinates.at(-1)!.x} ${top + plotHeight} L ${coordinates[0].x} ${top + plotHeight} Z`
    : "";

  return (
    <div className="overflow-x-auto pb-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[680px]"
        role="img"
        aria-label="نمودار سفارش‌های روزانه چهارده روز اخیر"
      >
        <defs>
          <linearGradient id="orders-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7a66c" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#d7a66c" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = top + plotHeight - ratio * plotHeight;
          return (
            <g key={ratio}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#173f37"
                strokeOpacity="0.08"
              />
              <text
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-[#173f37]/40 text-[10px]"
              >
                {formatNumber(Math.round(maximum * ratio))}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#orders-area)" />
        <path
          d={line}
          fill="none"
          stroke="#173f37"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coordinates.map(({ x, y, point }, index) => (
          <g key={point.date}>
            <circle
              cx={x}
              cy={y}
              r="4.5"
              fill="#f3f0e9"
              stroke="#173f37"
              strokeWidth="2.5"
            >
              <title>{`${formatDate(point.date)}: ${formatNumber(point.orderCount)} سفارش`}</title>
            </circle>
            {(index % 3 === 0 || index === coordinates.length - 1) && (
              <text
                x={x}
                y={height - 16}
                textAnchor="middle"
                className="fill-[#173f37]/45 text-[10px]"
              >
                {formatDate(point.date)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function MonthlyOrdersChart({ points }: { points: DashboardMonthlyPoint[] }) {
  const maximum = Math.max(...points.map((point) => point.orderCount), 1);

  return (
    <div className="overflow-x-auto">
      <div className="flex h-64 min-w-[680px] items-end gap-3 border-b border-[#173f37]/10 px-2 pt-6">
        {points.map((point) => {
          const height = Math.max(4, (point.orderCount / maximum) * 100);
          return (
            <div
              key={`${point.year}-${point.month}`}
              className="flex h-full min-w-10 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-[10px] font-bold text-[#173f37]/55">
                {formatNumber(point.orderCount)}
              </span>
              <div className="flex h-[78%] w-full items-end justify-center">
                <div
                  title={`${monthLabel(point.year, point.month)}: ${formatNumber(point.orderCount)} سفارش`}
                  className="w-full max-w-9 rounded-t-xl bg-gradient-to-t from-[#173f37] to-[#d7a66c] transition hover:opacity-75"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="pb-3 text-[10px] text-[#173f37]/45">
                {monthLabel(point.year, point.month)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 rounded-[2rem] bg-white/70" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 rounded-[1.75rem] bg-white/70" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-[2rem] bg-white/70" />
        <div className="h-96 rounded-[2rem] bg-white/70" />
      </div>
    </div>
  );
}

export function DashboardManager() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const loadDashboard = useCallback(async (background = false) => {
    if (background) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      setData(await dashboardAdminApi.get());
      setUpdatedAt(new Date());
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "داشبورد"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    dashboardAdminApi
      .get()
      .then((result) => {
        if (!active) return;
        setData(result);
        setUpdatedAt(new Date());
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "داشبورد"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const thisMonthOrders = data?.monthlyOrders.at(-1)?.orderCount ?? 0;
  const totalStatusCount = useMemo(
    () => data?.orderStatuses.reduce((sum, item) => sum + item.count, 0) ?? 0,
    [data],
  );

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <section className="grid min-h-[55vh] place-items-center rounded-[2rem] border border-red-900/10 bg-white p-8 text-center">
        <div>
          <PackageOpen className="mx-auto size-12 text-red-500" />
          <h1 className="mt-5 text-xl font-bold">داشبورد بارگذاری نشد</h1>
          <p className="mt-2 text-sm text-[#173f37]/55">{error}</p>
          <button
            onClick={() => void loadDashboard()}
            className="mt-6 rounded-xl bg-[#173f37] px-5 py-3 text-sm font-semibold text-white"
          >
            تلاش دوباره
          </button>
        </div>
      </section>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#173f37] p-6 text-white shadow-xl shadow-[#173f37]/10 sm:p-8">
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-[#d7a66c]/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/45">
              <TrendingUp className="size-4 text-[#d7a66c]" />
              گزارش زنده فروشگاه
            </div>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">
              داشبورد مدیریت
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/55">
              نمای یکپارچه فروش، سفارش‌ها، کاربران و محتوای فروشگاه بالوی
            </p>
          </div>
          <div className="flex items-center gap-3">
            {updatedAt && (
              <span className="text-xs text-white/40">
                بروزرسانی{" "}
                {updatedAt.toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            <button
              type="button"
              onClick={() => void loadDashboard(true)}
              disabled={refreshing}
              className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/15 disabled:opacity-50"
              aria-label="بروزرسانی داشبورد"
            >
              {refreshing ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <RefreshCw className="size-5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="کل سفارش‌ها"
          value={formatNumber(data.totalOrders)}
          detail={`${formatNumber(data.ordersToday)} سفارش امروز`}
          href="/admin/orders"
          icon={ShoppingBag}
          tone="bg-amber-100 text-amber-700"
        />
        <StatCard
          title="فروش کل"
          value={formatProductPrice(data.totalRevenueInRials)}
          detail={`${formatProductPrice(data.revenueThisMonthInRials)} در ماه جاری`}
          href="/admin/payments"
          icon={Banknote}
          tone="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          title="کاربران"
          value={formatNumber(data.totalUsers)}
          detail={`${formatNumber(data.activeUsers)} حساب فعال`}
          href="/admin/users"
          icon={Users}
          tone="bg-sky-100 text-sky-700"
        />
        <StatCard
          title="محصولات فعال"
          value={formatNumber(data.totalProducts)}
          detail={`${formatNumber(data.outOfStockProducts)} محصول بدون موجودی`}
          href="/admin/products"
          icon={Boxes}
          tone="bg-violet-100 text-violet-700"
        />
        <StatCard
          title="مقالات"
          value={formatNumber(data.totalArticles)}
          detail={`${formatNumber(data.publishedArticles)} مقاله منتشرشده`}
          href="/admin/articles"
          icon={FileText}
          tone="bg-rose-100 text-rose-700"
        />
        <StatCard
          title="سفارش‌های ماه جاری"
          value={formatNumber(thisMonthOrders)}
          detail="بر اساس زمان ثبت سفارش"
          href="/admin/orders"
          icon={CalendarDays}
          tone="bg-orange-100 text-orange-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#173f37]/8 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">سفارش‌های روزانه</h2>
              <p className="mt-1 text-xs text-[#173f37]/45">روند ۱۴ روز اخیر</p>
            </div>
            <span className="rounded-full bg-[#d7a66c]/15 px-3 py-1.5 text-xs font-bold text-[#8b5d27]">
              روزانه
            </span>
          </div>
          <DailyOrdersChart points={data.dailyOrders} />
        </div>

        <div className="rounded-[2rem] border border-[#173f37]/8 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">سفارش‌های ماهانه</h2>
              <p className="mt-1 text-xs text-[#173f37]/45">
                مقایسه ۱۲ ماه اخیر
              </p>
            </div>
            <span className="rounded-full bg-[#173f37]/8 px-3 py-1.5 text-xs font-bold text-[#173f37]">
              ماهانه
            </span>
          </div>
          <MonthlyOrdersChart points={data.monthlyOrders} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-[#173f37]/8 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">وضعیت سفارش‌ها</h2>
              <p className="mt-1 text-xs text-[#173f37]/45">
                توزیع کل سفارش‌های ثبت‌شده
              </p>
            </div>
            <ShoppingBag className="size-5 text-[#d7a66c]" />
          </div>
          <div className="mt-7 space-y-5">
            {data.orderStatuses.length ? (
              data.orderStatuses.map((item) => {
                const meta = statusMeta[item.status] ?? {
                  label: item.status,
                  color: "bg-slate-400",
                  badge: "bg-slate-100 text-slate-700",
                };
                const percent = totalStatusCount
                  ? (item.count / totalStatusCount) * 100
                  : 0;
                return (
                  <div key={item.status}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium">{meta.label}</span>
                      <span className="text-[#173f37]/45">
                        {formatNumber(item.count)} ·{" "}
                        {formatNumber(Math.round(percent))}٪
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#173f37]/7">
                      <div
                        className={cn("h-full rounded-full", meta.color)}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-16 text-center text-sm text-[#173f37]/40">
                هنوز سفارشی ثبت نشده است.
              </p>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#173f37]/8 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#173f37]/8 p-6">
            <div>
              <h2 className="text-lg font-bold">آخرین سفارش‌ها</h2>
              <p className="mt-1 text-xs text-[#173f37]/45">
                پنج سفارش تازه فروشگاه
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-bold text-[#173f37]/60 hover:text-[#173f37]"
            >
              مشاهده همه <ArrowLeft className="size-3.5" />
            </Link>
          </div>
          {data.recentOrders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-right text-sm">
                <thead className="bg-[#173f37]/[0.025] text-xs text-[#173f37]/45">
                  <tr>
                    <th className="px-6 py-4 font-medium">شماره سفارش</th>
                    <th className="px-4 py-4 font-medium">مشتری</th>
                    <th className="px-4 py-4 font-medium">مبلغ</th>
                    <th className="px-4 py-4 font-medium">وضعیت</th>
                    <th className="px-6 py-4 font-medium">زمان ثبت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173f37]/7">
                  {data.recentOrders.map((order) => {
                    const meta = statusMeta[order.status] ?? {
                      label: order.status,
                      color: "",
                      badge: "bg-slate-100 text-slate-700",
                    };
                    return (
                      <tr
                        key={order.id}
                        className="transition hover:bg-[#173f37]/[0.025]"
                      >
                        <td
                          className="px-6 py-4 font-mono text-xs font-bold"
                          dir="ltr"
                        >
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatProductPrice(order.totalAmountInRials)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px] font-bold",
                              meta.badge,
                            )}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs whitespace-nowrap text-[#173f37]/45">
                          {formatDateTime(order.createdAtUtc)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-20 text-center text-sm text-[#173f37]/40">
              هنوز سفارشی ثبت نشده است.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
