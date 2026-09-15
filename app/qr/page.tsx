'use client';

import { useEffect, useState } from 'react';
import { Vazirmatn } from 'next/font/google';
import QRCode from 'qrcode';

const vazirmatn = Vazirmatn({ subsets: ['arabic'], display: 'swap' });

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

const ERROR_LEVELS: { value: ErrorLevel; label: string }[] = [
  { value: 'L', label: 'L · کم (۷٪)' },
  { value: 'M', label: 'M · متوسط (۱۵٪)' },
  { value: 'Q', label: 'Q · بالا (۲۵٪)' },
  { value: 'H', label: 'H · خیلی بالا (۳۰٪)' },
];

/** تبدیل ارقام لاتین به فارسی */
const toFa = (value: number | string) =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export default function QrCodeMakerPage() {
  // ورودی
  const [text, setText] = useState('https://example.com');

  // تنظیمات
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [level, setLevel] = useState<ErrorLevel>('M');
  const [dark, setDark] = useState('#000000');
  const [light, setLight] = useState('#ffffff');
  const [transparent, setTransparent] = useState(false);

  // خروجی
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ساخت کد QR هنگام تغییر هر گزینه
  useEffect(() => {
    let cancelled = false;

    const value = text.trim();
    if (!value) {
      setDataUrl('');
      setError('');
      return;
    }

    QRCode.toDataURL(value, {
      width: size,
      margin,
      errorCorrectionLevel: level,
      color: {
        dark,
        light: transparent ? '#ffffff00' : light, // هگز ۸ رقمی = RGBA
      },
    })
      .then((url) => {
        if (cancelled) return;
        setDataUrl(url);
        setError('');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setDataUrl('');
        setError(err instanceof Error ? err.message : 'تولید کد QR ممکن نشد.');
      });

    return () => {
      cancelled = true;
    };
  }, [text, size, margin, level, dark, light, transparent]);

  const handleDownload = () => {
    if (!dataUrl) return;

    let fileName = 'qr-code.png';
    try {
      const { hostname } = new URL(text.trim());
      if (hostname) fileName = `qr-${hostname.replace(/[^a-z0-9]+/gi, '-')}.png`;
    } catch {
      // آدرس معتبر نیست — از نام پیشفرض استفاده میشود
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopy = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('مرورگر شما از کپی تصویر پشتیبانی نمیکند — از دکمهٔ دانلود استفاده کنید.');
    }
  };

  return (
    <section
      dir="rtl"
      lang="fa"
      className={`${vazirmatn.className} min-h-screen bg-background px-4 text-foreground py-24`}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">سازندهٔ کد QR</h1>
          <p className="mt-2 text-muted-foreground">
            هر لینکی را به یک کد QR قابل دانلود تبدیل کنید. همهچیز در مرورگر شما اجرا میشود —
            هیچ دادهای ارسال نمیشود.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* ---------------- تنظیمات ---------------- */}
          <section className="space-y-6 rounded-2xl border border-border bg-card p-6 text-card-foreground">
            <div>
              <label htmlFor="link" className="mb-1.5 block text-sm font-medium">
                لینک یا متن
              </label>
              <input
                id="link"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
                spellCheck={false}
                dir="ltr"
                className="w-full rounded-lg border border-border/30 bg-background px-3 py-2 text-start text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                برای اینکه گوشیها آن را بهعنوان لینک باز کنند،{' '}
                <code className="rounded bg-muted px-1" dir="ltr">
                  https://
                </code>{' '}
                را وارد کنید.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="size"
                  className="mb-1.5 flex items-center justify-between text-sm font-medium"
                >
                  <span>اندازه</span>
                  <span className="text-muted-foreground">{toFa(size)} پیکسل</span>
                </label>
                <input
                  id="size"
                  type="range"
                  min={128}
                  max={1024}
                  step={32}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="margin"
                  className="mb-1.5 flex items-center justify-between text-sm font-medium"
                >
                  <span>حاشیه</span>
                  <span className="text-muted-foreground">{toFa(margin)}</span>
                </label>
                <input
                  id="margin"
                  type="range"
                  min={0}
                  max={8}
                  step={1}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="level" className="mb-1.5 block text-sm font-medium">
                تصحیح خطا
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as ErrorLevel)}
                className="w-full rounded-lg border border-border/30 bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                {ERROR_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                سطح بالاتر در برابر آسیب مقاومتر است، اما کد را متراکمتر میکند.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dark" className="mb-1.5 block text-sm font-medium">
                  رنگ پیشزمینه
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="dark"
                    type="color"
                    value={dark}
                    onChange={(e) => setDark(e.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded border border-border/30 bg-background p-1"
                  />
                  <input
                    type="text"
                    value={dark}
                    onChange={(e) => setDark(e.target.value)}
                    spellCheck={false}
                    dir="ltr"
                    className="w-full rounded-lg border border-border/30 bg-background px-3 py-2 font-mono text-xs uppercase outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="light" className="mb-1.5 block text-sm font-medium">
                  رنگ پسزمینه
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="light"
                    type="color"
                    value={light}
                    disabled={transparent}
                    onChange={(e) => setLight(e.target.value)}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded border border-border/30 bg-background p-1 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  <input
                    type="text"
                    value={light}
                    disabled={transparent}
                    onChange={(e) => setLight(e.target.value)}
                    spellCheck={false}
                    dir="ltr"
                    className="w-full rounded-lg border border-border/30 bg-background px-3 py-2 font-mono text-xs uppercase outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              پسزمینهٔ شفاف
            </label>
          </section>

          {/* ---------------- پیشنمایش ---------------- */}
          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 text-card-foreground lg:sticky lg:top-10">
            <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-muted p-4">
              {error ? (
                <p className="px-2 text-center text-sm text-destructive">{error}</p>
              ) : dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dataUrl} alt="پیشنمایش کد QR" className="h-full w-full object-contain" />
              ) : (
                <p className="px-2 text-center text-sm text-muted-foreground">
                  برای دیدن کد QR، یک لینک وارد کنید
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!dataUrl}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              دانلود PNG
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!dataUrl}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? 'کپی شد!' : 'کپی تصویر'}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              خروجی با ابعاد {toFa(size)}×{toFa(size)} پیکسل
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}