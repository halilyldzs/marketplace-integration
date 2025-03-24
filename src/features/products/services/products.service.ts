import { db } from "@config/firebase"
import { categoriesService } from "@features/categories/services/categories.service"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FieldValue,
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
import type { CreateProductDTO, Product, UpdateProductDTO } from "../types"

const COLLECTION_NAME = "products"

export interface GetProductsParams {
  page?: number
  pageSize?: number
  orderByField?: keyof Product
  orderDirection?: "asc" | "desc"
  filters?: Array<{
    field: keyof Product
    operator: WhereFilterOp
    value: string | number | boolean | Date
  }>
  searchTerm?: string
  searchFields?: Array<keyof Product>
  categoryId?: string
}

export interface GetProductsResponse {
  products: Product[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}

export const productsService = {
  async getAll(params?: GetProductsParams): Promise<GetProductsResponse> {
    try {
      console.log("Fetching products with params:", params)
      const {
        pageSize = 10,
        orderByField = "createdAt",
        orderDirection = "desc",
        filters = [],
        searchTerm,
        searchFields = [],
        categoryId,
      } = params || {}

      const constraints: QueryConstraint[] = []

      // Add filters
      filters.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })

      // Add category filter if provided
      if (categoryId) {
        constraints.push(where("categoryId", "==", categoryId))
      }

      // Add search term filter if provided
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()

        // Her alan için ayrı sorgu oluştur
        const searchQueries = searchFields.map((field) => {
          const fieldConstraints = [...constraints]
          if (field === "name") {
            fieldConstraints.push(where("nameLower", ">=", searchLower))
          } else {
            fieldConstraints.push(where(field, ">=", searchLower))
          }
          return query(collection(db, COLLECTION_NAME), ...fieldConstraints)
        })

        // Tüm sorguları paralel olarak çalıştır
        const searchResults = await Promise.all(
          searchQueries.map((q) => getDocs(q))
        )

        // Sonuçları birleştir ve tekrar edenleri kaldır
        const uniqueProducts = new Map()
        searchResults.forEach((snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (!uniqueProducts.has(doc.id)) {
              uniqueProducts.set(doc.id, {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
              })
            }
          })
        })

        const products = Array.from(uniqueProducts.values())
        const total = products.length

        return {
          products: products.slice(0, pageSize),
          total,
          hasMore: total > pageSize,
          lastVisible: null,
        }
      }

      // Normal sorgu (arama yoksa)
      if (orderByField && orderByField !== ("nameLower" as keyof Product)) {
        constraints.push(orderBy(orderByField, orderDirection))
      }
      constraints.push(limit(pageSize))

      const q = query(collection(db, COLLECTION_NAME), ...constraints)
      const querySnapshot = await getDocs(q)
      const lastVisible =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[]

      return {
        products,
        total: products.length,
        hasMore: products.length === pageSize,
        lastVisible,
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  },

  async loadMore(
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
    params?: Omit<GetProductsParams, "page">
  ): Promise<GetProductsResponse> {
    try {
      const {
        pageSize = 10,
        orderByField = "createdAt",
        orderDirection = "desc",
        filters = [],
        searchTerm,
        categoryId,
      } = params || {}

      const constraints: QueryConstraint[] = []

      // Add filters
      filters.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })

      // Add category filter if provided
      if (categoryId) {
        constraints.push(where("categoryId", "==", categoryId))
      }

      // Add search term filter if provided
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        constraints.push(where("nameLower", ">=", searchLower))
      }

      // Add ordering
      if (searchTerm) {
        constraints.push(orderBy("nameLower"))
      }
      if (orderByField && orderByField !== ("nameLower" as keyof Product)) {
        constraints.push(orderBy(orderByField, orderDirection))
      }

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

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[]

      return {
        products,
        total: 0, // Not needed for load more
        hasMore: products.length === pageSize,
        lastVisible: newLastVisible,
      }
    } catch (error) {
      console.error("Error loading more products:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Product
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    // Kategori var mı kontrol et
    const category = await categoriesService.getById(categoryId)
    if (!category) {
      throw new Error("Category not found")
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where("categoryId", "==", categoryId)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[]
  },

  async create(data: CreateProductDTO): Promise<Product> {
    // Kategori var mı kontrol et
    const category = await categoriesService.getById(data.categoryId)
    if (!category) {
      throw new Error("Category not found")
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      nameLower: data.name.toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      id: docRef.id,
      ...data,
      nameLower: data.name.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  async update(data: UpdateProductDTO): Promise<void> {
    const { id, ...updateData } = data

    // Eğer categoryId değişiyorsa, kategorinin varlığını kontrol et
    if (updateData.categoryId) {
      const category = await categoriesService.getById(updateData.categoryId)
      if (!category) {
        throw new Error("Category not found")
      }
    }

    const docRef = doc(db, COLLECTION_NAME, id)
    const updates: Partial<Product> & { updatedAt: FieldValue } = {
      ...updateData,
      updatedAt: serverTimestamp(),
    }

    if (updateData.name) {
      updates.nameLower = updateData.name.toLowerCase()
    }

    await updateDoc(docRef, updates)
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  },
}
