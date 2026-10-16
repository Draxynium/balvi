import { resolveApiAssetUrl } from "@/lib/api/config";

export function formatRialsAsTomans(value: number) {
  return `${Math.round(value / 10).toLocaleString("fa-IR")} تومان`;
}

export function resolveCartImage(path: string | null) {
  return resolveApiAssetUrl(path) ?? "/images/boot.png";
}
