import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Order, OrderFilters, OrderStatus } from "@features/orders/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import type { Key } from "react"
import { useState } from "react"
import type { OrderFormValues } from "./components/OrderForm"
import OrderForm from "./components/OrderForm"
import styles from "./Orders.module.css"
import { ordersService } from "./services/orders.service"

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
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null)
  const queryClient = useQueryClient()

  // Siparişleri getir
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", currentPage, pageSize, searchTerm, statusFilter],
    queryFn: () =>
      ordersService.getAll({
        page: currentPage,
        pageSize,
        searchTerm,
        status: statusFilter || undefined,
      }),
  })

  // Sipariş oluştur
  const createMutation = useMutation({
    mutationFn: (values: any) => ordersService.create(values),
    onSuccess: () => {
      message.success("Sipariş başarıyla oluşturuldu")
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error: any) => {
      message.error(error.message || "Sipariş oluşturulurken bir hata oluştu")
    },
  })

  // Sipariş güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ordersService.update(id, data),
    onSuccess: () => {
      message.success("Sipariş başarıyla güncellendi")
      setIsModalOpen(false)
      form.resetFields()
      setEditingOrder(null)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error: any) => {
      message.error(error.message || "Sipariş güncellenirken bir hata oluştu")
    },
  })

  // Sipariş sil
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ordersService.delete(id),
    onSuccess: () => {
      message.success("Sipariş başarıyla silindi")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error: any) => {
      message.error(error.message || "Sipariş silinirken bir hata oluştu")
    },
  })

  // Sipariş durumu güncelle
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      message.success("Sipariş durumu başarıyla güncellendi")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error: any) => {
      message.error(
        error.message || "Sipariş durumu güncellenirken bir hata oluştu"
      )
    },
  })

  const columns: ColumnsType<Order> = [
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
      title: "E-posta",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Telefon",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      filters: Object.entries(statusLabels).map(([value, text]) => ({
        text,
        value,
      })),
      onFilter: (value: boolean | Key, record: Order) =>
        record.status === value,
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
      fixed: "right" as const,
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
          <Tooltip title='Düzenle'>
            <Button
              type='text'
              onClick={() => handleEdit(record)}>
              Düzenle
            </Button>
          </Tooltip>
          <Tooltip title='Sil'>
            <Button
              type='text'
              danger
              onClick={() => handleDelete(record.id)}>
              Sil
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

  const handleCreateOrder = async (values: OrderFormValues) => {
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

  const handleCreate = () => {
    setEditingOrder(null)
    setIsModalOpen(true)
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    form.setFieldsValue(order)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Siparişi Sil",
      content: "Bu siparişi silmek istediğinizden emin misiniz?",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => deleteMutation.mutate(id),
    })
  }

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatusMutation.mutate({ id, status })
  }

  const handleSubmit = async (values: any) => {
    if (editingOrder) {
      updateMutation.mutate({ id: editingOrder.id, data: values })
    } else {
      createMutation.mutate(values)
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
              onClick={handleCreate}>
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
          dataSource={ordersData?.orders}
          rowKey='id'
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize,
            total: ordersData?.total,
            onChange: (page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            },
          }}
        />
      </Card>

      <Modal
        title={editingOrder ? "Sipariş Düzenle" : "Yeni Sipariş"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setEditingOrder(null)
        }}
        footer={null}
        width={800}>
        <OrderForm
          form={form}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            form.resetFields()
            setEditingOrder(null)
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default Orders
