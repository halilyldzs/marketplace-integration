import { Card, Col, Row, Statistic, theme } from "antd"
import React from "react"
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import styles from "./Dashboard.module.css"
import { marketplaceSales, monthlyOrders, products } from "./mock/data"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

const Dashboard: React.FC = () => {
  const { token } = theme.useToken()

  // En çok satılan 5 ürünü bul ve line chart için veriyi hazırla
  const topSellingProducts = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      "Satış Adedi": product.soldCount,
    }))

  // Toplam satış ve sipariş sayılarını hesapla
  const totalSales = marketplaceSales.reduce(
    (sum, item) => sum + item.totalSales,
    0
  )
  const totalOrders = marketplaceSales.reduce(
    (sum, item) => sum + item.orderCount,
    0
  )
  const averageOrderValue = totalSales / totalOrders

  return (
    <div className={styles.container}>
      <Row
        gutter={[16, 16]}
        className={styles.statsContainer}>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card className={styles.card}>
            <Statistic
              title='Toplam Satış'
              value={totalSales}
              precision={2}
              prefix='₺'
              formatter={(value) =>
                new Intl.NumberFormat("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(value))
              }
            />
          </Card>
        </Col>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card className={styles.card}>
            <Statistic
              title='Toplam Sipariş'
              value={totalOrders}
            />
          </Card>
        </Col>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card className={styles.card}>
            <Statistic
              title='Ortalama Sipariş Değeri'
              value={averageOrderValue}
              precision={2}
              prefix='₺'
              formatter={(value) =>
                new Intl.NumberFormat("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(value))
              }
            />
          </Card>
        </Col>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card className={styles.card}>
            <Statistic
              title='Aktif Pazaryeri'
              value={marketplaceSales.length}
              suffix='platform'
            />
          </Card>
        </Col>
      </Row>

      {/* Grafikler */}
      <div className={styles.chartsContainer}>
        {/* Üst Sıra Grafikler */}
        <div className={styles.topChartsGrid}>
          {/* En Çok Satan Ürünler */}
          <Card
            title='En Çok Satan 5 Ürün'
            className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <LineChart data={topSellingProducts}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      className={styles.chartGrid}
                    />
                    <XAxis
                      dataKey='name'
                      angle={-45}
                      textAnchor='end'
                      height={60}
                      interval={0}
                      tick={{ fontSize: 12, fill: token.colorText }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: token.colorText }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: token.colorBgElevated,
                        border: `1px solid ${token.colorBorder}`,
                        color: token.colorText,
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                        marginTop: "8px",
                        color: token.colorText,
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='Satış Adedi'
                      stroke={token.colorPrimary}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Pazaryeri Dağılımı */}
          <Card
            title='Pazaryeri Dağılımı'
            className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <PieChart>
                    <Pie
                      data={marketplaceSales}
                      dataKey='totalSales'
                      nameKey='marketplace'
                      cx='50%'
                      cy='50%'
                      outerRadius='70%'
                      label={(entry) => entry.marketplace}>
                      {marketplaceSales.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: token.colorBgElevated,
                        border: `1px solid ${token.colorBorder}`,
                        color: token.colorText,
                      }}
                      formatter={(value) =>
                        new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(Number(value))
                      }
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                        marginTop: "8px",
                        color: token.colorText,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Aylık Sipariş Trendi */}
        <Card
          title='Aylık Sipariş Trendi'
          className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer
                width='100%'
                height='100%'>
                <LineChart data={monthlyOrders}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className={styles.chartGrid}
                  />
                  <XAxis
                    dataKey='month'
                    tick={{ fontSize: 12, fill: token.colorText }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: token.colorText }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: token.colorBgElevated,
                      border: `1px solid ${token.colorBorder}`,
                      color: token.colorText,
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                      marginTop: "8px",
                      color: token.colorText,
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='orders'
                    stroke={token.colorPrimary}
                    name='Sipariş Sayısı'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Pazaryeri Özet Kartları */}
        <div className={styles.marketplaceCards}>
          {marketplaceSales.map((marketplace) => (
            <Card
              key={marketplace.marketplace}
              className={styles.card}>
              <div className={styles.marketplaceCard}>
                <h3 className={styles.marketplaceTitle}>
                  {marketplace.marketplace}
                </h3>
                <div className={styles.marketplaceStats}>
                  <p>
                    Toplam Satış:{" "}
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(marketplace.totalSales)}
                  </p>
                  <p>Sipariş Sayısı: {marketplace.orderCount}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
