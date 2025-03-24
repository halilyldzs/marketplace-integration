export enum OrderStatus {
  NEW = "NEW",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface OrderFilters {
  status?: OrderStatus
  search?: string
  startDate?: string
  endDate?: string
}
