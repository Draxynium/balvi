export type AdminUser = {
  id: string;
  phoneNumber: string;
  isActive: boolean;
  role: string | null;
  createdAtUtc: string;
};

export type PagedUsers = {
  items: AdminUser[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
