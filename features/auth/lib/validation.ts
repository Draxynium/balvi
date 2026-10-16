const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));

export const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);

export function normalizeIranianMobile(value: string) {
  let phone = toEnglishDigits(value).replace(/[\s\-()]/g, "");

  if (phone.startsWith("0098")) phone = `0${phone.slice(4)}`;
  else if (phone.startsWith("+98")) phone = `0${phone.slice(3)}`;
  else if (phone.startsWith("98")) phone = `0${phone.slice(2)}`;
  else if (phone.startsWith("9")) phone = `0${phone}`;

  return phone;
}

export const isIranianMobile = (value: string) =>
  /^09\d{9}$/.test(normalizeIranianMobile(value));

export const isStrongEnoughPassword = (value: string) => value.length >= 8;
