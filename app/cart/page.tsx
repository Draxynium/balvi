"use client";

import { Check, Minus, Plus, Trash2, Truck, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "@/components/scroll-reveal";

type CartItem = {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
};

type CheckoutStep = 1 | 2 | 3;

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "بوت مشکی کلاسیک",
    color: "مشکی",
    size: "۴۲",
    price: 2850000,
    quantity: 1,
    image: "/images/boot.png",
  },
  {
    id: 2,
    name: "کفش چرمی کلاسیک",
    color: "قهوه‌ای",
    size: "۴۱",
    price: 2450000,
    quantity: 2,
    image: "/images/boot.png",
  },
];

const formatPrice = (price: number) => {
  return `${price.toLocaleString("fa-IR")} تومان`;
};

export default function CartPage() {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [gateway, setGateway] = useState<"mellat" | "zarinpal" | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const updateQuantity = (id: number, amount: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + amount),
            }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = items.length > 0 ? 150000 : 0;
  const total = subtotal + shipping;

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <main dir="rtl" className="w-full flex justify-center">
      <section className="w-full max-w-7xl px-6 sm:px-8 pt-28 pb-20">
        <ScrollReveal direction="bottom" distance={30} duration={1}>
          <div className="flex items-center justify-center gap-5 text-sm mb-16">
            <span className={step === 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
              خانه
            </span>

            <span className="text-muted-foreground">|</span>

            <span className={step === 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
              سبد خرید
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={40} duration={1}>
          <div className="w-full max-w-3xl mx-auto mb-20">
            <div className="flex items-start">
              <CheckoutStepItem
                active={step === 1}
                completed={step > 1}
                icon={<ShoppingBag size={34} strokeWidth={1.5} />}
                title="سبد خرید"
                onClick={() => setStep(1)}
              />

              <div
                className={`flex-1 h-[3px] mt-[38px] ${
                  step > 1 ? "bg-foreground/40" : "bg-foreground/10"
                }`}
              />

              <CheckoutStepItem
                active={step === 2}
                completed={step > 2}
                icon={<Truck size={34} strokeWidth={1.5} />}
                title="اطلاعات ارسال"
                onClick={() => {
                  if (step >= 2) setStep(2);
                }}
              />

              <div
                className={`flex-1 h-[3px] mt-[38px] ${
                  step > 2 ? "bg-foreground/40" : "bg-foreground/10"
                }`}
              />

              <CheckoutStepItem
                active={step === 3}
                completed={false}
                icon={<CreditCard size={34} strokeWidth={1.5} />}
                title="پرداخت"
                onClick={() => {
                  if (step >= 3) setStep(3);
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        {step === 1 && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <div className="flex-1 w-full">
              <ScrollReveal direction="right" distance={50}>
                <div className="border-t border-foreground/10">
                  {items.map((item, index) => (
                    <ScrollReveal
                      key={item.id}
                      direction="right"
                      distance={40}
                      delay={index * 0.1}
                    >
                      <div className="flex flex-col sm:flex-row gap-6 py-7 border-b border-foreground/10">
                        <div className="w-full sm:w-36 h-40 sm:h-44 shrink-0 rounded-md overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between gap-6">
                          <div className="flex justify-between items-start gap-6">
                            <div>
                              <h2 className="text-xl md:text-2xl font-medium">
                                {item.name}
                              </h2>

                              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                <p>رنگ: {item.color}</p>
                                <p>سایز: {item.size}</p>
                              </div>
                            </div>

                            <p className="text-lg md:text-xl font-medium whitespace-nowrap">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-foreground/10 rounded-md h-11">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-11 h-full flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus size={16} />
                              </button>

                              <span className="w-10 text-center text-sm">
                                {item.quantity.toLocaleString("fa-IR")}
                              </span>

                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-11 h-full flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Trash2 size={16} />
                              حذف محصول
                            </button>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              buttonText="ادامه فرایند خرید"
              onClick={() => setStep(2)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <ScrollReveal
              direction="right"
              distance={50}
              className="flex-1 w-full"
            >
              <div className="w-full">
                <div className="mb-10">
                  <h1 className="text-3xl md:text-4xl font-medium">
                    اطلاعات ارسال
                  </h1>

                  <p className="mt-3 text-muted-foreground">
                    اطلاعات لازم برای ارسال سفارش خود را وارد کنید.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="نام و نام خانوادگی"
                    placeholder="مثلاً امین طاهری"
                    value={form.name}
                    onChange={(value) => updateForm("name", value)}
                  />

                  <InputField
                    label="شماره تماس"
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    value={form.phone}
                    onChange={(value) => updateForm("phone", value)}
                  />

                  <InputField
                    label="استان"
                    placeholder="تهران"
                    value={form.province}
                    onChange={(value) => updateForm("province", value)}
                  />

                  <InputField
                    label="شهر"
                    placeholder="تهران"
                    value={form.city}
                    onChange={(value) => updateForm("city", value)}
                  />

                  <div className="sm:col-span-2">
                    <InputField
                      label="آدرس"
                      placeholder="آدرس کامل محل تحویل سفارش"
                      value={form.address}
                      onChange={(value) => updateForm("address", value)}
                    />
                  </div>

                  <InputField
                    label="کد پستی"
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                    value={form.postalCode}
                    onChange={(value) => updateForm("postalCode", value)}
                  />
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() => setStep(3)}
                    className="h-14 px-10 rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                  >
                    ادامه و انتخاب درگاه
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="h-14 px-8 rounded-md border border-foreground/10 hover:bg-muted transition-colors"
                  >
                    بازگشت
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              buttonText="ادامه و انتخاب درگاه"
              onClick={() => setStep(3)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <ScrollReveal
              direction="right"
              distance={50}
              className="flex-1 w-full"
            >
              <div>
                <div className="mb-10">
                  <h1 className="text-3xl md:text-4xl font-medium">
                    انتخاب درگاه پرداخت
                  </h1>

                  <p className="mt-3 text-muted-foreground">
                    درگاه مورد نظر خود را برای پرداخت سفارش انتخاب کنید.
                  </p>
                </div>

                <div className="space-y-4">
                  <PaymentGateway
                    active={gateway === "mellat"}
                    title="درگاه بانک ملت"
                    description="پرداخت امن از طریق درگاه بانک ملت"
                    onClick={() => setGateway("mellat")}
                  />

                  <PaymentGateway
                    active={gateway === "zarinpal"}
                    title="زرین پال"
                    description="پرداخت آنلاین از طریق زرین پال"
                    onClick={() => setGateway("zarinpal")}
                  />
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    disabled={!gateway}
                    className="h-14 px-10 rounded-md bg-foreground text-background font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
                  >
                    پرداخت {formatPrice(total)}
                  </button>

                  <button
                    onClick={() => setStep(2)}
                    className="h-14 px-8 rounded-md border border-foreground/10 hover:bg-muted transition-colors"
                  >
                    بازگشت
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              buttonText="پرداخت"
              onClick={() => {}}
            />
          </div>
        )}
      </section>
    </main>
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
      onClick={onClick}
      className={`w-[110px] shrink-0 flex flex-col items-center gap-3 transition-colors ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <div className="relative">
        {completed ? (
          <div className="w-[38px] h-[38px] rounded-md bg-foreground text-background flex items-center justify-center">
            <Check size={19} />
          </div>
        ) : (
          icon
        )}
      </div>

      <span className={`text-base ${active ? "font-medium" : ""}`}>
        {title}
      </span>
    </button>
  );
}

function OrderSummary({
  subtotal,
  shipping,
  total,
  buttonText,
  onClick,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <ScrollReveal
      direction="left"
      distance={50}
      delay={0.2}
      className="w-full lg:w-[360px]"
    >
      <div className="border border-foreground/10 rounded-md p-6 md:p-7 sticky top-28">
        <h2 className="text-2xl font-medium">
          خلاصه سفارش
        </h2>

        <div className="mt-8 space-y-5">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">
              مجموع محصولات
            </span>

            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">
              هزینه ارسال
            </span>

            <span>{formatPrice(shipping)}</span>
          </div>
        </div>

        <div className="my-6 border-t border-foreground/10" />

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">
            مبلغ نهایی
          </span>

          <span className="text-xl font-medium">
            {formatPrice(total)}
          </span>
        </div>

        <button
          onClick={onClick}
          className="w-full h-14 mt-8 rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          {buttonText}
        </button>
      </div>
    </ScrollReveal>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm mb-3">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-14 px-5 rounded-md bg-muted/60 outline-none border border-foreground/10 focus:border-foreground/20 transition-colors"
      />
    </div>
  );
}

function PaymentGateway({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-5 p-5 rounded-md border text-right transition-colors ${
        active
          ? "border-foreground/40 bg-muted/60"
          : "border-foreground/10 hover:border-foreground/20"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
          active ? "border-foreground" : "border-foreground/20"
        }`}
      >
        {active && (
          <div className="w-2.5 h-2.5 rounded-md bg-foreground" />
        )}
      </div>

      <div>
        <p className="text-lg font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}