import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "حریم خصوصی | بالوی",
  description:
    "سیاست حریم خصوصی بالوی؛ چطور اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم.",
};

const sections = [
  {
    id: "intro",
    title: "مقدمه",
    body: [
      "بالوی به حریم خصوصی کاربران خود احترام می‌گذارد. این سند توضیح می‌دهد چه اطلاعاتی از شما جمع‌آوری می‌کنیم، چرا آن‌ها را جمع می‌کنیم و چگونه از آن‌ها محافظت می‌کنیم.",
      "با استفاده از وب‌سایت بالوی، با شرایط این سیاست حریم خصوصی موافقت می‌کنید. اگر با هر بخشی از آن موافق نیستید، لطفاً از سایت استفاده نکنید.",
    ],
  },
  {
    id: "collect",
    title: "اطلاعاتی که جمع‌آوری می‌کنیم",
    body: [
      "اطلاعاتی که مستقیماً در اختیار ما قرار می‌دهید، مثل نام، شماره تماس، ایمیل و آدرس، هنگام ثبت سفارش، تکمیل فرم تماس یا درخواست همکاری.",
      "اطلاعاتی که به‌صورت خودکار ثبت می‌شود، مثل آدرس IP، نوع مرورگر، دستگاه و صفحاتی که بازدید کرده‌اید — برای بهبود تجربه‌ی کاربری و امنیت سایت.",
    ],
  },
  {
    id: "usage",
    title: "چطور از اطلاعات استفاده می‌کنیم",
    body: [
      "پردازش و ارسال سفارش‌ها، پاسخ به درخواست‌ها و هماهنگی‌های مربوط به خدمات.",
      "اطلاع‌رسانی درباره‌ی تغییرات، محصولات جدید یا پیشنهادهای ویژه — تنها در صورتی که خودتان اجازه داده باشید.",
      "بهبود عملکرد سایت، تحلیل رفتار کاربران به‌صورت ناشناس و پیشگیری از تقلب و سوءاستفاده.",
    ],
  },
  {
    id: "share",
    title: "اشتراک‌گذاری اطلاعات",
    body: [
      "بالوی اطلاعات شخصی شما را به هیچ شخص یا شرکت ثالثی نمی‌فروشد.",
      "اطلاعات فقط در موارد ضروری با شرکای خدماتی ما به اشتراک گذاشته می‌شود؛ مثلاً شرکت پست برای ارسال سفارش یا درگاه پرداخت برای تسویه‌حساب.",
      "در صورت درخواست قانونی از سوی مراجع قضایی، اطلاعات لازم در اختیار آن مراجع قرار می‌گیرد.",
    ],
  },
  {
    id: "cookies",
    title: "کوکی‌ها",
    body: [
      "سایت بالوی از کوکی‌ها برای نگه‌داشتن وضعیت ورود، سبد خرید و تنظیمات کاربر استفاده می‌کند.",
      "می‌توانید کوکی‌ها را از تنظیمات مرورگر خود غیرفعال کنید، اما در این صورت ممکن است بعضی از امکانات سایت به‌درستی کار نکنند.",
    ],
  },
  {
    id: "security",
    title: "امنیت اطلاعات",
    body: [
      "داده‌های شما روی سرورهای امن و با پروتکل رمزنگاری HTTPS منتقل می‌شود.",
      "دسترسی به اطلاعات کاربران فقط برای کارکنانی مجاز است که برای انجام وظایف خود به آن نیاز دارند.",
      "با این حال، هیچ روش انتقال یا ذخیره‌سازی داده‌ای صددرصد امن نیست؛ ما تلاش می‌کنیم با استانداردهای رایج، ریسک را به حداقل برسانیم.",
    ],
  },
  {
    id: "rights",
    title: "حقوق شما",
    body: [
      "دسترسی به اطلاعاتی که از شما نگه می‌داریم و درخواست اصلاح آن.",
      "درخواست حذف اطلاعات شخصی، در چارچوب قوانین و الزامات قانونی.",
      "لغو اشتراک از خبرنامه یا هر نوع ارتباط تبلیغاتی، در هر زمان.",
    ],
  },
  {
    id: "retention",
    title: "نگهداری اطلاعات",
    body: [
      "اطلاعات شما تا زمانی که برای ارائه‌ی خدمات یا رعایت الزامات قانونی لازم باشد، نگه‌داری می‌شود.",
      "پس از پایان این دوره، اطلاعات به‌صورت ایمن حذف یا ناشناس‌سازی می‌شود.",
    ],
  },
  {
    id: "changes",
    title: "تغییرات در این سیاست",
    body: [
      "ممکن است این سند را در طول زمان به‌روزرسانی کنیم. تغییرات مهم از طریق همین صفحه یا ایمیل اطلاع داده می‌شود.",
      "تاریخ آخرین به‌روزرسانی در بالای همین صفحه درج شده است.",
    ],
  },
];

