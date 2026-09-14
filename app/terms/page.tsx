import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "قوانین و مقررات | بالوی",
  description:
    "شرایط و قوانین استفاده از وب‌سایت بالوی، شامل سفارش، پرداخت، ارسال، مرجوعی و مسئولیت‌ها.",
};

const sections = [
  {
    id: "intro",
    title: "مقدمه",
    body: [
      "استفاده از وب‌سایت بالوی به معنای پذیرش کامل قوانین و مقرراتی است که در این صفحه آمده. لطفاً پیش از ثبت سفارش، این سند را با دقت مطالعه کنید.",
      "این شرایط ممکن است در طول زمان به‌روزرسانی شود. آخرین نسخه همیشه در همین صفحه در دسترس است و تاریخ به‌روزرسانی در بالای صفحه درج می‌شود.",
    ],
  },
  {
    id: "account",
    title: "حساب کاربری",
    body: [
      "برای ثبت سفارش، ممکن است نیاز به ایجاد حساب کاربری داشته باشید. اطلاعاتی که وارد می‌کنید باید دقیق و به‌روز باشد.",
      "شما مسئول حفظ امنیت رمز عبور و فعالیت‌هایی هستید که از طریق حساب کاربری شما انجام می‌شود.",
      "در صورت مشاهده‌ی هرگونه استفاده‌ی غیرمجاز از حساب خود، لطفاً بلافاصله با ما تماس بگیرید.",
    ],
  },
  {
    id: "orders",
    title: "ثبت سفارش و تأیید",
    body: [
      "همه‌ی سفارش‌ها پس از ثبت، توسط تیم ما بررسی و تأیید می‌شوند. در صورت موجود نبودن محصول یا مغایرت در قیمت، سفارش لغو و مبلغ پرداختی بازگردانده می‌شود.",
      "بالوی حق دارد سفارش‌هایی که به‌نظر مشکوک یا مغایر با قوانین باشند را بدون توضیح لغو کند.",
      "تصاویر محصولات با دقت تهیه شده‌اند، اما ممکن است رنگ واقعی محصول بسته به نمایشگر شما کمی متفاوت به نظر برسد.",
    ],
  },
  {
    id: "pricing",
    title: "قیمت‌ها و پرداخت",
    body: [
      "تمام قیمت‌های سایت به تومان و شامل مالیات بر ارزش افزوده (در صورت اعمال) است.",
      "پرداخت از طریق درگاه‌های بانکی معتبر انجام می‌شود. بالوی به هیچ عنوان اطلاعات کارت بانکی شما را ذخیره نمی‌کند.",
      "در فروش عمده، شرایط پرداخت شامل پیش‌پرداخت و مانده هنگام تحویل است؛ جزئیات در صفحه‌ی فروش عمده آمده است.",
    ],
  },
  {
    id: "shipping",
    title: "ارسال و تحویل",
    body: [
      "سفارش‌ها پس از آماده‌سازی، توسط پست پیشتاز یا تیپاکس به سراسر کشور ارسال می‌شوند.",
      "زمان تحویل بسته به مقصد متفاوت است؛ معمولاً بین ۲ تا ۵ روز کاری.",
      "در صورت بروز تأخیر ناشی از عوامل خارج از کنترل ما (حوادث، شرایط جوی، اختلال در شبکه‌ی پستی)، بالوی مسئولیتی نمی‌پذیرد اما پیگیری می‌کند.",
    ],
  },
  {
    id: "returns",
    title: "مرجوعی و گارانتی",
    body: [
      "در صورت وجود ایراد تولیدی یا مغایرت با سفارش، تا ۷ روز پس از دریافت می‌توانید درخواست مرجوعی ثبت کنید.",
      "محصول باید در بسته‌بندی اصلی، استفاده‌نشده و بدون آسیب باشد.",
      "هزینه‌ی ارسال مرجوعی در صورت ایراد تولیدی، بر عهده‌ی بالوی است؛ در غیر این صورت بر عهده‌ی خریدار.",
      "محصولات سفارشی‌سازی‌شده (با لوگو یا ابعاد خاص) قابل مرجوع کردن نیستند.",
    ],
  },
  {
    id: "ip",
    title: "مالکیت معنوی",
    body: [
      "تمام محتوای این سایت، شامل متن‌ها، تصاویر، ویدیوها، لوگو و طرح‌ها، متعلق به بالوی است و تحت قوانین مالکیت معنوی ایران محافظت می‌شود.",
      "استفاده‌ی تجاری از این محتوا بدون اجازه‌ی کتبی، ممنوع است.",
    ],
  },
  {
    id: "liability",
    title: "محدودیت مسئولیت",
    body: [
      "بالوی نهایت تلاش خود را برای دقت اطلاعات سایت می‌کند، اما تضمینی نسبت به بدون‌نقص بودن آن‌ها نمی‌دهد.",
      "مسئولیت بالوی در قبال هر سفارش، حداکثر تا مبلغ پرداختی همان سفارش است.",
      "بالوی مسئول خسارات غیرمستقیم یا از دست رفتن فرصت‌های تجاری ناشی از استفاده از سایت نیست.",
    ],
  },
  {
    id: "law",
    title: "قانون حاکم",
    body: [
      "این قوانین تابع قوانین جمهوری اسلامی ایران است.",
      "در صورت بروز هرگونه اختلاف، ابتدا از طریق گفت‌وگو تلاش می‌شود موضوع حل شود؛ در غیر این صورت مراجع قانونی صالح، تصمیم‌گیرنده خواهند بود.",
    ],
  },
  {
    id: "changes",
    title: "تغییرات در قوانین",
    body: [
      "بالوی حق دارد در هر زمان این قوانین را به‌روزرسانی کند. ادامه‌ی استفاده از سایت پس از اعمال تغییرات، به معنای پذیرش نسخه‌ی جدید است.",
      "تغییرات مهم از طریق همین صفحه یا ایمیل به کاربران اطلاع داده می‌شود.",
    ],
  },
];

export default function TermsPage() {
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
              قوانین و مقررات
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-[1.5] text-muted-foreground md:text-xl">
              شرایط استفاده از وب‌سایت بالوی، از ثبت سفارش و پرداخت تا ارسال،
              مرجوعی و مسئولیت‌ها.
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
                        <span className="absolute right-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-full bg-transparent transition-all duration-200 group-hover:h-[30%] group-hover:bg-foreground/20" />
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

            {/* related links */}
            <ScrollReveal direction="bottom" distance={30} delay={0.1}>
              <div className="mt-12 rounded-2xl border border-foreground/10 bg-muted/40 p-7 md:p-9">
                <h3 className="mb-3 text-lg font-medium md:text-xl">
                  سوالی درباره‌ی این قوانین دارید؟
                </h3>
                <p className="mb-6 text-sm leading-[1.7] text-muted-foreground md:text-base">
                  برای پیگیری سفارش، درخواست همکاری یا هر سوال دیگری، از طریق
                  صفحه تماس با ما در ارتباط باشید. همچنین پیشنهاد می‌کنیم
                  سیاست حریم خصوصی را هم مطالعه کنید.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-secondary px-7 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    تماس با ما
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/20 px-7 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                  >
                    حریم خصوصی
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </article>
        </div>
      </section>
    </main>
  );
}