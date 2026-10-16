export const PUBLIC_SHOP_API_URL = (
  process.env.NEXT_PUBLIC_SHOP_API_URL ?? "https://195.254.165.41"
).replace(/\/$/, "");

export function resolveApiAssetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${PUBLIC_SHOP_API_URL}/${path.replace(/^\//, "")}`;
}
