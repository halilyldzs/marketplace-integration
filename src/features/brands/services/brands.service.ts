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
import type { Brand, CreateBrandDTO, UpdateBrandDTO } from "../types"

const COLLECTION_NAME = "brands"

export interface GetBrandsParams {
  page?: number
  pageSize?: number
  orderByField?: keyof Brand
  orderDirection?: "asc" | "desc"
  filters?: Array<{
    field: keyof Brand
    operator: WhereFilterOp
    value: string | number | boolean | Date
  }>
  searchTerm?: string
}

export interface GetBrandsResponse {
  brands: Brand[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}

export const brandsService = {
  async getAll(params?: GetBrandsParams): Promise<GetBrandsResponse> {
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
      if (orderByField && orderByField !== ("nameLower" as keyof Brand)) {
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

      const brands = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Brand[]

      return {
        brands,
        total,
        hasMore: brands.length === pageSize,
        lastVisible,
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      throw error
    }
  },

  async loadMore(
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
    params?: Omit<GetBrandsParams, "page">
  ): Promise<GetBrandsResponse> {
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
      if (orderByField && orderByField !== ("nameLower" as keyof Brand)) {
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

      const brands = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Brand[]

      return {
        brands,
        total: 0, // Not needed for load more
        hasMore: brands.length === pageSize,
        lastVisible: newLastVisible,
      }
    } catch (error) {
      console.error("Error loading more brands:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Brand | null> {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Brand
  },

  async create(data: CreateBrandDTO): Promise<Brand> {
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

  async update(data: UpdateBrandDTO): Promise<void> {
    const { id, ...updateData } = data
    const docRef = doc(db, COLLECTION_NAME, id)

    const updates: Partial<Brand> & { updatedAt: FieldValue } = {
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
