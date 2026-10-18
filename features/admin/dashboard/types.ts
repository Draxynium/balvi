export type DashboardDailyPoint = {
  date: string;
  orderCount: number;
  revenueInRials: number;
};

export type DashboardMonthlyPoint = {
  year: number;
  month: number;
  orderCount: number;
  revenueInRials: number;
};

export type DashboardOrderStatus = {
  status: string;
  count: number;
};

export type DashboardRecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmountInRials: number;
  createdAtUtc: string;
};

export type AdminDashboard = {
  totalOrders: number;
  ordersToday: number;
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  outOfStockProducts: number;
  totalArticles: number;
  publishedArticles: number;
  totalRevenueInRials: number;
  revenueThisMonthInRials: number;
  dailyOrders: DashboardDailyPoint[];
  monthlyOrders: DashboardMonthlyPoint[];
  orderStatuses: DashboardOrderStatus[];
  recentOrders: DashboardRecentOrder[];
};
