import { db } from "@config/firebase"
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
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from "../types"

const COLLECTION_NAME = "categories"

export interface GetCategoriesParams {
  page?: number
  pageSize?: number
  orderByField?: keyof Category
  orderDirection?: "asc" | "desc"
  filters?: Array<{
    field: keyof Category
    operator: WhereFilterOp
    value: string | number | boolean | Date
  }>
  searchTerm?: string
}

export interface GetCategoriesResponse {
  categories: Category[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}

export const categoriesService = {
  async getAll(params?: GetCategoriesParams): Promise<GetCategoriesResponse> {
    try {
      const {
        pageSize = 10,
        orderByField = "createdAt",
        orderDirection = "desc",
        filters = [],
        searchTerm,
      } = params || {}

      const constraints: QueryConstraint[] = []

      // Add filters
      filters.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })

      // Add search term filter if provided
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        constraints.push(where("nameLower", ">=", searchLower))
      }

      // Add ordering
      if (searchTerm) {
        constraints.push(orderBy("nameLower"))
      }
      if (orderByField !== "nameLower") {
        constraints.push(orderBy(orderByField, orderDirection))
      }

      // Add pagination
      constraints.push(limit(pageSize))

      // Create query
      const q = query(collection(db, COLLECTION_NAME), ...constraints)

      // Get total count (without pagination)
      const totalQuery = query(
        collection(db, COLLECTION_NAME),
        ...constraints.filter((c) => c.type !== "limit")
      )
      const totalSnapshot = await getDocs(totalQuery)
      const total = totalSnapshot.size

      // Get paginated data
      const querySnapshot = await getDocs(q)
      const lastVisible =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null

      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Category[]

      return {
        categories,
        total,
        hasMore: categories.length === pageSize,
        lastVisible,
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  async loadMore(
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
    params?: Omit<GetCategoriesParams, "page">
  ): Promise<GetCategoriesResponse> {
    try {
      const {
        pageSize = 10,
        orderByField = "createdAt",
        orderDirection = "desc",
        filters = [],
        searchTerm,
      } = params || {}

      const constraints: QueryConstraint[] = []

      // Add filters
      filters.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value))
      })

      // Add search term filter if provided
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase().trim()
        constraints.push(where("nameLower", ">=", searchLower))
      }

      // Add ordering
      if (searchTerm) {
        constraints.push(orderBy("nameLower"))
      }
      if (orderByField !== "nameLower") {
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

      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Category[]

      return {
        categories,
        total: 0, // Not needed for load more
        hasMore: categories.length === pageSize,
        lastVisible: newLastVisible,
      }
    } catch (error) {
      console.error("Error loading more categories:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Category | null> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Category
  },

  async create(data: CreateCategoryDTO): Promise<Category> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      // Arama için küçük harfli alan ekliyoruz
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

  async update(data: UpdateCategoryDTO): Promise<void> {
    const { id, ...updateData } = data
    const docRef = doc(db, COLLECTION_NAME, id)

    const updates: Partial<Omit<Category, "id">> & { updatedAt: FieldValue } = {
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
