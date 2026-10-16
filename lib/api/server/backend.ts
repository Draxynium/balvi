import "server-only";

const SHOP_API_URL = (
  process.env.SHOP_API_URL ?? "https://195.254.165.41"
).replace(/\/$/, "");
const DEFAULT_TIMEOUT_MS = 15_000;

export function backendUrl(path: string) {
  return `${SHOP_API_URL}/${path.replace(/^\//, "")}`;
}

export function backendFetch(
  path: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  return fetch(backendUrl(path), {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(timeoutMs),
  });
}
