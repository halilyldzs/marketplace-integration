import { DashboardStats } from "@sharedTypes/dashboard"

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Mock data - gerçek API entegrasyonunda değişecek
    return {
      activeUsers: 150,
      totalOrders: 1250,
      monthlyRevenue: 85000,
      pendingOrders: 48,
    }
  },
}
