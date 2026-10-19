"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getAuthErrorMessage } from "@/features/auth/api/auth-api";
import { useAuth } from "@/features/auth/hooks/use-auth";

function isAdmin(role: string | null | undefined) {
  return role?.toLowerCase() === "admin";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, status, login, logout } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("09120274606");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && isAdmin(user?.role)) {
      const requestedPath = new URLSearchParams(window.location.search).get(
        "next",
      );
      const destination = requestedPath?.startsWith("/admin/")
        ? requestedPath
        : "/admin/categories";
      router.replace(destination);
    }
  }, [router, status, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhoneNumber = phoneNumber.trim();

    if (!normalizedPhoneNumber || !password) {
      setError("شماره موبایل و رمز عبور را کامل وارد کنید.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (user) await logout();
      const authenticatedUser = await login(normalizedPhoneNumber, password);
      if (!isAdmin(authenticatedUser.role)) {
        await logout();
        setError("این حساب دسترسی مدیریت ندارد.");
        return;
      }

      const requestedPath = new URLSearchParams(window.location.search).get(
        "next",
      );
      router.replace(
        requestedPath?.startsWith("/admin/")
          ? requestedPath
          : "/admin/categories",
      );
    } catch (reason) {
      setError(getAuthErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#f3f0e9] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#173f37] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -left-24 size-80 rounded-full border border-white/10" />
        <div className="absolute -top-10 -left-10 size-52 rounded-full border border-[#d7a66c]/30" />
        <div className="absolute right-[-5rem] bottom-[-8rem] size-[28rem] rounded-full bg-[#d7a66c]/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#d7a66c] text-[#173f37]">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <p className="text-xl font-bold">بالوی</p>
            <p className="text-xs text-white/50">پنل مدیریت فروشگاه</p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-medium text-[#d7a66c]">
            فضای اختصاصی مدیران
          </p>
          <h1 className="text-4xl leading-[1.55] font-bold xl:text-5xl">
            مدیریت سایت
          </h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-white/55">
            ساختار دسته‌بندی‌های فروشگاه را از یک محیط امن و یکپارچه مدیریت
            کنید.
          </p>
        </div>

        <p className="relative text-xs text-white/35">Balvi Admin Console</p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#173f37]/55 transition hover:text-[#173f37]"
          >
            <ArrowLeft className="size-4" />
            بازگشت به فروشگاه
          </Link>

          <div className="rounded-[2rem] border border-[#173f37]/10 bg-white p-6 shadow-2xl shadow-[#173f37]/7 sm:p-9">
            <div className="mb-8">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#173f37] text-white lg:hidden">
                <ShieldCheck className="size-7" />
              </div>
              <p className="text-xs font-semibold text-[#b17b42]">ورود امن</p>
              <h2 className="mt-2 text-3xl font-bold text-[#173f37]">
                ورود به پنل مدیریت
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
                اطلاعات حساب مدیر را وارد کنید.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#173f37]">
                  شماره موبایل
                </span>
                <span className="relative block">
                  <UserRound className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#173f37]/35" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    className="h-14 w-full rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] px-12 text-left transition outline-none focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
                    placeholder="09120274606"
                    disabled={submitting}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#173f37]">
                  رمز عبور
                </span>
                <span className="relative block">
                  <LockKeyhole className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#173f37]/35" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    dir="ltr"
                    className="h-14 w-full rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] px-12 text-left transition outline-none focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
                    placeholder="••••••••••"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#173f37]/35 transition hover:text-[#173f37]"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </span>
              </label>

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || status === "loading"}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#173f37] font-semibold text-white transition hover:bg-[#214f45] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    در حال ورود…
                  </>
                ) : (
                  "ورود به پنل"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
