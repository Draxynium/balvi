"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  BadgePercent,
  CheckCircle2,
  LoaderCircle,
  Save,
  Settings2,
  Truck,
} from "lucide-react";
import { settingsAdminApi } from "@/features/admin/settings/api";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { formatRialsAsTomans } from "@/features/cart/lib/format";

export function SettingsManager() {
  const [taxPercentage, setTaxPercentage] = useState("");
  const [shippingCostInRials, setShippingCostInRials] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    settingsAdminApi
      .getCheckout()
      .then((settings) => {
        if (!active) return;
        setTaxPercentage(String(settings.taxPercentage));
        setShippingCostInRials(String(settings.shippingCostInRials));
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "تنظیمات"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tax = Number(taxPercentage);
    const shipping = Number(shippingCostInRials);

    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      setError("درصد مالیات باید عددی بین صفر تا صد باشد.");
      return;
    }
    if (!Number.isSafeInteger(shipping) || shipping < 0) {
      setError("هزینه ارسال باید یک عدد صحیح و نامنفی بر حسب ریال باشد.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const settings = await settingsAdminApi.updateCheckout({
        taxPercentage: tax,
        shippingCostInRials: shipping,
      });
      setTaxPercentage(String(settings.taxPercentage));
      setShippingCostInRials(String(settings.shippingCostInRials));
      setSuccess("تنظیمات مالیات و ارسال ذخیره شد.");
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "تنظیمات"));
    } finally {
      setSaving(false);
    }
  };

  const shippingPreview = Number(shippingCostInRials);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#b17b42]">
          <Settings2 className="size-4" /> تنظیمات فروشگاه
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">مالیات و هزینه ارسال</h1>
        <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
          این مقادیر روی تمام سبدهای خرید و سفارش‌های جدید اعمال می‌شوند.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-5 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="size-5 shrink-0" /> {success}
        </div>
      )}

      <section className="rounded-[2rem] border border-[#173f37]/10 bg-white p-6 shadow-xl shadow-[#173f37]/5 sm:p-8">
        {loading ? (
          <div className="grid min-h-72 place-items-center text-sm text-[#173f37]/55">
            <span className="flex items-center gap-3">
              <LoaderCircle className="size-5 animate-spin" /> در حال دریافت
              تنظیمات…
            </span>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-7">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="rounded-2xl border border-[#173f37]/10 p-5">
                <span className="mb-4 flex items-center gap-3 font-bold">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#d7a66c]/20 text-[#9a642f]">
                    <BadgePercent className="size-5" />
                  </span>
                  درصد مالیات
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.0001"
                  required
                  value={taxPercentage}
                  onChange={(event) => setTaxPercentage(event.target.value)}
                  className="admin-input"
                  dir="ltr"
                />
                <span className="mt-3 block text-xs leading-6 text-[#173f37]/50">
                  اعشار مجاز است؛ مثلاً ۹.۵ برای نه و نیم درصد.
                </span>
              </label>

              <label className="rounded-2xl border border-[#173f37]/10 p-5">
                <span className="mb-4 flex items-center gap-3 font-bold">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#d7a66c]/20 text-[#9a642f]">
                    <Truck className="size-5" />
                  </span>
                  هزینه ارسال (ریال)
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={shippingCostInRials}
                  onChange={(event) =>
                    setShippingCostInRials(event.target.value)
                  }
                  className="admin-input"
                  dir="ltr"
                />
                <span className="mt-3 block text-xs leading-6 text-[#173f37]/50">
                  {Number.isFinite(shippingPreview) && shippingPreview >= 0
                    ? `نمایش برای مشتری: ${formatRialsAsTomans(shippingPreview)}`
                    : "مبلغ را به ریال وارد کنید."}
                </span>
              </label>
            </div>

            <div className="rounded-2xl bg-[#f8f6f1] p-5 text-sm leading-7 text-[#173f37]/65">
              مبلغ نهایی هر سبد برابر است با جمع قیمت محصولات، به‌علاوه مالیات
              درصدی و هزینه ارسال. مبلغ و درصد مالیات هنگام ثبت سفارش ذخیره
              می‌شود تا سفارش‌های قبلی با تغییر تنظیمات عوض نشوند.
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#173f37] px-7 font-semibold text-white disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Save className="size-5" />
              )}
              ذخیره تنظیمات
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
