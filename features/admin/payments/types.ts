export type PaymentStatus = "Succeeded" | "Failed";

export type AdminPayment = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  amountInRials: number;
  status: PaymentStatus;
  provider: string;
  referenceNumber: string | null;
  failureReason: string | null;
  createdAtUtc: string;
};

export type PagedPayments = {
  items: AdminPayment[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
