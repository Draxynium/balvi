"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock3,
  LoaderCircle,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cartApi } from "@/features/cart/api/cart-api";
import {
  formatRialsAsTomans,
  resolveCartImage,
} from "@/features/cart/lib/format";
import type { Cart, City, Order, Province } from "@/features/cart/model/types";
import {
  isIranianMobile,
  normalizeIranianMobile,
  toEnglishDigits,
} from "@/features/auth/lib/validation";
import { ApiError, getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/hooks/use-cart";
import { deliveryApi } from "@/features/delivery/api/delivery-api";
import {
  formatDeliveryTime,
  formatPersianDeliveryDate,
} from "@/features/delivery/lib/persian-calendar";
import type { AvailableDeliverySchedule } from "@/features/delivery/model/types";

type CheckoutStep = 1 | 2 | 3;

const initialForm = {
  fullName: "",
  phoneNumber: "",
  provinceId: "",
  cityId: "",
  address: "",
  postalCode: "",
  deliveryDate: "",
  deliveryTimeSlotId: "",
};

export default function CartPage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const { syncCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [deliverySchedule, setDeliverySchedule] =
    useState<AvailableDeliverySchedule | null>(null);
  const [form, setForm] = useState(initialForm);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const goToLogin = useCallback(
    (returnPath = "/cart") => {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
    },
    [router],
  );

  const handleProtectedError = useCallback(
    (reason: unknown, returnPath = "/cart") => {
      if (reason instanceof ApiError && reason.status === 401) {
        goToLogin(returnPath);
        return;
      }
      setError(getApiErrorMessage(reason));
    },
    [goToLogin],
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    cartApi
      .get()
      .then((result) => {
        if (active) {
          setCart(result);
          syncCart(result);
        }
      })
      .catch((reason) => {
        if (active) handleProtectedError(reason);
      })
      .finally(() => {
        if (active) setLoadedForUserId(user?.id ?? null);
      });
    return () => {
      active = false;
    };
  }, [handleProtectedError, status, syncCart, user?.id]);

  useEffect(() => {
    if (
      status !== "authenticated" ||
      loadedForUserId !== user?.id ||
      !cart?.items.length ||
      step !== 1 ||
      new URLSearchParams(window.location.search).get("checkout") !== "1"
    ) {
      return;
    }

    let active = true;
    Promise.all([cartApi.getProvinces(), deliveryApi.getAvailable()])
      .then(([provinceResult, scheduleResult]) => {
        if (!active) return;
        setError("");
        setProvinces(provinceResult);
        setDeliverySchedule(scheduleResult);
        setForm((current) => ({
          ...current,
          phoneNumber: current.phoneNumber || user?.phoneNumber || "",
        }));
        setStep(2);
        window.history.replaceState(window.history.state, "", "/cart");
      })
      .catch((reason) => {
        if (active) setError(getApiErrorMessage(reason));
      });

    return () => {
      active = false;
    };
  }, [
    cart?.items.length,
    loadedForUserId,
    status,
    step,
    user?.id,
    user?.phoneNumber,
  ]);

  const loadCheckoutData = async () => {
    setLoading(true);
    setError("");
    try {
      const [provinceResult, scheduleResult] = await Promise.all([
        provinces.length ? Promise.resolve(provinces) : cartApi.getProvinces(),
        deliveryApi.getAvailable(),
      ]);
      setProvinces(provinceResult);
      setDeliverySchedule(scheduleResult);
      return true;
    } catch (reason) {
      setError(getApiErrorMessage(reason));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const continueToShipping = async () => {
    if (!cart?.items.length) return;
    if (status !== "authenticated" || !user) {
      goToLogin("/cart?checkout=1");
      return;
    }
    if (await loadCheckoutData()) {
      setForm((current) => ({
        ...current,
        phoneNumber: current.phoneNumber || user?.phoneNumber || "",
      }));
      setStep(2);
    }
  };

  const handleProvinceChange = async (provinceId: string) => {
    setForm((current) => ({ ...current, provinceId, cityId: "" }));
    setCities([]);
    if (!provinceId) return;
    setLoading(true);
    setError("");
    try {
      setCities(await cartApi.getCities(provinceId));
    } catch (reason) {
      setError(getApiErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setPendingItemId(itemId);
    setError("");
    try {
      const updatedCart = await cartApi.updateQuantity(itemId, quantity);
      setCart(updatedCart);
      syncCart(updatedCart);
    } catch (reason) {
      handleProtectedError(reason);
    } finally {
      setPendingItemId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setPendingItemId(itemId);
    setError("");
    try {
      await cartApi.removeItem(itemId);
      const updatedCart = await cartApi.get();
      setCart(updatedCart);
      syncCart(updatedCart);
    } catch (reason) {
      handleProtectedError(reason);
    } finally {
      setPendingItemId(null);
    }
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const createOrder = async () => {
    if (status !== "authenticated" || !user) {
      goToLogin("/cart?checkout=1");
      return;
    }
    if (!form.fullName.trim())
      return setError("نام و نام خانوادگی را وارد کنید.");
    if (!isIranianMobile(form.phoneNumber))
      return setError("شماره موبایل معتبر وارد کنید.");
    if (!form.provinceId || !form.cityId)
      return setError("استان و شهر را انتخاب کنید.");
    if (!form.address.trim()) return setError("آدرس کامل را وارد کنید.");

    const postalCode = toEnglishDigits(form.postalCode).replace(/\D/g, "");
    if (postalCode.length !== 10)
      return setError("کد پستی باید دقیقاً ۱۰ رقم باشد.");
    if (!form.deliveryDate || !form.deliveryTimeSlotId)
      return setError("روز و بازه زمانی تحویل را انتخاب کنید.");

    setSubmitting(true);
    setError("");
    try {
      const createdOrder = await cartApi.createOrder({
        ...form,
        fullName: form.fullName.trim(),
        phoneNumber: normalizeIranianMobile(form.phoneNumber),
        address: form.address.trim(),
        postalCode,
      });
      setOrder(createdOrder);
      setCart((current) =>
        current
          ? {
              ...current,
              items: [],
              totalQuantity: 0,
              productsTotalInRials: 0,
              taxAmountInRials: 0,
              shippingCostInRials: 0,
              totalAmountInRials: 0,
            }
          : current,
      );
      syncCart(null);
      setStep(3);
      router.push(`/orders/${createdOrder.id}/payment`);
    } catch (reason) {
      handleProtectedError(reason, "/cart?checkout=1");
    } finally {
      setSubmitting(false);
    }
  };

  const authenticated = status === "authenticated";
  const selectedDeliveryDay = deliverySchedule?.days.find(
    (day) => day.date === form.deliveryDate,
  );

  return (
    <main dir="rtl" className="flex w-full justify-center">
      <section className="w-full max-w-7xl px-6 pt-28 pb-20 sm:px-8">
        <div className="mx-auto mb-16 flex w-full max-w-3xl items-start">
          <CheckoutStepItem
            active={step === 1}
            completed={step > 1}
            icon={<ShoppingBag size={30} strokeWidth={1.5} />}
            title="سبد خرید"
            onClick={() => step < 3 && setStep(1)}
          />
          <StepLine completed={step > 1} />
          <CheckoutStepItem
            active={step === 2}
            completed={step > 2}
            icon={<Truck size={30} strokeWidth={1.5} />}
            title="اطلاعات ارسال"
            onClick={() => step === 2 && setStep(2)}
          />
          <StepLine completed={step > 2} />
          <CheckoutStepItem
            active={step === 3}
            completed={false}
            icon={<PackageCheck size={30} strokeWidth={1.5} />}
            title="ثبت سفارش"
            onClick={() => undefined}
          />
        </div>

        {status === "loading" ||
        (authenticated && loadedForUserId !== user?.id) ? (
          <LoadingState />
        ) : !authenticated ? (
          <div className="border-foreground/10 mx-auto flex min-h-72 max-w-xl flex-col items-center justify-center rounded-2xl border p-8 text-center">
            <ShoppingBag size={36} strokeWidth={1.4} />
            <h1 className="mt-5 text-2xl font-medium">
              سبد خرید شما محفوظ است
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-7">
              برای مشاهده سبد خرید و ثبت سفارش وارد حساب کاربری شوید.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent("/cart")}`}
              className="bg-foreground text-background mt-7 h-12 rounded-xl px-8"
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <p
                role="alert"
                className="bg-destructive/10 text-destructive mx-auto mb-6 max-w-3xl rounded-xl p-4 text-sm"
              >
                {error}
              </p>
            )}

            {step === 1 && (
              <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
                <div className="w-full flex-1">
                  {cart?.items.length ? (
                    <div className="border-foreground/10 border-t">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="border-foreground/10 flex flex-col gap-6 border-b py-7 sm:flex-row"
                        >
                          <Link
                            href={`/products/${item.productId}`}
                            className="bg-muted h-44 w-full shrink-0 overflow-hidden rounded-md sm:w-36"
                          >
                            <img
                              src={resolveCartImage(item.mainImageUrl)}
                              alt={item.productName}
                              className="h-full w-full object-contain"
                            />
                          </Link>
                          <div className="flex flex-1 flex-col justify-between gap-6">
                            <div className="flex items-start justify-between gap-6">
                              <div>
                                <Link
                                  href={`/products/${item.productId}`}
                                  className="text-xl font-medium"
                                >
                                  {item.productName}
                                </Link>
                                <div className="text-muted-foreground mt-3 space-y-1 text-sm">
                                  <p>رنگ: {item.colorName}</p>
                                  <p>سایز: {item.sizeName}</p>
                                  {!item.isAvailable && (
                                    <p className="text-destructive">
                                      موجودی کافی نیست
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="text-lg font-medium whitespace-nowrap">
                                {formatRialsAsTomans(item.lineTotalInRials)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="border-foreground/10 flex h-11 items-center rounded-md border">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={
                                    pendingItemId === item.id ||
                                    item.quantity <= 1
                                  }
                                  className="flex h-full w-11 items-center justify-center disabled:opacity-30"
                                  aria-label="کاهش تعداد"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-10 text-center text-sm">
                                  {pendingItemId === item.id ? (
                                    <LoaderCircle
                                      className="mx-auto animate-spin"
                                      size={15}
                                    />
                                  ) : (
                                    item.quantity.toLocaleString("fa-IR")
                                  )}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={
                                    pendingItemId === item.id ||
                                    item.quantity >= item.availableStockQuantity
                                  }
                                  className="flex h-full w-11 items-center justify-center disabled:opacity-30"
                                  aria-label="افزایش تعداد"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={pendingItemId === item.id}
                                className="text-muted-foreground hover:text-destructive flex items-center gap-2 text-sm disabled:opacity-40"
                              >
                                <Trash2 size={16} /> حذف محصول
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-64 flex-col items-center justify-center text-center">
                      <ShoppingBag size={34} strokeWidth={1.4} />
                      <h1 className="mt-4 text-2xl font-medium">
                        سبد خرید خالی است
                      </h1>
                      <Link href="/products" className="mt-5 text-sm underline">
                        مشاهده محصولات
                      </Link>
                    </div>
                  )}
                </div>
                <OrderSummary
                  cart={cart}
                  buttonText="ادامه فرایند خرید"
                  onClick={continueToShipping}
                />
              </div>
            )}

            {step === 2 && cart && (
              <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
                <div className="w-full flex-1">
                  <h1 className="text-3xl font-medium md:text-4xl">
                    اطلاعات ارسال
                  </h1>
                  <p className="text-muted-foreground mt-3">
                    اطلاعات تحویل سفارش را دقیق وارد کنید.
                  </p>
                  <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InputField
                      label="نام و نام خانوادگی"
                      value={form.fullName}
                      onChange={(value) => updateForm("fullName", value)}
                    />
                    <InputField
                      label="شماره تماس"
                      value={form.phoneNumber}
                      inputMode="tel"
                      onChange={(value) => updateForm("phoneNumber", value)}
                    />
                    <SelectField
                      label="استان"
                      value={form.provinceId}
                      options={provinces}
                      onChange={handleProvinceChange}
                    />
                    <SelectField
                      label="شهر"
                      value={form.cityId}
                      options={cities}
                      disabled={!form.provinceId || loading}
                      onChange={(value) => updateForm("cityId", value)}
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="آدرس کامل"
                        value={form.address}
                        onChange={(value) => updateForm("address", value)}
                      />
                    </div>
                    <InputField
                      label="کد پستی"
                      value={form.postalCode}
                      inputMode="numeric"
                      onChange={(value) => updateForm("postalCode", value)}
                    />
                  </div>
                  <section className="border-foreground/10 mt-9 rounded-3xl border p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
                        <CalendarDays size={20} />
                      </span>
                      <div>
                        <h2 className="font-medium">زمان تحویل سفارش</h2>
                        <p className="text-muted-foreground mt-1 text-xs leading-6">
                          یکی از روزها و بازه‌های فعال فروشگاه را انتخاب کنید.
                        </p>
                      </div>
                    </div>

                    {loading && !deliverySchedule ? (
                      <div className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
                        <LoaderCircle className="animate-spin" size={17} />
                        در حال دریافت زمان‌های ارسال…
                      </div>
                    ) : !deliverySchedule?.days.length ? (
                      <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                        در حال حاضر زمان فعالی برای تحویل ثبت نشده است. لطفاً
                        بعداً دوباره بررسی کنید.
                      </div>
                    ) : (
                      <>
                        <div className="mt-6 grid gap-2 sm:grid-cols-2">
                          {deliverySchedule.days.map((day) => (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  deliveryDate: day.date,
                                  deliveryTimeSlotId: "",
                                }))
                              }
                              className={cn(
                                "rounded-2xl border px-4 py-3 text-right text-sm transition",
                                form.deliveryDate === day.date
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-foreground/10 hover:border-foreground/30",
                              )}
                            >
                              {formatPersianDeliveryDate(day.date)}
                            </button>
                          ))}
                        </div>

                        {selectedDeliveryDay && (
                          <div className="mt-5">
                            <p className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
                              <Clock3 size={15} />
                              بازه زمانی
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedDeliveryDay.timeSlots.map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() =>
                                    updateForm("deliveryTimeSlotId", slot.id)
                                  }
                                  className={cn(
                                    "rounded-xl border px-4 py-2.5 text-sm transition",
                                    form.deliveryTimeSlotId === slot.id
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-foreground/10",
                                  )}
                                >
                                  {slot.label ? slot.label + " · " : ""}
                                  {formatDeliveryTime(slot.startTime)} تا{" "}
                                  {formatDeliveryTime(slot.endTime)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </section>
                  <div className="mt-10 flex gap-4">
                    <button
                      type="button"
                      onClick={createOrder}
                      disabled={
                        submitting ||
                        !deliverySchedule?.days.length ||
                        !form.deliveryTimeSlotId
                      }
                      className="bg-foreground text-background flex h-14 items-center gap-2 rounded-md px-10 font-medium disabled:opacity-50"
                    >
                      {submitting && (
                        <LoaderCircle className="animate-spin" size={18} />
                      )}
                      ثبت نهایی سفارش
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border-foreground/10 h-14 rounded-md border px-8"
                    >
                      بازگشت
                    </button>
                  </div>
                </div>
                <OrderSummary
                  cart={cart}
                  buttonText="ثبت نهایی سفارش"
                  onClick={createOrder}
                  disabled={
                    submitting ||
                    !deliverySchedule?.days.length ||
                    !form.deliveryTimeSlotId
                  }
                />
              </div>
            )}

            {step === 3 && order && (
              <div className="border-foreground/10 mx-auto flex min-h-96 max-w-2xl flex-col items-center justify-center rounded-3xl border p-8 text-center">
                <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full">
                  <Check size={32} />
                </div>
                <h1 className="mt-6 text-3xl font-medium">
                  خرید شما با موفقیت ثبت شد
                </h1>
                <p className="text-muted-foreground mt-3">
                  شماره سفارش:{" "}
                  <span className="text-foreground font-medium">
                    {order.orderNumber}
                  </span>
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  مبلغ نهایی {formatRialsAsTomans(order.totalAmountInRials)}
                </p>
                <p className="text-muted-foreground mt-2 text-xs leading-6">
                  موجودی کالاهای خریداری‌شده از فروشگاه کسر شد.
                </p>
                <Link
                  href="/products"
                  className="bg-foreground text-background mt-8 rounded-xl px-8 py-3"
                >
                  بازگشت به فروشگاه
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="text-muted-foreground flex min-h-72 items-center justify-center">
      <LoaderCircle className="animate-spin" size={28} />
    </div>
  );
}

function StepLine({ completed }: { completed: boolean }) {
  return (
    <div
      className={`mt-8 h-px flex-1 ${completed ? "bg-foreground/40" : "bg-foreground/10"}`}
    />
  );
}

function CheckoutStepItem({
  active,
  completed,
  icon,
  title,
  onClick,
}: {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-28 shrink-0 flex-col items-center gap-3 ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {completed ? (
        <span className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full">
          <Check size={17} />
        </span>
      ) : (
        icon
      )}
      <span className={active ? "font-medium" : ""}>{title}</span>
    </button>
  );
}

function OrderSummary({
  cart,
  buttonText,
  onClick,
  disabled,
}: {
  cart: Cart | null;
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <ScrollReveal direction="left" distance={40} className="w-full lg:w-90">
      <div className="border-foreground/10 sticky top-28 rounded-md border p-7">
        <h2 className="text-2xl font-medium">خلاصه سفارش</h2>
        <div className="mt-8 space-y-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">مجموع محصولات</span>
            <span>{formatRialsAsTomans(cart?.productsTotalInRials ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              مالیات
              {cart ? ` (${cart.taxPercentage.toLocaleString("fa-IR")}٪)` : ""}
            </span>
            <span>{formatRialsAsTomans(cart?.taxAmountInRials ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">هزینه ارسال</span>
            <span>{formatRialsAsTomans(cart?.shippingCostInRials ?? 0)}</span>
          </div>
        </div>
        <div className="border-foreground/10 my-6 border-t" />
        <div className="flex items-center justify-between">
          <span className="font-medium">مبلغ نهایی</span>
          <span className="text-lg font-medium">
            {formatRialsAsTomans(cart?.totalAmountInRials ?? 0)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || !cart?.items.length}
          className="bg-foreground text-background mt-8 h-14 w-full rounded-md font-medium disabled:cursor-not-allowed disabled:opacity-30"
        >
          {buttonText}
        </button>
      </div>
    </ScrollReveal>
  );
}

function InputField({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-3 block">{label}</span>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="border-foreground/10 bg-muted/60 focus:border-foreground/30 h-14 w-full rounded-md border px-5 outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; name: string }>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-3 block">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="border-foreground/10 bg-muted/60 focus:border-foreground/30 h-14 w-full rounded-md border px-5 outline-none disabled:opacity-50"
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
