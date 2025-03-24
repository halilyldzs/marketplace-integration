import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Order, OrderFilters, OrderStatus } from "@features/orders/types"
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd"
import { useState } from "react"
import OrderForm from "./components/OrderForm"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    {
      title: "Sipariş No",
      dataIndex: "orderNumber",
      key: "orderNumber",
      sorter: (a: Order, b: Order) =>
        a.orderNumber.localeCompare(b.orderNumber),
    },
    {
      title: "Müşteri",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a: Order, b: Order) =>
        a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      filters: Object.entries(statusLabels).map(([value, text]) => ({
        text,
        value,
      })),
      onFilter: (value: string, record: Order) => record.status === value,
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Toplam Tutar",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      render: (amount: number) =>
        `₺${amount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
      title: "İşlemler",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_: unknown, record: Order) => (
        <Space>
          <Tooltip title='Siparişi Görüntüle'>
            <Button
              type='text'
              onClick={() => handleViewOrder(record)}>
              Görüntüle
            </Button>
          </Tooltip>
          <Tooltip title='Durumu Güncelle'>
            <Button
              type='text'
              onClick={() => handleUpdateStatus(record)}>
              Durum
            </Button>
          </Tooltip>
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

  const handleCreateOrder = async (values: any) => {
    try {
      setLoading(true)
      // TODO: Implement order creation
      console.log("Create order:", values)
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card
        title='Siparişler'
        className={styles.card}
        extra={
          <Tooltip title='Yeni Sipariş'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}>
              Yeni Sipariş
            </Button>
          </Tooltip>
        }>
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
          scroll={{ x: 1200 }}
          pagination={{
            total: orders.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Toplam ${total} sipariş`,
          }}
        />
      </Card>

      <Modal
        title='Yeni Sipariş'
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        footer={null}
        width={800}>
        <OrderForm
          form={form}
          onSubmit={handleCreateOrder}
          onCancel={() => {
            setIsModalOpen(false)
            form.resetFields()
          }}
          isSubmitting={loading}
        />
      </Modal>
    </div>
  )
}

export default Orders
