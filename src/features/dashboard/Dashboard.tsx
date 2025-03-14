import { DashboardStats } from "@sharedTypes/dashboard"
import { useQuery } from "@tanstack/react-query"
import { Card, Col, Row, Statistic } from "antd"
import { dashboardService } from "./services/dashboard.service"

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  })

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic
              title='Aktif Kullanıcılar'
              value={stats?.activeUsers || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic
              title='Toplam Sipariş'
              value={stats?.totalOrders || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic
              title='Aylık Gelir'
              value={stats?.monthlyRevenue || 0}
              prefix='₺'
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic
              title='Bekleyen Siparişler'
              value={stats?.pendingOrders || 0}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
