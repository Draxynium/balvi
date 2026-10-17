"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Save,
  Search,
  X,
} from "lucide-react";
import {
  locationApi,
  orderAdminApi,
  type LocationOption,
} from "@/features/admin/orders/api";
import type {
  AdminOrder,
  OrderStatus,
  PagedOrders,
} from "@/features/admin/orders/types";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { formatProductPrice } from "@/features/catalog/lib/format";
import { cn } from "@/lib/utils";
import {
  formatDeliveryTime,
  formatPersianDeliveryDate,
} from "@/features/delivery/lib/persian-calendar";

const emptyPage: PagedOrders = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

type AdvancedFilters = {
  userId: string;
  provinceId: string;
  cityId: string;
  fromUtc: string;
  toUtc: string;
  minTotalInRials: string;
  maxTotalInRials: string;
};

const emptyAdvancedFilters: AdvancedFilters = {
  userId: "",
  provinceId: "",
  cityId: "",
  fromUtc: "",
  toUtc: "",
  minTotalInRials: "",
  maxTotalInRials: "",
};

const statuses: Array<{ value: OrderStatus | ""; label: string }> = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "PendingPayment", label: "در انتظار پرداخت" },
  { value: "Paid", label: "پرداخت‌شده" },
  { value: "Processing", label: "در حال پردازش" },
  { value: "Shipped", label: "ارسال‌شده" },
  { value: "Delivered", label: "تحویل‌شده" },
  { value: "Cancelled", label: "لغوشده" },
  { value: "PaymentFailed", label: "پرداخت ناموفق" },
];

