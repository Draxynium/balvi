"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { adminDeliveryApi } from "@/features/admin/delivery/api";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import {
  buildJalaliMonth,
  currentJalaliMonth,
  formatPersianDeliveryDate,
  jalaliMonthRange,
  moveJalaliMonth,
  persianMonthNames,
  persianWeekdays,
  todayIsoInTehran,
  type JalaliMonth,
} from "@/features/delivery/lib/persian-calendar";
import type {
  DeliveryScheduleDay,
  DeliveryTimeSlotInput,
} from "@/features/delivery/model/types";
import { cn } from "@/lib/utils";

const emptySlot = (): DeliveryTimeSlotInput => ({
  startTime: "09:00",
  endTime: "12:00",
  label: null,
});

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

function validateSlots(slots: DeliveryTimeSlotInput[]) {
  if (slots.length === 0) return "حداقل یک بازه زمانی وارد کنید.";
  if (slots.length > 12) return "برای هر روز حداکثر ۱۲ بازه زمانی مجاز است.";

  for (const [index, slot] of slots.entries()) {
    if (
      !/^\d{2}:\d{2}$/.test(slot.startTime) ||
      !/^\d{2}:\d{2}$/.test(slot.endTime)
    ) {
      return `ساعت بازه ${Number(index + 1).toLocaleString("fa-IR")} کامل نیست.`;
    }
    if (slot.endTime <= slot.startTime) {
      return `ساعت پایان بازه ${Number(index + 1).toLocaleString("fa-IR")} باید بعد از ساعت شروع آن باشد.`;
    }
    if ((slot.label?.trim().length ?? 0) > 100) {
      return `عنوان بازه ${Number(index + 1).toLocaleString("fa-IR")} نباید بیشتر از ۱۰۰ نویسه باشد.`;
    }
  }

  const ordered = slots
    .map((slot, index) => ({ ...slot, index }))
    .sort((left, right) => left.startTime.localeCompare(right.startTime));
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const current = ordered[index];
    const next = ordered[index + 1];
    if (current.endTime > next.startTime) {
      return `بازه‌های ${Number(current.index + 1).toLocaleString("fa-IR")} و ${Number(next.index + 1).toLocaleString("fa-IR")} با یکدیگر تداخل دارند.`;
    }
  }
  return "";
}

const hourOptions = Array.from({ length: 24 }, (_, value) =>
  String(value).padStart(2, "0"),
);
const minuteOptions = Array.from({ length: 60 }, (_, value) =>
  String(value).padStart(2, "0"),
);