export default function PrivacyPage() {
  const lastUpdated = "۱۴۰۴/۰۶/۲۳";

  return (
    <main dir="rtl" className="flex flex-col items-center w-full">
      {/* ================= HERO ================= */}
      <section className="relative w-full max-w-7xl px-6 pt-32 pb-16 sm:px-8 md:pb-20">
        <ScrollReveal direction="bottom" distance={50} duration={1.1}>
          <div className="max-w-3xl">
            <p className="mb-5 text-sm text-muted-foreground md:text-base">
              حقوقی
            </p>

            <h1 className="text-5xl font-medium leading-[1.05] tracking-tight text-secondary sm:text-6xl md:text-7xl">
              حریم خصوصی
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-[1.5] text-muted-foreground md:text-xl">
              این سند توضیح می‌دهد چه اطلاعاتی از شما دریافت می‌کنیم، چرا آن‌ها
              را نگه می‌داریم و چگونه از آن‌ها محافظت می‌کنیم.
            </p>

            <p className="mt-6 text-xs text-muted-foreground md:text-sm">
              آخرین به‌روزرسانی: {lastUpdated}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ================= BODY ================= */}
      <section className="w-full max-w-7xl px-6 pb-24 sm:px-8 md:pb-32">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* sticky index */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-32">
              <div className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                فهرست
              </div>

              <nav className="relative">
                <div className="absolute inset-y-0 right-0 w-px bg-foreground/10" />

                <ul className="flex flex-col gap-0.5">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group relative block rounded-l-md py-2 pl-3 pr-4 text-sm leading-6 text-foreground/60 transition-colors hover:bg-foreground/[0.03] hover:text-foreground"
                      >
                        <span className="absolute right-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-md bg-transparent transition-all duration-200 group-hover:h-[30%] group-hover:bg-foreground/20" />
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* content */}
          <article className="min-w-0 flex-1 max-w-3xl">
            {sections.map((s, i) => (
              <ScrollReveal
                key={s.id}
                direction="bottom"
                distance={30}
                delay={i * 0.04}
              >
                <div
                  id={s.id}
                  className="scroll-mt-32 border-b border-foreground/10 py-10 first:pt-0 last:border-b-0"
                >
                  <h2 className="mb-5 text-2xl font-medium tracking-tight md:text-3xl">
                    {s.title}
                  </h2>

                  <div className="space-y-4">
                    {s.body.map((p, j) => (
                      <p
                        key={j}
                        className="text-base leading-[1.8] text-muted-foreground md:text-lg md:leading-[1.9]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {/* contact note */}
            <ScrollReveal direction="bottom" distance={30} delay={0.1}>
              <div className="mt-12 rounded-2xl border border-foreground/10 bg-muted/40 p-7 md:p-9">
                <h3 className="mb-3 text-lg font-medium md:text-xl">
                  سوالی درباره‌ی حریم خصوصی دارید؟
                </h3>
                <p className="mb-6 text-sm leading-[1.7] text-muted-foreground md:text-base">
                  اگر درباره‌ی این سیاست یا نحوه‌ی نگهداری اطلاعات خود سوالی
                  دارید، از طریق صفحه تماس با ما در ارتباط باشید.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-secondary px-7 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  تماس با ما
                </Link>
              </div>
            </ScrollReveal>
          </article>
        </div>
      </section>
    </main>
  );
}