"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "cn";
import { authApi, getAuthErrorMessage } from "@/features/auth/api/auth-api";
import { OtpInput } from "@/features/auth/components/otp-input";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  isIranianMobile,
  isStrongEnoughPassword,
  normalizeIranianMobile,
  toPersianDigits,
} from "@/features/auth/lib/validation";

type AuthView =
  | "login"
  | "signup-phone"
  | "signup-otp"
  | "signup-password"
  | "forgot-phone"
  | "forgot-otp"
  | "forgot-reset"
  | "success";

type VerificationPurpose = "signup" | "forgot";
type SuccessKind = "authenticated" | "password-reset";

type AuthDialogProps = {
  open: boolean;
  onClose: () => void;
};

const OTP_LENGTH = 6;
const emptyOtp = () => Array<string>(OTP_LENGTH).fill("");

const fieldClass =
  "h-14 w-full rounded-2xl border border-border/40 bg-background/60 px-4 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/5 disabled:cursor-not-allowed disabled:opacity-50";
const submitClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { user, status, login, completeRegistration, logout } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [challengeId, setChallengeId] = useState("");
  const [completionToken, setCompletionToken] = useState("");
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successKind, setSuccessKind] = useState<SuccessKind>("authenticated");
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || user || status === "loading") return;
    const timeout = window.setTimeout(
      () => phoneInputRef.current?.focus(),
      100,
    );
    return () => window.clearTimeout(timeout);
  }, [open, status, user, view]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, submitting]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timeout = window.setTimeout(
      () => setResendTimer((value) => value - 1),
      1000,
    );
    return () => window.clearTimeout(timeout);
  }, [resendTimer]);

  if (!open) return null;

  const goTo = (nextView: AuthView) => {
    setError("");
    setView(nextView);
  };

  const validatePhone = () => {
    if (isIranianMobile(phone)) return normalizeIranianMobile(phone);
    setError("شماره موبایل معتبر ایران وارد کنید.");
    return null;
  };

  const requestCode = async (purpose: VerificationPurpose) => {
    const normalizedPhone = validatePhone();
    if (!normalizedPhone) return;

    setSubmitting(true);
    setError("");
    try {
      const result =
        purpose === "signup"
          ? await authApi.requestRegistrationCode(normalizedPhone)
          : await authApi.requestPasswordResetCode(normalizedPhone);

      setPhone(result.phoneNumber || normalizedPhone);
      setChallengeId(result.challengeId);
      setDevelopmentCode(result.developmentCode);
      setOtp(emptyOtp());
      setResendTimer(Math.max(0, result.retryAfterSeconds));
      setView(purpose === "signup" ? "signup-otp" : "forgot-otp");
    } catch (reason) {
      setError(getAuthErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedPhone = validatePhone();
    if (!normalizedPhone) return;
    if (!isStrongEnoughPassword(password)) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await login(normalizedPhone, password);
      setSuccessKind("authenticated");
      setView("success");
    } catch (reason) {
      setError(getAuthErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneSubmit =
    (purpose: VerificationPurpose) => async (event: React.FormEvent) => {
      event.preventDefault();
      await requestCode(purpose);
    };

  const handleOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = otp.join("");
    if (!challengeId || code.length !== OTP_LENGTH) {
      setError("کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result =
        view === "signup-otp"
          ? await authApi.verifyRegistrationCode(challengeId, code)
          : await authApi.verifyPasswordResetCode(challengeId, code);
      setCompletionToken(result.completionToken);
      setPassword("");
      setConfirmPassword("");
      setView(view === "signup-otp" ? "signup-password" : "forgot-reset");
    } catch (reason) {
      setError(getAuthErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!completionToken) {
      setError("نشست تأیید معتبر نیست؛ دوباره کد تأیید بگیرید.");
      return;
    }
    if (!isStrongEnoughPassword(password)) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (view === "signup-password") {
        await completeRegistration(completionToken, password, confirmPassword);
        setSuccessKind("authenticated");
      } else {
        await authApi.resetPassword(completionToken, password, confirmPassword);
        setSuccessKind("password-reset");
      }
      setPassword("");
      setConfirmPassword("");
      setView("success");
    } catch (reason) {
      setError(getAuthErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || submitting) return;
    await requestCode(view === "signup-otp" ? "signup" : "forgot");
  };

  const handleLogout = async () => {
    setSubmitting(true);
    setError("");
    try {
      await logout();
      setView("login");
    } catch (reason) {
      setError(getAuthErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const authCopy: Record<
    Exclude<AuthView, "success">,
    { title: string; subtitle: string }
  > = {
    login: {
      title: "ورود به حساب کاربری",
      subtitle: "شماره تماس و رمز عبور خود را وارد کنید.",
    },
    "signup-phone": {
      title: "ساخت حساب کاربری",
      subtitle: "شماره تماس خود را وارد کنید تا کد تأیید برایتان ارسال شود.",
    },
    "signup-otp": {
      title: "کد تأیید ثبت‌نام",
      subtitle: `کد ۶ رقمی ارسال‌شده به ${toPersianDigits(phone)} را وارد کنید.`,
    },
    "signup-password": {
      title: "انتخاب رمز عبور",
      subtitle: "یک رمز عبور امن با حداقل ۸ کاراکتر انتخاب کنید.",
    },
    "forgot-phone": {
      title: "بازیابی رمز عبور",
      subtitle: "شماره موبایل حساب خود را وارد کنید.",
    },
    "forgot-otp": {
      title: "تأیید شماره موبایل",
      subtitle: `کد ۶ رقمی ارسال‌شده به ${toPersianDigits(phone)} را وارد کنید.`,
    },
    "forgot-reset": {
      title: "رمز عبور جدید",
      subtitle: "رمز عبور جدید خود را وارد و تأیید کنید.",
    },
  };

  const isOtpView = view === "signup-otp" || view === "forgot-otp";
  const showAuthForms = status !== "loading" && !user && view !== "success";

  return (
    <div
      className="bg-background/40 fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md duration-200">
        <div
          className="border-border/40 bg-background/90 relative rounded-3xl border p-7 shadow-2xl backdrop-blur-xl"
          dir="rtl"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="بستن پنجره"
            className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 left-4 rounded-md p-2 transition-colors disabled:opacity-40"
          >
            <X size={20} />
          </button>

          {status === "loading" && (
            <div className="text-muted-foreground flex min-h-52 flex-col items-center justify-center gap-3">
              <LoaderCircle className="animate-spin" size={28} />
              <p className="text-sm">در حال بررسی حساب کاربری…</p>
            </div>
          )}

          {view === "success" && status !== "loading" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="bg-primary/10 text-primary mb-5 flex h-16 w-16 items-center justify-center rounded-full">
                <Check size={32} strokeWidth={2.2} />
              </div>
              <h2 id="auth-dialog-title" className="text-xl font-semibold">
                {successKind === "authenticated"
                  ? "خوش آمدید!"
                  : "رمز عبور تغییر کرد"}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {successKind === "authenticated"
                  ? "ورود شما با موفقیت انجام شد."
                  : "اکنون می‌توانید با رمز عبور جدید وارد شوید."}
              </p>
              <button
                type="button"
                onClick={
                  successKind === "authenticated"
                    ? onClose
                    : () => goTo("login")
                }
                className={cn("mt-7", submitClass)}
              >
                {successKind === "authenticated" ? "ادامه" : "ورود به حساب"}
              </button>
            </div>
          )}

          {user && view !== "success" && status !== "loading" && (
            <div className="flex flex-col items-center py-5 text-center">
              <div className="bg-primary/10 text-primary mb-5 flex h-16 w-16 items-center justify-center rounded-full">
                <ShieldCheck size={32} />
              </div>
              <h2 id="auth-dialog-title" className="text-xl font-semibold">
                حساب کاربری
              </h2>
              <p className="mt-3 text-lg font-medium" dir="ltr">
                {toPersianDigits(user.phoneNumber)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {user.role?.toLowerCase() === "admin"
                  ? "مدیر فروشگاه"
                  : "مشتری بالوی"}
              </p>
              {error && (
                <p className="text-destructive mt-4 text-xs">{error}</p>
              )}
              <button
                type="button"
                onClick={handleLogout}
                disabled={submitting}
                className="border-destructive/25 text-destructive hover:bg-destructive/5 mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  <LogOut size={17} />
                )}
                خروج از حساب
              </button>
            </div>
          )}

          {showAuthForms && (
            <>
              <header className="mb-6 pl-10">
                <h2 id="auth-dialog-title" className="text-xl font-semibold">
                  {authCopy[view].title}
                </h2>
                <p className="text-muted-foreground mt-1.5 text-sm leading-6">
                  {authCopy[view].subtitle}
                </p>
              </header>

              {view === "login" && (
                <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    ref={phoneInputRef}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                    aria-label="شماره موبایل"
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    disabled={submitting}
                    className={cn(fieldClass, "text-left")}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="رمز عبور"
                    aria-label="رمز عبور"
                    autoComplete="current-password"
                    disabled={submitting}
                    className={cn(fieldClass, "text-right")}
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => goTo("forgot-phone")}
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    >
                      فراموشی رمز عبور
                    </button>
                  </div>
                  <AuthError message={error} />
                  <SubmitButton loading={submitting}>ورود</SubmitButton>
                  <p className="text-muted-foreground pt-2 text-center text-xs">
                    حساب کاربری ندارید؟{" "}
                    <button
                      type="button"
                      onClick={() => goTo("signup-phone")}
                      className="text-foreground hover:text-primary font-medium transition-colors"
                    >
                      ثبت‌نام کنید
                    </button>
                  </p>
                </form>
              )}

              {(view === "signup-phone" || view === "forgot-phone") && (
                <form
                  onSubmit={handlePhoneSubmit(
                    view === "signup-phone" ? "signup" : "forgot",
                  )}
                  className="space-y-3"
                >
                  <input
                    ref={phoneInputRef}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                    aria-label="شماره موبایل"
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    disabled={submitting}
                    className={cn(fieldClass, "text-left")}
                  />
                  <AuthError message={error} />
                  <SubmitButton loading={submitting}>
                    دریافت کد تأیید
                  </SubmitButton>
                  <BackButton
                    onClick={() => goTo("login")}
                    label="بازگشت به ورود"
                  />
                </form>
              )}

              {isOtpView && (
                <form onSubmit={handleOtp} className="space-y-5">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    disabled={submitting}
                  />
                  {developmentCode && (
                    <p className="bg-primary/10 text-primary rounded-xl px-3 py-2 text-center text-xs">
                      کد محیط توسعه: {toPersianDigits(developmentCode)}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      disabled={resendTimer > 0 || submitting}
                      onClick={handleResend}
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resendTimer > 0
                        ? `ارسال مجدد تا ${toPersianDigits(Math.floor(resendTimer / 60))}:${toPersianDigits(String(resendTimer % 60).padStart(2, "0"))}`
                        : "ارسال مجدد کد"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        goTo(
                          view === "signup-otp"
                            ? "signup-phone"
                            : "forgot-phone",
                        )
                      }
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                    >
                      <ArrowRight size={14} />
                      ویرایش شماره
                    </button>
                  </div>
                  <AuthError message={error} />
                  <SubmitButton loading={submitting}>تأیید کد</SubmitButton>
                </form>
              )}

              {(view === "signup-password" || view === "forgot-reset") && (
                <form onSubmit={handlePassword} className="space-y-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="رمز عبور (حداقل ۸ کاراکتر)"
                    aria-label="رمز عبور جدید"
                    autoComplete="new-password"
                    disabled={submitting}
                    className={cn(fieldClass, "text-right")}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="تکرار رمز عبور"
                    aria-label="تکرار رمز عبور"
                    autoComplete="new-password"
                    disabled={submitting}
                    className={cn(fieldClass, "text-right")}
                  />
                  <AuthError message={error} />
                  <SubmitButton loading={submitting}>
                    {view === "signup-password"
                      ? "تکمیل ثبت‌نام"
                      : "تغییر رمز عبور"}
                  </SubmitButton>
                  <BackButton
                    onClick={() =>
                      goTo(
                        view === "signup-password" ? "signup-phone" : "login",
                      )
                    }
                    label="بازگشت"
                  />
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-destructive text-xs leading-5">
      {message}
    </p>
  );
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button type="submit" disabled={loading} className={submitClass}>
      {loading && <LoaderCircle className="animate-spin" size={18} />}
      {children}
    </button>
  );
}

function BackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <p className="text-muted-foreground pt-2 text-center text-xs">
      <button
        type="button"
        onClick={onClick}
        className="text-foreground hover:text-primary font-medium transition-colors"
      >
        {label}
      </button>
    </p>
  );
}