export function DeliveryScheduleManager() {
  const [month, setMonth] = useState<JalaliMonth>(currentJalaliMonth);
  const [days, setDays] = useState<DeliveryScheduleDay[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<DeliveryTimeSlotInput[]>([emptySlot()]);
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const range = useMemo(() => jalaliMonthRange(month), [month]);
  const calendar = useMemo(() => buildJalaliMonth(month), [month]);
  const configuredByDate = useMemo(
    () => new Map(days.map((day) => [day.date, day])),
    [days],
  );
  const today = todayIsoInTehran();

  const refreshMonth = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await adminDeliveryApi.listDays(range.from, range.to);
      setDays(result);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "تقویم ارسال"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    adminDeliveryApi
      .listDays(range.from, range.to)
      .then((result) => {
        if (active) setDays(result);
      })
      .catch((reason) => {
        if (active) setError(getAdminApiErrorMessage(reason, "تقویم ارسال"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [range.from, range.to]);

  const selectDate = (date: string) => {
    if (date < today) return;
    setSelectedDate(date);
    const configured = configuredByDate.get(date);
    setSlots(
      configured
        ? configured.timeSlots.map((slot) => ({
            startTime: normalizeTime(slot.startTime),
            endTime: normalizeTime(slot.endTime),
            label: slot.label,
          }))
        : [emptySlot()],
    );
    setError("");
    setSuccess("");
  };

  const changeSlot = (
    index: number,
    key: keyof DeliveryTimeSlotInput,
    value: string,
  ) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index
          ? { ...slot, [key]: key === "label" ? value || null : value }
          : slot,
      ),
    );
  };

  const saveDay = async () => {
    if (!selectedDate) return;
    const validationError = validateSlots(slots);
    if (validationError) {
      setSuccess("");
      setError(validationError);
      return;
    }
    setSavingDay(true);
    setError("");
    setSuccess("");
    try {
      await adminDeliveryApi.upsertDay(selectedDate, slots);
      await refreshMonth();
      setSuccess("روز و بازه‌های تحویل ذخیره شد.");
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "روز ارسال"));
    } finally {
      setSavingDay(false);
    }
  };

  const removeDay = async () => {
    if (!selectedDate || !configuredByDate.has(selectedDate)) return;
    if (!window.confirm("این روز از انتخاب‌های ارسال مشتری حذف شود؟")) return;
    setSavingDay(true);
    setError("");
    setSuccess("");
    try {
      await adminDeliveryApi.deleteDay(selectedDate);
      setSelectedDate("");
      setSlots([emptySlot()]);
      await refreshMonth();
      setSuccess("روز انتخاب‌شده از تقویم ارسال حذف شد.");
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "روز ارسال"));
    } finally {
      setSavingDay(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#d7a66c]/20">
            <CalendarDays className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">تقویم ارسال</h1>
            <p className="mt-1 text-sm text-[#173f37]/55">
              روزهای کاری و چند بازه زمانی تحویل را به تقویم اضافه کنید.
            </p>
          </div>
        </div>
      </header>

      {(error || success) && (
        <div
          className={cn(
            "rounded-2xl border px-5 py-4 text-sm",
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700",
          )}
        >
          {error || success}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)]">
        <section className="rounded-[2rem] border border-[#173f37]/10 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((value) => moveJalaliMonth(value, -1))}
              className="grid size-10 place-items-center rounded-xl border border-[#173f37]/10"
              aria-label="ماه قبل"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="text-center">
              <h2 className="font-bold">
                {persianMonthNames[month.month - 1]}{" "}
                {month.year.toLocaleString("fa-IR", {
                  useGrouping: false,
                })}
              </h2>
              <p className="mt-1 text-[11px] text-[#173f37]/45">
                نقطه طلایی یعنی روز فعال ارسال
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMonth((value) => moveJalaliMonth(value, 1))}
              className="grid size-10 place-items-center rounded-xl border border-[#173f37]/10"
              aria-label="ماه بعد"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#173f37]/45 sm:gap-2">
            {persianWeekdays.map((weekday) => (
              <div key={weekday} className="py-2">
                {weekday}
              </div>
            ))}
            {Array.from({ length: calendar.leadingEmptyCells }, (_, index) => (
              <span key={"empty-" + index} />
            ))}
            {calendar.days.map((cell) => {
              const configured = configuredByDate.has(cell.isoDate);
              const selected = selectedDate === cell.isoDate;
              const past = cell.isoDate < today;
              return (
                <button
                  key={cell.isoDate}
                  type="button"
                  disabled={past}
                  onClick={() => selectDate(cell.isoDate)}
                  className={cn(
                    "relative aspect-square min-h-11 rounded-xl border text-sm transition sm:min-h-16",
                    selected
                      ? "border-[#173f37] bg-[#173f37] text-white"
                      : configured
                        ? "border-[#d7a66c]/55 bg-[#d7a66c]/10"
                        : "border-[#173f37]/8 hover:border-[#173f37]/30",
                    past && "cursor-not-allowed bg-[#173f37]/[.025] opacity-35",
                  )}
                >
                  {cell.day.toLocaleString("fa-IR")}
                  {configured && (
                    <span
                      className={cn(
                        "absolute bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full",
                        selected ? "bg-[#d7a66c]" : "bg-[#b77d37]",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#173f37]/50">
              <LoaderCircle className="size-4 animate-spin" />
              در حال دریافت روزهای این ماه…
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-[#173f37]/10 bg-white p-5 shadow-sm sm:p-7">
          {!selectedDate ? (
            <div className="grid min-h-80 place-items-center text-center">
              <div>
                <CalendarDays className="mx-auto size-10 text-[#d7a66c]" />
                <h2 className="mt-4 font-bold">یک روز را انتخاب کنید</h2>
                <p className="mt-2 text-xs leading-6 text-[#173f37]/50">
                  روز انتخاب‌شده فقط بعد از ذخیره برای مشتری قابل مشاهده است.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[#173f37]/45">روز انتخاب‌شده</p>
                  <h2 className="mt-1 font-bold">
                    {formatPersianDeliveryDate(selectedDate)}
                  </h2>
                </div>
                {configuredByDate.has(selectedDate) && (
                  <button
                    type="button"
                    onClick={() => void removeDay()}
                    disabled={savingDay}
                    className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-600"
                    aria-label="حذف روز"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#173f37]/10 bg-[#faf9f6] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold">
                        <Clock3 className="size-4" />
                        بازه {Number(index + 1).toLocaleString("fa-IR")}
                      </span>
                      {slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setSlots((current) =>
                              current.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            )
                          }
                          className="text-red-600"
                          aria-label="حذف بازه"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-[11px] text-[#173f37]/55">
                        از ساعت
                        <TimePicker24
                          value={slot.startTime}
                          onChange={(event) =>
                            changeSlot(index, "startTime", event)
                          }
                          ariaLabel={`ساعت شروع بازه ${index + 1}`}
                        />
                      </label>
                      <label className="text-[11px] text-[#173f37]/55">
                        تا ساعت
                        <TimePicker24
                          value={slot.endTime}
                          onChange={(event) =>
                            changeSlot(index, "endTime", event)
                          }
                          ariaLabel={`ساعت پایان بازه ${index + 1}`}
                        />
                      </label>
                    </div>
                    <label className="mt-3 block text-[11px] text-[#173f37]/55">
                      عنوان اختیاری
                      <input
                        value={slot.label ?? ""}
                        maxLength={100}
                        onChange={(event) =>
                          changeSlot(index, "label", event.target.value)
                        }
                        placeholder="مثلاً ارسال صبح"
                        className="admin-input mt-1"
                      />
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSlots((current) => [...current, emptySlot()])}
                disabled={slots.length >= 12}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#173f37]/25 text-sm disabled:opacity-40"
              >
                <Plus className="size-4" />
                افزودن بازه دیگر
              </button>
              <button
                type="button"
                onClick={() => void saveDay()}
                disabled={savingDay || slots.length === 0}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173f37] text-sm font-semibold text-white disabled:opacity-50"
              >
                {savingDay ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                ذخیره این روز
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TimePicker24({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const [hour = "00", minute = "00"] = value.split(":");
  const formatPart = (part: string) =>
    Number(part).toLocaleString("fa-IR", { minimumIntegerDigits: 2 });

  return (
    <div className="mt-1 flex items-center gap-1" dir="ltr">
      <select
        value={hour}
        onChange={(event) => onChange(event.target.value + ":" + minute)}
        aria-label={ariaLabel + "؛ ساعت"}
        className="admin-input px-2 text-center"
      >
        {hourOptions.map((option) => (
          <option key={option} value={option}>
            {formatPart(option)}
          </option>
        ))}
      </select>
      <span className="font-semibold">:</span>
      <select
        value={minute}
        onChange={(event) => onChange(hour + ":" + event.target.value)}
        aria-label={ariaLabel + "؛ دقیقه"}
        className="admin-input px-2 text-center"
      >
        {minuteOptions.map((option) => (
          <option key={option} value={option}>
            {formatPart(option)}
          </option>
        ))}
      </select>
    </div>
  );
}
