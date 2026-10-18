import { AdminApiError, adminRequest } from "@/features/admin/shared/api";
import type { AdminOrderListItem } from "@/features/admin/orders/types";
import type { AdminPayment } from "@/features/admin/payments/types";
import type { AdminUser } from "@/features/admin/users/types";
import type { ArticleListItem } from "@/features/articles/model/types";
import type { ProductListItem } from "@/features/catalog/model/types";
import type { AdminDashboard } from "./types";

type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

async function readAllPages<T>(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  const pagePath = (page: number) =>
    `${path}${separator}page=${page}&pageSize=100`;
  const first = await adminRequest<PagedResult<T>>(pagePath(1));

  if (first.totalPages <= 1) return first.items;

  const remaining = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) =>
      adminRequest<PagedResult<T>>(pagePath(index + 2)),
    ),
  );
  return [first, ...remaining].flatMap((page) => page.items);
}

function startOfUtcDay(value: Date) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

async function getLegacyDashboard(): Promise<AdminDashboard> {
  const [orders, payments, users, products, articles] = await Promise.all([
    readAllPages<AdminOrderListItem>("orders?sort=Newest"),
    readAllPages<AdminPayment>("payments?status=Succeeded"),
    readAllPages<AdminUser>("users"),
    readAllPages<ProductListItem>("products?sort=Newest"),
    readAllPages<ArticleListItem>("articles"),
  ]);

  const now = new Date();
  const today = startOfUtcDay(now);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const currentMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  const dailyOrders = Array.from({ length: 14 }, (_, index) => {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - 13 + index);
    const nextDay = new Date(day);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    return {
      date: day.toISOString().slice(0, 10),
      orderCount: orders.filter((order) => {
        const createdAt = new Date(order.createdAtUtc);
        return createdAt >= day && createdAt < nextDay;
      }).length,
      revenueInRials: payments
        .filter((payment) => {
          const createdAt = new Date(payment.createdAtUtc);
          return createdAt >= day && createdAt < nextDay;
        })
        .reduce((sum, payment) => sum + payment.amountInRials, 0),
    };
  });

  const monthlyOrders = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + index, 1),
    );
    const nextMonth = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1),
    );

    return {
      year: month.getUTCFullYear(),
      month: month.getUTCMonth() + 1,
      orderCount: orders.filter((order) => {
        const createdAt = new Date(order.createdAtUtc);
        return createdAt >= month && createdAt < nextMonth;
      }).length,
      revenueInRials: payments
        .filter((payment) => {
          const createdAt = new Date(payment.createdAtUtc);
          return createdAt >= month && createdAt < nextMonth;
        })
        .reduce((sum, payment) => sum + payment.amountInRials, 0),
    };
  });

  const statusCounts = new Map<string, number>();
  orders.forEach((order) => {
    statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);
  });

  return {
    totalOrders: orders.length,
    ordersToday: orders.filter((order) => {
      const createdAt = new Date(order.createdAtUtc);
      return createdAt >= today && createdAt < tomorrow;
    }).length,
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.isActive).length,
    totalProducts: products.length,
    outOfStockProducts: products.filter(
      (product) => product.totalStockQuantity <= 0,
    ).length,
    totalArticles: articles.length,
    publishedArticles: articles.filter(
      (article) => article.isActive && new Date(article.publishedAtUtc) <= now,
    ).length,
    totalRevenueInRials: payments.reduce(
      (sum, payment) => sum + payment.amountInRials,
      0,
    ),
    revenueThisMonthInRials: payments
      .filter((payment) => new Date(payment.createdAtUtc) >= currentMonth)
      .reduce((sum, payment) => sum + payment.amountInRials, 0),
    dailyOrders,
    monthlyOrders,
    orderStatuses: Array.from(statusCounts, ([status, count]) => ({
      status,
      count,
    })).sort((a, b) => b.count - a.count),
    recentOrders: [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAtUtc).getTime() -
          new Date(a.createdAtUtc).getTime(),
      )
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.fullName,
        status: order.status,
        totalAmountInRials: order.totalAmountInRials,
        createdAtUtc: order.createdAtUtc,
      })),
  };
}

export const dashboardAdminApi = {
  async get() {
    try {
      return await adminRequest<AdminDashboard>("dashboard");
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 404) {
        return getLegacyDashboard();
      }
      throw error;
    }
  },
};
