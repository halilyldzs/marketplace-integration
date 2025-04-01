import { TableEventTypes } from "@/types/table/table-event-types"
import { TableColumnsProps } from "@/types/table/table-store"
import { EditOutlined } from "@ant-design/icons"
import { Button, Space, TableColumnsType, Tag, Tooltip } from "antd"
import { Key } from "react"
import { Order, OrderStatus, statusColors, statusLabels } from "../types"

export const getOrdersTableColumns = ({
  onEvent,
}: TableColumnsProps<Order>): TableColumnsType<Order> => [
  {
    title: "Sipariş No",
    dataIndex: "orderNumber",
    key: "orderNumber",
    sorter: (a: Order, b: Order) => a.orderNumber.localeCompare(b.orderNumber),
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
    title: "Teslimat Adresi",
    dataIndex: "shippingAddress",
    key: "shippingAddress",
    ellipsis: true,
    width: 200,
  },
  {
    title: "Ürünler",
    dataIndex: "items",
    key: "items",
    ellipsis: true,
    width: 150,
    render: (items: string[]) => `${items.length} ürün`,
  },
  {
    title: "Durum",
    dataIndex: "status",
    key: "status",
    filters: Object.entries(statusLabels).map(([value, text]) => ({
      text,
      value,
    })),
    onFilter: (value: boolean | Key, record: Order) => record.status === value,
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
      `₺${amount?.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
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
    width: 300,
    render: (_: unknown, record: Order) => (
      <Space>
        <Tooltip title='Durumu Güncelle'>
          <Button
            type='text'
            onClick={() =>
              onEvent({
                type: TableEventTypes.ORDER_UPDATE_STATUS,
                payload: record,
              })
            }>
            Durum
          </Button>
        </Tooltip>
        <Tooltip title='Düzenle'>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() =>
              onEvent({
                type: TableEventTypes.EDIT,
                payload: record,
              })
            }></Button>
        </Tooltip>
        <Tooltip title='Sil'>
          <Button
            type='text'
            danger
            onClick={() =>
              onEvent({
                type: TableEventTypes.DELETE,
                payload: record,
              })
            }>
            Sil
          </Button>
        </Tooltip>
      </Space>
    ),
  },
]
