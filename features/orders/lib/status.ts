export const orderStatusLabels: Record<string, string> = {
  PendingPayment: "در انتظار پرداخت",
  Paid: "پرداخت‌شده",
  Processing: "در حال پردازش",
  Shipped: "ارسال‌شده",
  Delivered: "تحویل‌داده‌شده",
  Cancelled: "لغوشده",
  PaymentFailed: "پرداخت ناموفق",
};

export function getOrderStatusLabel(status: string) {
  return orderStatusLabels[status] ?? status;
}
