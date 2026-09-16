export const productCategories = [
  "کلاسیک",
  "اسپورت",
  "راحتی",
  "بوت و نیم بوت",
  "دمپایی و صندل",
  "اداری",
  "روزمره"
] as const;

export type ProductCategory =
  (typeof productCategories)[number];