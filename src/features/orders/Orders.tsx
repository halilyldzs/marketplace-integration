import { SearchOutlined } from "@ant-design/icons"
import { Order, OrderFilters, OrderStatus } from "@features/orders/types"
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd"
import { useState } from "react"
import styles from "./Orders.module.css"

const { RangePicker } = DatePicker

const statusColors = {
  [OrderStatus.NEW]: "blue",
  [OrderStatus.SHIPPED]: "green",
  [OrderStatus.CANCELLED]: "red",
  [OrderStatus.RETURNED]: "orange",
}

const statusLabels = {
  [OrderStatus.NEW]: "Yeni",
  [OrderStatus.SHIPPED]: "Kargolandı",
  [OrderStatus.CANCELLED]: "İptal",
  [OrderStatus.RETURNED]: "İade",
}

const Orders = () => {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  const columns = [
    {
      title: "Sipariş No",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Müşteri",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Toplam Tutar",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) =>
        `₺${amount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <Space>
          <Button
            type='link'
            onClick={() => handleViewOrder(record)}>
            Görüntüle
          </Button>
          <Button
            type='link'
            onClick={() => handleUpdateStatus(record)}>
            Durum Güncelle
          </Button>
        </Space>
      ),
    },
  ]

  const handleViewOrder = (order: Order) => {
    // TODO: Implement order view
    console.log("View order:", order)
  }

  const handleUpdateStatus = (order: Order) => {
    // TODO: Implement status update
    console.log("Update status:", order)
  }

  const handleSearch = () => {
    // TODO: Implement search
    console.log("Search with filters:", filters)
  }

  const handleReset = () => {
    setFilters({})
    // TODO: Reset search
  }

  return (
    <div className={styles.container}>
      <Card
        title='Siparişler'
        className={styles.card}>
        <div className={styles.header}>
          <Space wrap>
            <Input
              placeholder='Sipariş no veya müşteri ara...'
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              style={{ width: 300 }}
            />
            <Select
              placeholder='Durum'
              allowClear
              style={{ width: 150 }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}>
              {Object.values(OrderStatus).map((status) => (
                <Select.Option
                  key={status}
                  value={status}>
                  {statusLabels[status]}
                </Select.Option>
              ))}
            </Select>
            <RangePicker
              onChange={(dates) => {
                if (dates) {
                  setFilters({
                    ...filters,
                    startDate: dates[0]?.toISOString(),
                    endDate: dates[1]?.toISOString(),
                  })
                } else {
                  setFilters({
                    ...filters,
                    startDate: undefined,
                    endDate: undefined,
                  })
                }
              }}
            />
            <Button
              type='primary'
              onClick={handleSearch}>
              Ara
            </Button>
            <Button onClick={handleReset}>Sıfırla</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey='id'
          loading={loading}
          pagination={{
            total: orders.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  )
}

export default Orders
