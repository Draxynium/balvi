"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserRoundX,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { userAdminApi } from "./api";
import type { AdminUser, PagedUsers } from "./types";
import { cn } from "@/lib/utils";

const emptyPage: PagedUsers = {
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

function roleLabel(role: string | null) {
  if (role?.toLowerCase() === "admin") return "مدیر";
  if (role?.toLowerCase() === "customer") return "مشتری";
  return role || "بدون نقش";
}

export function UsersManager() {
  const { user: currentUser } = useAuth();
  const [result, setResult] = useState(emptyPage);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState("");
  const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const activeFilter = status === "all" ? undefined : status === "active";

  const loadUsers = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setResult(
          await userAdminApi.list({
            search,
            isActive: activeFilter,
            page,
            pageSize: 20,
          }),
        );
      } catch (reason) {
        setError(getAdminApiErrorMessage(reason, "کاربر"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeFilter, page, search],
  );

  useEffect(() => {
    let active = true;
    userAdminApi
      .list({ search, isActive: activeFilter, page, pageSize: 20 })
      .then((users) => {
        if (active) setResult(users);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "کاربر"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeFilter, page, search]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const toggleStatus = async (target: AdminUser) => {
    if (
      !target.isActive &&
      !window.confirm(`حساب ${target.phoneNumber} دوباره فعال شود؟`)
    ) {
      return;
    }
    if (
      target.isActive &&
      !window.confirm(`حساب ${target.phoneNumber} غیرفعال شود؟`)
    ) {
      return;
    }

    setUpdatingId(target.id);
    setError("");
    try {
      await userAdminApi.setActive(target.id, !target.isActive);
      setNotice(
        target.isActive ? "حساب کاربر غیرفعال شد." : "حساب کاربر فعال شد.",
      );
      await loadUsers(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "کاربر"));
    } finally {
      setUpdatingId("");
    }
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordUser) return;
    setFormError("");
    if (password.length < 8 || !/\d/.test(password)) {
      setFormError("رمز باید حداقل ۸ کاراکتر و شامل حداقل یک عدد باشد.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("تکرار رمز با رمز جدید یکسان نیست.");
      return;
    }

    setSavingPassword(true);
    try {
      await userAdminApi.resetPassword(passwordUser.id, password);
      setPasswordUser(null);
      setPassword("");
      setConfirmPassword("");
      setNotice("رمز کاربر تغییر کرد و نشست‌های قبلی او بسته شد.");
    } catch (reason) {
      setFormError(getAdminApiErrorMessage(reason, "کاربر"));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl" dir="rtl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#b17b42]">
          <Users className="size-4" /> حساب‌های فروشگاه
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">مدیریت کاربران</h1>
        <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
          کاربران را مشاهده، فعال یا غیرفعال کنید و در صورت نیاز رمز آن‌ها را
          تغییر دهید.
        </p>
      </div>

      {notice ? (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-5 shrink-0" /> {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] border border-[#173f37]/10 bg-white shadow-xl shadow-[#173f37]/5">
        <div className="grid gap-3 border-b border-[#173f37]/8 p-4 md:grid-cols-[minmax(240px,1fr)_190px_auto] md:p-6">
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setSearch(query.trim());
            }}
          >
            <Search className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#173f37]/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی شماره تلفن…"
              className="admin-input pr-11"
            />
          </form>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as typeof status);
              setPage(1);
            }}
            className="admin-input"
          >
            <option value="all">همه کاربران</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
          <button
            type="button"
            onClick={() => void loadUsers(true)}
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
            {result.items.map((account) => {
              const isCurrent = account.id === currentUser?.id;
              return (
                <article
                  key={account.id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:px-6"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#173f37]/7">
                    {account.role?.toLowerCase() === "admin" ? (
                      <ShieldCheck className="size-5" />
                    ) : (
                      <Users className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong dir="ltr" className="text-base">
                        {account.phoneNumber}
                      </strong>
                      <span className="rounded-full bg-[#173f37]/7 px-2.5 py-1 text-xs font-semibold">
                        {roleLabel(account.role)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          account.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700",
                        )}
                      >
                        {account.isActive ? "فعال" : "غیرفعال"}
                      </span>
                      {isCurrent ? (
                        <span className="text-xs text-[#b17b42]">حساب شما</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-[#173f37]/50">
                      عضویت: {formatDate(account.createdAtUtc)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordUser(account);
                        setPassword("");
                        setConfirmPassword("");
                        setFormError("");
                      }}
                      className="flex h-10 items-center gap-2 rounded-xl border border-[#173f37]/12 px-3 text-sm font-semibold hover:bg-[#173f37]/5"
                    >
                      <KeyRound className="size-4" /> تغییر رمز
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleStatus(account)}
                      disabled={
                        updatingId === account.id ||
                        (isCurrent && account.isActive)
                      }
                      title={
                        isCurrent && account.isActive
                          ? "نمی‌توانید حساب فعلی خود را غیرفعال کنید"
                          : undefined
                      }
                      className={cn(
                        "flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40",
                        account.isActive
                          ? "border-red-200 text-red-700 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
                      )}
                    >
                      {updatingId === account.id ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : account.isActive ? (
                        <UserRoundX className="size-4" />
                      ) : (
                        <UserCheck className="size-4" />
                      )}
                      {account.isActive ? "غیرفعال‌کردن" : "فعال‌کردن"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center text-sm text-[#173f37]/50">
            کاربری پیدا نشد.
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

      {passwordUser ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={submitPassword}
            className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">تغییر رمز کاربر</h2>
                <p dir="ltr" className="mt-1 text-sm text-[#173f37]/55">
                  {passwordUser.phoneNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordUser(null)}
                disabled={savingPassword}
                className="grid size-9 place-items-center rounded-xl hover:bg-black/5"
              >
                <X className="size-5" />
              </button>
            </div>
            {formError ? (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}
            <label className="mt-6 block space-y-2">
              <span className="text-sm font-semibold">رمز جدید</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="admin-input"
                required
              />
            </label>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-semibold">تکرار رمز جدید</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="admin-input"
                required
              />
            </label>
            <p className="mt-3 text-xs leading-6 text-[#173f37]/50">
              حداقل ۸ کاراکتر و شامل حداقل یک عدد. بعد از ذخیره، نشست‌های قبلی
              کاربر بسته می‌شوند.
            </p>
            <button
              type="submit"
              disabled={savingPassword}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173f37] font-semibold text-white disabled:opacity-50"
            >
              {savingPassword ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <KeyRound className="size-4" />
              )}
              ذخیره رمز جدید
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
