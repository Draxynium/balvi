"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

export default function ContactUsPage() {
  return (
    <main dir="rtl" className="w-full flex flex-col items-center">
      <section className="relative w-full max-w-7xl pt-32 pb-24 px-6 sm:px-8">
        <ScrollReveal direction="bottom" distance={50} duration={1.1}>
          <div className="max-w-3xl">
            <p className="text-sm md:text-base text-muted-foreground mb-5">
              ارتباط با بالوی
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] text-secondary">
              تماس با ما
            </h1>

            <p className="mt-7 max-w-xl text-lg md:text-xl leading-[1.5] text-muted-foreground">
              برای دریافت اطلاعات بیشتر، پیگیری سفارش یا هر سوالی که دارید،
              می‌توانید از طریق راه‌های ارتباطی زیر با ما در تماس باشید.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="w-full max-w-7xl px-6 sm:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="w-full lg:w-1/3">
            <ScrollReveal direction="right" distance={60}>
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-medium">
                    اطلاعات تماس
                  </h2>

                  <p className="mt-3 text-muted-foreground leading-[1.5]">
                    برای ارتباط مستقیم با ما از اطلاعات زیر استفاده کنید.
                  </p>
                </div>

                <div className="space-y-7">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-muted flex items-center justify-center text-secondary">
                      <Phone size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        شماره تماس
                      </p>
                      <p className="text-lg">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-muted flex items-center justify-center text-secondary">
                      <Mail size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        ایمیل
                      </p>
                      <p className="text-lg">info@balvi.ir</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-muted flex items-center justify-center text-secondary">
                      <MapPin size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        آدرس
                      </p>
                      <p className="text-lg leading-[1.5]">
                        تهران، خیابان نمونه، پلاک ۱۲۳
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t">
                  <p className="text-sm text-muted-foreground">
                    ساعات پاسخگویی
                  </p>

                  <p className="mt-2 text-lg">
                    شنبه تا پنجشنبه، ۹ تا ۱۸
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="flex-1">
            <ScrollReveal direction="left" distance={60} delay={0.15}>
              <form className="w-full space-y-7">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full">
                    <label className="block text-sm mb-3">
                      نام و نام خانوادگی
                    </label>

                    <input
                      type="text"
                      placeholder="نام خود را وارد کنید"
                      className="w-full h-14 px-5 rounded-md bg-muted/60 outline-none border border-foreground/30 focus:border-foreground/20 transition-colors"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm mb-3">
                      شماره تماس
                    </label>

                    <input
                      type="tel"
                      placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                      className="w-full h-14 px-5 rounded-md bg-muted/60 outline-none border border-foreground/30 focus:border-foreground/20 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-3">
                    ایمیل
                  </label>

                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full h-14 px-5 rounded-md bg-muted/60 outline-none border border-foreground/30 focus:border-foreground/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-3">
                    موضوع پیام
                  </label>

                  <input
                    type="text"
                    placeholder="موضوع پیام را وارد کنید"
                    className="w-full h-14 px-5 rounded-md bg-muted/60 outline-none border border-foreground/30 focus:border-foreground/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-3">
                    پیام شما
                  </label>

                  <textarea
                    rows={7}
                    placeholder="پیام خود را بنویسید..."
                    className="w-full px-5 py-4 rounded-md bg-muted/60 outline-none border border-foreground/30 focus:border-foreground/20 transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="h-14 px-10 rounded-md bg-secondary text-background text-base font-medium hover:opacity-90 transition-opacity"
                  >
                    ارسال پیام
                  </button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}