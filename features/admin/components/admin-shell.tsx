"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FolderTree,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Palette,
  ShieldCheck,
  Store,
  Tags,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigation = [
  {
    href: "/admin/categories",
    label: "دسته‌بندی‌ها",
    description: "ساختار فروشگاه",
    icon: FolderTree,
  },
  {
    href: "/admin/brands",
    label: "برندها",
    description: "برندهای محصولات",
    icon: Tags,
  },
  {
    href: "/admin/colors",
    label: "رنگ‌ها",
    description: "رنگ‌های محصولات",
    icon: Palette,
  },
];

function isAdmin(role: string | null | undefined) {
  return role?.toLowerCase() === "admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && status === "anonymous") {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoginPage, pathname, router, status]);

  if (isLoginPage) return children;

  if (status === "loading" || (status === "anonymous" && !user)) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f0e9] text-[#173f37]">
        <div className="flex items-center gap-3 text-sm font-medium">
          <LoaderCircle className="size-5 animate-spin" />
          در حال بررسی دسترسی مدیر…
        </div>
      </main>
    );
  }

  if (!user || !isAdmin(user.role)) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f0e9] p-6 text-[#173f37]">
        <section className="w-full max-w-md rounded-[2rem] border border-[#173f37]/10 bg-white p-8 text-center shadow-xl shadow-[#173f37]/5">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="text-2xl font-bold">دسترسی غیرمجاز</h1>
          <p className="mt-3 text-sm leading-7 text-[#173f37]/65">
            این بخش فقط برای کاربران دارای نقش مدیر قابل استفاده است.
          </p>
          <div className="mt-7 flex gap-3">
            <Link
              href="/"
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#173f37]/15 font-medium"
            >
              بازگشت به فروشگاه
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
              className="h-12 flex-1 rounded-xl bg-[#173f37] font-medium text-white"
            >
              ورود مدیر
            </button>
          </div>
        </section>
      </main>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
        <div className="grid size-11 place-items-center rounded-2xl bg-[#d7a66c] text-[#173f37]">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <p className="text-lg font-bold">مدیریت بالوی</p>
          <p className="mt-0.5 text-xs text-white/50">مرکز کنترل فروشگاه</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <p className="mb-3 px-3 text-[11px] font-medium tracking-wider text-white/35">
          مدیریت محتوا
        </p>
        {navigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                active
                  ? "bg-white text-[#173f37]"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl",
                  active ? "bg-[#d7a66c]/25" : "bg-white/5",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={cn("text-[11px]", active ? "text-[#173f37]/50" : "text-white/35")}>
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="mb-2 flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <Store className="size-4" />
          مشاهده فروشگاه
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/65 transition hover:bg-red-500/15 hover:text-red-200 disabled:opacity-50"
        >
          {loggingOut ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
          خروج از حساب
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f0e9] text-[#173f37]">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-72 bg-[#173f37] text-white lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 w-[min(19rem,86vw)] bg-[#173f37] text-white shadow-2xl">
            <button
              type="button"
              aria-label="بستن منو"
              onClick={() => setMobileOpen(false)}
              className="absolute left-4 top-4 grid size-9 place-items-center rounded-xl bg-white/10"
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pr-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#173f37]/10 bg-[#f3f0e9]/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="باز کردن منو"
              onClick={() => setMobileOpen(true)}
              className="grid size-11 place-items-center rounded-xl border border-[#173f37]/10 bg-white lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#173f37]/45">
                <LayoutDashboard className="size-3.5" />
                پنل مدیریت
              </div>
              <p className="mt-1 text-sm font-semibold">خوش آمدید، {user.phoneNumber}</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-700/15 bg-emerald-700/10 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            مدیر سیستم
          </span>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
