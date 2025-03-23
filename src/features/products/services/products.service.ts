import { db } from "@config/firebase"
import { categoriesService } from "@features/categories/services/categories.service"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import type { CreateProductDTO, Product, UpdateProductDTO } from "../types"

const COLLECTION_NAME = "products"

export const productsService = {
  async getAll(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[]
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      id: docRef.id,
      ...data,
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
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  },
}
