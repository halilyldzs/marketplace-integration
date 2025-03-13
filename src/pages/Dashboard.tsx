import {
  CheckCircleOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Card, Col, Row, Statistic } from "antd"
import React from "react"

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card>
            <Statistic
              title='Aktif Kullanıcılar'
              value={112}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card>
            <Statistic
              title='Toplam Sipariş'
              value={48}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card>
            <Statistic
              title='Toplam Gelir'
              value={28600}
              prefix={<DollarOutlined />}
              suffix='₺'
            />
          </Card>
        </Col>
        <Col
          xs={24}
          sm={12}
          lg={6}>
          <Card>
            <Statistic
              title='Tamamlanan Görevler'
              value={90}
              prefix={<CheckCircleOutlined />}
              suffix='%'
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
