import { jalaaliMonthLength, toGregorian, toJalaali } from "jalaali-js";

export type JalaliMonth = { year: number; month: number };

export type JalaliCalendarCell = {
  day: number;
  isoDate: string;
};

export const persianMonthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const persianWeekdays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function gregorianToIso(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function currentJalaliMonth(): JalaliMonth {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const jalali = toJalaali(value("year"), value("month"), value("day"));
  return { year: jalali.jy, month: jalali.jm };
}

export function todayIsoInTehran() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function moveJalaliMonth(
  value: JalaliMonth,
  amount: number,
): JalaliMonth {
  const absoluteMonth = value.year * 12 + value.month - 1 + amount;
  return {
    year: Math.floor(absoluteMonth / 12),
    month: (absoluteMonth % 12) + 1,
  };
}

export function buildJalaliMonth(value: JalaliMonth) {
  const first = toGregorian(value.year, value.month, 1);
  const firstWeekday = new Date(
    Date.UTC(first.gy, first.gm - 1, first.gd),
  ).getUTCDay();
  const leadingEmptyCells = (firstWeekday + 1) % 7;
  const days: JalaliCalendarCell[] = [];
  const count = jalaaliMonthLength(value.year, value.month);
  for (let day = 1; day <= count; day += 1) {
    const gregorian = toGregorian(value.year, value.month, day);
    days.push({
      day,
      isoDate: gregorianToIso(gregorian.gy, gregorian.gm, gregorian.gd),
    });
  }
  return { leadingEmptyCells, days };
}

export function jalaliMonthRange(value: JalaliMonth) {
  const first = toGregorian(value.year, value.month, 1);
  const last = toGregorian(
    value.year,
    value.month,
    jalaaliMonthLength(value.year, value.month),
  );
  return {
    from: gregorianToIso(first.gy, first.gm, first.gd),
    to: gregorianToIso(last.gy, last.gm, last.gd),
  };
}

export function formatPersianDeliveryDate(isoDate: string) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

export function formatDeliveryTime(value: string) {
  const [hour = "0", minute = "0"] = value.split(":");
  return `${Number(hour).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}:${Number(minute).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}`;
}
