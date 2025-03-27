import { GlobalTable } from "@/components/GlobalTable/GlobalTable"
import { useBroadcast } from "@/hooks/useBroadcast"
import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import {
  Order,
  OrderFilters,
  OrderStatus,
  statusLabels,
} from "@features/orders/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tooltip,
} from "antd"
import { useCallback, useState } from "react"
import type { OrderFormValues } from "./components/OrderForm"
import OrderForm from "./components/OrderForm"
import { getOrdersTableColumns } from "./consts/ordersTableColumns"
import styles from "./Orders.module.css"
import { ordersService } from "./services/orders.service"

const { RangePicker } = DatePicker

const Orders = () => {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryClient = useQueryClient()
  const { invalidateQueries } = useBroadcast()

  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])

  // Siparişleri getir
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", currentPage, pageSize, filters],
    queryFn: () =>
      ordersService.getAll({
        page: currentPage,
        pageSize,
        searchTerm: filters.search || "",
        status: filters.status || undefined,
        dateRange:
          filters.startDate && filters.endDate
            ? {
                startDate: new Date(filters.startDate),
                endDate: new Date(filters.endDate),
              }
            : undefined,
      }),
  })

  // Sipariş oluştur
  const createMutation = useMutation({
    mutationFn: (values: Omit<Order, "id" | "createdAt" | "updatedAt">) =>
      ordersService.create(values),
    onSuccess: () => {
      message.success("Sipariş başarıyla oluşturuldu")
      setIsModalOpen(false)
      setEditingOrder(null)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      invalidateQueries(["orders"])
    },
    onError: (error: Error) => {
      message.error(error.message || "Sipariş oluşturulurken bir hata oluştu")
    },
  })

  // Sipariş güncelle
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>
    }) => ordersService.update(id, data),
    onSuccess: () => {
      message.success("Sipariş başarıyla güncellendi")
      setIsModalOpen(false)
      setEditingOrder(null)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      invalidateQueries(["orders"])
    },
    onError: (error: Error) => {
      message.error(error.message || "Sipariş güncellenirken bir hata oluştu")
    },
  })

  // Sipariş sil
  const deleteMutation = useMutation({
    mutationFn: () =>
      Promise.all(
        selectedOrders.map((order) => ordersService.delete(order.id))
      ),
    onSuccess: () => {
      message.success(`${selectedOrders.length} sipariş başarıyla silindi`)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      invalidateQueries(["orders"])
      setSelectedOrders([])
    },
    onError: (error: Error) => {
      message.error(
        error.message ||
          `${selectedOrders.length} sipariş silinirken bir hata oluştu`
      )
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      message.success("Sipariş durumu başarıyla güncellendi")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      invalidateQueries(["orders"])
    },
    onError: (error: Error) => {
      message.error(
        error.message || "Sipariş durumu güncellenirken bir hata oluştu"
      )
    },
  })

  const handleStatusChange = useCallback(
    (id: string, status: OrderStatus) => {
      updateStatusMutation.mutate({ id, status })
    },
    [updateStatusMutation]
  )

  const handleUpdateStatus = useCallback(
    (order: Order) => {
      let selectedStatus = order.status

      Modal.confirm({
        title: "Sipariş Durumu Güncelle",
        content: (
          <Select
            defaultValue={order.status}
            style={{ width: "100%" }}
            onChange={(value) => (selectedStatus = value)}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <Select.Option
                key={value}
                value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        ),
        onOk: () => {
          if (selectedStatus !== order.status) {
            handleStatusChange(order.id, selectedStatus)
          }
        },
      })
    },
    [handleStatusChange]
  )

  const handleEdit = useCallback((order: Order) => {
    setEditingOrder(order)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: "Siparişi Sil",
      content: "Bu siparişi silmek istediğinizden emin misiniz?",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => deleteMutation.mutate(),
    })
  }, [deleteMutation])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const handleCreate = () => {
    setEditingOrder(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: OrderFormValues) => {
    const orderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      customerPhone: values.customerPhone,
      shippingAddress: values.shippingAddress,
      notes: values.notes || "",
      status: OrderStatus.NEW,
      totalAmount: values.totalAmount,
      items: values.items,
      orderNumber: editingOrder?.orderNumber || `ORD-${Date.now()}`,
    }

    if (editingOrder) {
      updateMutation.mutate({ id: editingOrder.id, data: orderData })
    } else {
      createMutation.mutate(orderData)
    }
  }

  const handleEvent = useCallback(
    (event: TableEvent<Order | string | FilterEventPayload>) => {
      switch (event.type) {
        case TableEventTypes.EDIT:
          handleEdit(event.payload as Order)
          break
        case TableEventTypes.DELETE:
          setSelectedOrders([event.payload as Order])
          handleDelete()
          break
        case TableEventTypes.ORDER_UPDATE_STATUS:
          handleUpdateStatus(event.payload as Order)
          break
        case TableEventTypes.FILTER: {
          const payload = event.payload as FilterEventPayload
          setFilters((prev) => ({
            ...prev,
            ...payload.filters,
          }))
          if (payload.pagination) {
            setCurrentPage(payload.pagination.current)
            setPageSize(payload.pagination.pageSize)
          }
          break
        }
      }
    },
    [handleEdit, handleDelete, handleUpdateStatus]
  )

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
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              style={{ width: 300 }}
            />
            <Select
              placeholder='Durum'
              allowClear
              style={{ width: 150 }}
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }>
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
                setFilters((prev) => ({
                  ...prev,
                  startDate: dates?.[0]?.toISOString(),
                  endDate: dates?.[1]?.toISOString(),
                }))
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

        <GlobalTable<Order>
          columns={getOrdersTableColumns({
            onEvent: handleEvent,
          })}
          tableDataSource={{
            data: ordersData?.orders || [],
            isLoading,
          }}
          onEvent={handleEvent}
        />
      </Card>

      <Modal
        title={editingOrder ? "Sipariş Düzenle" : "Yeni Sipariş"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingOrder(null)
        }}
        footer={null}
        width={800}>
        <OrderForm
          order={editingOrder || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingOrder(null)
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          isEditing={!!editingOrder}
        />
      </Modal>
    </div>
  )
}

export default Orders
