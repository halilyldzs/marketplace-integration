import { db } from "@config/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore"
import type { Order, OrderStatus } from "../types"

const COLLECTION_NAME = "orders"

export interface GetOrdersParams {
  page?: number
  pageSize?: number
  orderByField?: keyof Order
  orderDirection?: "asc" | "desc"
  filters?: Array<{
    field: keyof Order
    operator: WhereFilterOp
    value: string | number | boolean | Date | OrderStatus
  }>
  searchTerm?: string
  searchFields?: Array<keyof Order>
  dateRange?: {
    startDate: Date
    endDate: Date
  }
  status?: OrderStatus
}

export interface GetOrdersResponse {
  orders: Order[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}

export const ordersService = {
  async getAll(params?: GetOrdersParams): Promise<GetOrdersResponse> {
    try {
      const {
        pageSize = 10,
        orderByField = "createdAt",
        orderDirection = "desc",
        filters = [],
        searchTerm,
        searchFields = ["customerName", "orderNumber"],
        dateRange,
        status,
      } = params || {}

      const constraints: QueryConstraint[] = []

      // Add filters
      filters.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })

      // Add status filter if provided
      if (status) {
        constraints.push(where("status", "==", status))
      }

      // Add date range filter if provided
      if (dateRange) {
        constraints.push(
          where("createdAt", ">=", dateRange.startDate),
          where("createdAt", "<=", dateRange.endDate)
        )
      }

      // Add search term filter if provided
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()

        // Her alan için ayrı sorgu oluştur
        const searchQueries = searchFields.map((field) => {
          const fieldConstraints = [...constraints]
          fieldConstraints.push(where(field, ">=", searchLower))
          return query(collection(db, COLLECTION_NAME), ...fieldConstraints)
        })

        // Tüm sorguları paralel olarak çalıştır
        const searchResults = await Promise.all(
          searchQueries.map((q) => getDocs(q))
        )

        // Sonuçları birleştir ve tekrar edenleri kaldır
        const uniqueOrders = new Map()
        searchResults.forEach((snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (!uniqueOrders.has(doc.id)) {
              uniqueOrders.set(doc.id, {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
              })
            }
          })
        })

        const orders = Array.from(uniqueOrders.values())
        const total = orders.length

        return {
          orders: orders.slice(0, pageSize),
          total,
          hasMore: total > pageSize,
          lastVisible: null,
        }
      }

      // Normal sorgu (arama yoksa)
      constraints.push(orderBy(orderByField, orderDirection))
      constraints.push(limit(pageSize))

      const q = query(collection(db, COLLECTION_NAME), ...constraints)
      const querySnapshot = await getDocs(q)
      const lastVisible =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null

      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[]

      return {
        orders,
        total: orders.length,
        hasMore: orders.length === pageSize,
        lastVisible,
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  },

  async loadMore(
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
    params?: Omit<GetOrdersParams, "page">
  ): Promise<GetOrdersResponse> {
    try {
      const {
        pageSize = 10,
        orderByField = "createdAt",
        orderDirection = "desc",
        filters = [],
        searchTerm,
        status,
        dateRange,
      } = params || {}

      const constraints: QueryConstraint[] = []

      // Add filters
      filters.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })

      // Add status filter if provided
      if (status) {
        constraints.push(where("status", "==", status))
      }

      // Add date range filter if provided
      if (dateRange) {
        constraints.push(
          where("createdAt", ">=", dateRange.startDate),
          where("createdAt", "<=", dateRange.endDate)
        )
      }

      // Add search term filter if provided
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        constraints.push(where("customerName", ">=", searchLower))
      }

      // Add ordering
      constraints.push(orderBy(orderByField, orderDirection))

      // Add start after for pagination
      if (lastVisible) {
        constraints.push(startAfter(lastVisible))
      }

      // Add limit
      constraints.push(limit(pageSize))

      // Create and execute query
      const q = query(collection(db, COLLECTION_NAME), ...constraints)
      const querySnapshot = await getDocs(q)
      const newLastVisible =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null

      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[]

      return {
        orders,
        total: 0, // Not needed for load more
        hasMore: orders.length === pageSize,
        lastVisible: newLastVisible,
      }
    } catch (error) {
      console.error("Error loading more orders:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as Order
    } catch (error) {
      console.error("Error getting order by ID:", error)
      throw error
    }
  },

  async create(
    data: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<Order> {
    try {
      const orderData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), orderData)
      const newOrder = await this.getById(docRef.id)

      if (!newOrder) {
        throw new Error("Failed to create order")
      }

      return newOrder
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  },

  async update(
    id: string,
    data: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const orderDoc = await getDoc(docRef)

      if (!orderDoc.exists()) {
        throw new Error("Order not found")
      }

      console.log(data)

      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error("Error updating order:", error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      const orderDoc = await getDoc(docRef)

      if (!orderDoc.exists()) {
        throw new Error("Order not found")
      }

      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error deleting order:", error)
      throw error
    }
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    try {
      await this.update(id, { status })
    } catch (error) {
      console.error("Error updating order status:", error)
      throw error
    }
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate),
        orderBy("createdAt", "desc")
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[]
    } catch (error) {
      console.error("Error getting orders by date range:", error)
      throw error
    }
  },

  async getByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[]
    } catch (error) {
      console.error("Error getting orders by status:", error)
      throw error
    }
  },
}