function statusLabel(status: string) {
  return statuses.find((item) => item.value === status)?.label ?? status;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function OrdersManager() {
  const [result, setResult] = useState(emptyPage);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [advanced, setAdvanced] = useState(emptyAdvancedFilters);
  const [advancedDraft, setAdvancedDraft] = useState(emptyAdvancedFilters);
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [sort, setSort] = useState<
    "Newest" | "Oldest" | "HighestAmount" | "LowestAmount"
  >("Newest");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<AdminOrder | null>(null);
  const [statusDraft, setStatusDraft] = useState<OrderStatus>("PendingPayment");
  const [detailOpen, setDetailOpen] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setResult(
          await orderAdminApi.list({
            search,
            status,
            sort,
            ...advanced,
            minTotalInRials: advanced.minTotalInRials
              ? Number(advanced.minTotalInRials)
              : undefined,
            maxTotalInRials: advanced.maxTotalInRials
              ? Number(advanced.maxTotalInRials)
              : undefined,
            page,
            pageSize: 20,
          }),
        );
      } catch (reason) {
        setError(getAdminApiErrorMessage(reason, "سفارش"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [advanced, page, search, sort, status],
  );

  useEffect(() => {
    let active = true;
    orderAdminApi
      .list({
        search,
        status,
        sort,
        ...advanced,
        minTotalInRials: advanced.minTotalInRials
          ? Number(advanced.minTotalInRials)
          : undefined,
        maxTotalInRials: advanced.maxTotalInRials
          ? Number(advanced.maxTotalInRials)
          : undefined,
        page,
        pageSize: 20,
      })
      .then((orders) => {
        if (active) setResult(orders);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "سفارش"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [advanced, page, search, sort, status]);

  useEffect(() => {
    let active = true;
    locationApi
      .provinces()
      .then((items) => {
        if (active) setProvinces(items);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "استان"));
      });
    return () => {
      active = false;
    };
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(query);
  };

  const changeProvince = async (provinceId: string) => {
    setAdvancedDraft((current) => ({
      ...current,
      provinceId,
      cityId: "",
    }));
    setCities([]);
    if (!provinceId) return;
    try {
      setCities(await locationApi.cities(provinceId));
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "شهر"));
    }
  };

  const openDetail = async (id: string) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    setError("");
    try {
      const order = await orderAdminApi.get(id);
      setDetail(order);
      setStatusDraft(order.status);
    } catch (reason) {
      setDetailOpen(false);
      setError(getAdminApiErrorMessage(reason, "سفارش"));
    } finally {
      setDetailLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!detail || statusDraft === detail.status) return;
    setUpdatingStatus(true);
    setError("");
    try {
      const updated = await orderAdminApi.updateStatus(detail.id, statusDraft);
      setDetail(updated);
      setStatusDraft(updated.status);
      await loadOrders(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "وضعیت سفارش"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#b17b42]">
          <PackageCheck className="size-4" /> سفارش‌های فروشگاه
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">مدیریت سفارش‌ها</h1>
        <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
          سفارش‌ها را جست‌وجو، فیلتر و همراه با اقلام و اطلاعات ارسال بررسی
          کنید.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-5 shrink-0" /> {error}
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[#173f37]/10 bg-white shadow-xl shadow-[#173f37]/5">
        <div className="grid gap-3 border-b border-[#173f37]/8 p-4 md:grid-cols-[minmax(240px,1fr)_190px_190px_auto] md:p-6">
          <form className="relative" onSubmit={submitSearch}>
            <Search className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#173f37]/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="شماره سفارش، نام، تلفن یا کد پستی…"
              className="admin-input pr-11"
            />
          </form>
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as OrderStatus | "");
            }}
            className="admin-input"
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => {
              setPage(1);
              setSort(event.target.value as typeof sort);
            }}
            className="admin-input"
          >
            <option value="Newest">جدیدترین</option>
            <option value="Oldest">قدیمی‌ترین</option>
            <option value="HighestAmount">بیشترین مبلغ</option>
            <option value="LowestAmount">کمترین مبلغ</option>
          </select>
          <button
            type="button"
            onClick={() => void loadOrders(true)}
            disabled={refreshing}
            className="grid size-12 place-items-center rounded-xl border border-[#173f37]/10"
            aria-label="به‌روزرسانی"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          </button>
        </div>

        <details className="border-b border-[#173f37]/8 px-4 py-3 md:px-6">
          <summary className="cursor-pointer text-sm font-semibold text-[#173f37]/70">
            فیلترهای پیشرفته سفارش
          </summary>
          <form
            className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setAdvanced(advancedDraft);
            }}
          >
            <input
              value={advancedDraft.userId}
              onChange={(event) =>
                setAdvancedDraft({
                  ...advancedDraft,
                  userId: event.target.value,
                })
              }
              placeholder="شناسه کاربر (UUID)"
              className="admin-input"
              dir="ltr"
            />
            <select
              value={advancedDraft.provinceId}
              onChange={(event) => void changeProvince(event.target.value)}
              className="admin-input"
            >
              <option value="">همه استان‌ها</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <select
              value={advancedDraft.cityId}
              onChange={(event) =>
                setAdvancedDraft({
                  ...advancedDraft,
                  cityId: event.target.value,
                })
              }
              disabled={!advancedDraft.provinceId}
              className="admin-input disabled:opacity-45"
            >
              <option value="">همه شهرها</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <label className="text-xs text-[#173f37]/55">
              از تاریخ
              <input
                type="date"
                value={advancedDraft.fromUtc}
                onChange={(event) =>
                  setAdvancedDraft({
                    ...advancedDraft,
                    fromUtc: event.target.value,
                  })
                }
                className="admin-input mt-1"
              />
            </label>
            <label className="text-xs text-[#173f37]/55">
              تا تاریخ
              <input
                type="date"
                value={advancedDraft.toUtc}
                onChange={(event) =>
                  setAdvancedDraft({
                    ...advancedDraft,
                    toUtc: event.target.value,
                  })
                }
                className="admin-input mt-1"
              />
            </label>
            <input
              type="number"
              min={0}
              value={advancedDraft.minTotalInRials}
              onChange={(event) =>
                setAdvancedDraft({
                  ...advancedDraft,
                  minTotalInRials: event.target.value,
                })
              }
              placeholder="حداقل مبلغ (ریال)"
              className="admin-input"
              dir="ltr"
            />
            <input
              type="number"
              min={0}
              value={advancedDraft.maxTotalInRials}
              onChange={(event) =>
                setAdvancedDraft({
                  ...advancedDraft,
                  maxTotalInRials: event.target.value,
                })
              }
              placeholder="حداکثر مبلغ (ریال)"
              className="admin-input"
              dir="ltr"
            />
            <div className="flex gap-2 self-end">
              <button
                type="button"
                onClick={() => {
                  setAdvancedDraft(emptyAdvancedFilters);
                  setAdvanced(emptyAdvancedFilters);
                  setCities([]);
                  setPage(1);
                }}
                className="h-12 flex-1 rounded-xl border text-sm"
              >
                پاک‌کردن
              </button>
              <button
                type="submit"
                className="h-12 flex-1 rounded-xl bg-[#173f37] text-sm font-semibold text-white"
              >
                اعمال فیلتر
              </button>
            </div>
          </form>
        </details>

        {loading ? (
          <div className="grid min-h-80 place-items-center text-sm text-[#173f37]/55">
            <span className="flex items-center gap-3">
              <LoaderCircle className="size-5 animate-spin" /> در حال دریافت
              سفارش‌ها…
            </span>
          </div>
        ) : result.items.length === 0 ? (
          <div className="grid min-h-80 place-items-center text-sm text-[#173f37]/55">
            سفارشی پیدا نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-right">
              <thead>
                <tr className="border-b bg-[#faf9f6] text-xs text-[#173f37]/45">
                  <th className="px-6 py-4 font-medium">شماره سفارش</th>
                  <th className="px-6 py-4 font-medium">مشتری</th>
                  <th className="px-6 py-4 font-medium">مقصد</th>
                  <th className="px-6 py-4 font-medium">وضعیت</th>
                  <th className="px-6 py-4 font-medium">مبلغ</th>
                  <th className="px-6 py-4 font-medium">تاریخ</th>
                  <th className="px-6 py-4 text-left font-medium">جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-0 hover:bg-[#faf9f6]"
                  >
                    <td className="px-6 py-4 font-mono text-xs" dir="ltr">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{order.fullName}</p>
                      <p className="mt-1 text-xs text-[#173f37]/45" dir="ltr">
                        {order.phoneNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.provinceName}، {order.cityName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#d7a66c]/18 px-3 py-1.5 text-xs font-semibold">
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatProductPrice(order.totalAmountInRials)}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#173f37]/55">
                      {formatDate(order.createdAtUtc)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => void openDetail(order.id)}
                        className="mr-auto grid size-10 place-items-center rounded-xl border"
                        aria-label={`جزئیات ${order.orderNumber}`}
                      >
                        <Eye className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <button
              type="button"
              disabled={!result.hasPreviousPage}
              onClick={() => setPage((value) => value - 1)}
              className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-35"
            >
              <ChevronRight className="size-4" /> قبلی
            </button>
            <span className="text-xs text-[#173f37]/50">
              صفحه {result.page.toLocaleString("fa-IR")} از{" "}
              {result.totalPages.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              disabled={!result.hasNextPage}
              onClick={() => setPage((value) => value + 1)}
              className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-35"
            >
              بعدی <ChevronLeft className="size-4" />
            </button>
          </div>
        )}
      </section>

      {detailOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#102e28]/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            className="mx-auto my-6 w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">جزئیات سفارش</h2>
                {detail && (
                  <p
                    className="mt-2 font-mono text-xs text-[#173f37]/45"
                    dir="ltr"
                  >
                    {detail.orderNumber}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="grid size-10 place-items-center rounded-xl bg-[#f3f0e9]"
                aria-label="بستن"
              >
                <X className="size-4" />
              </button>
            </div>
            {detailLoading || !detail ? (
              <div className="grid min-h-64 place-items-center">
                <LoaderCircle className="size-7 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#173f37]/10 p-5">
                  <h3 className="mb-3 font-bold">تغییر وضعیت سفارش</h3>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      value={statusDraft}
                      onChange={(event) =>
                        setStatusDraft(event.target.value as OrderStatus)
                      }
                      disabled={updatingStatus}
                      className="admin-input flex-1"
                    >
                      {statuses
                        .filter(
                          (item): item is { value: OrderStatus; label: string } =>
                            item.value !== "",
                        )
                        .map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => void updateOrderStatus()}
                      disabled={updatingStatus || statusDraft === detail.status}
                      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#173f37] px-5 text-sm font-semibold text-white disabled:opacity-45"
                    >
                      {updatingStatus ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      ذخیره وضعیت
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 rounded-2xl bg-[#f8f6f1] p-5 text-sm sm:grid-cols-2">
                  <Info label="گیرنده" value={detail.fullName} />
                  <Info label="شماره تماس" value={detail.phoneNumber} />
                  <Info
                    label="استان و شهر"
                    value={`${detail.provinceName}، ${detail.cityName}`}
                  />
                  <Info label="کد پستی" value={detail.postalCode} />
                  <Info
                    label="نشانی"
                    value={detail.address}
                    className="sm:col-span-2"
                  />
                  <Info label="وضعیت" value={statusLabel(detail.status)} />
                  <Info
                    label="زمان ثبت"
                    value={formatDate(detail.createdAtUtc)}
                  />
                  {detail.deliveryDate &&
                    detail.deliveryWindowStart &&
                    detail.deliveryWindowEnd && (
                      <Info
                        label="زمان تحویل"
                        value={
                          formatPersianDeliveryDate(detail.deliveryDate) +
                          "، ساعت " +
                          formatDeliveryTime(detail.deliveryWindowStart) +
                          " تا " +
                          formatDeliveryTime(detail.deliveryWindowEnd)
                        }
                        className="sm:col-span-2"
                      />
                    )}
                </div>
                <div>
                  <h3 className="mb-3 font-bold">تراکنش‌های پرداخت</h3>
                  {detail.payments.length === 0 ? (
                    <p className="rounded-2xl border border-dashed p-5 text-sm text-[#173f37]/50">
                      هنوز تراکنشی برای این سفارش ثبت نشده است.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {detail.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex flex-col justify-between gap-3 rounded-2xl border p-4 text-sm sm:flex-row sm:items-center"
                        >
                          <div>
                            <p
                              className={
                                payment.status === "Succeeded"
                                  ? "font-semibold text-emerald-700"
                                  : "font-semibold text-red-700"
                              }
                            >
                              {payment.status === "Succeeded"
                                ? "تراکنش موفق"
                                : "تراکنش ناموفق"}
                            </p>
                            <p className="mt-1 text-xs text-[#173f37]/45">
                              درگاه {payment.provider} ·{" "}
                              {formatDate(payment.createdAtUtc)}
                            </p>
                          </div>
                          <div className="sm:text-left">
                            <p className="font-semibold">
                              {formatProductPrice(payment.amountInRials)}
                            </p>
                            {payment.referenceNumber && (
                              <p
                                className="mt-1 font-mono text-[11px] text-[#173f37]/45"
                                dir="ltr"
                              >
                                {payment.referenceNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="mb-3 font-bold">اقلام سفارش</h3>
                  <div className="space-y-3">
                    {detail.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="mt-1 text-xs text-[#173f37]/50">
                            {item.colorName} / سایز {item.sizeName} /{" "}
                            {item.quantity.toLocaleString("fa-IR")} عدد
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatProductPrice(item.lineTotalInRials)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 rounded-2xl bg-[#173f37] p-5 text-sm text-white">
                  <PriceRow
                    label="جمع محصولات"
                    value={detail.productsTotalInRials}
                  />
                  <PriceRow
                    label={`مالیات (${detail.taxPercentage.toLocaleString("fa-IR")}٪)`}
                    value={detail.taxAmountInRials}
                  />
                  <PriceRow
                    label="هزینه ارسال"
                    value={detail.shippingCostInRials}
                  />
                  <PriceRow
                    label="مبلغ نهایی"
                    value={detail.totalAmountInRials}
                    strong
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-[#173f37]/45">{label}</p>
      <p className="mt-1.5 font-medium">{value}</p>
    </div>
  );
}

function PriceRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between",
        strong && "border-t border-white/15 pt-3 text-base font-bold",
      )}
    >
      <span>{label}</span>
      <span>{formatProductPrice(value)}</span>
    </div>
  );
}
