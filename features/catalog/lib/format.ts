export function formatProductPrice(priceInRials: number) {
  return `${Math.round(priceInRials / 10).toLocaleString("fa-IR")} تومان`;
}
