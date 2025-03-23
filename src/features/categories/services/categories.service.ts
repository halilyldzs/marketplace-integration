import { db } from "@config/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from "../types"

const COLLECTION_NAME = "categories"

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    try {
      console.log("Attempting to fetch categories from Firestore...")
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
      console.log(
        "Raw categories data:",
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )

      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Category[]

      console.log("Processed categories:", categories)
      return categories
    } catch (error) {
      console.error("Error fetching categories:", error)
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

  async update(data: UpdateCategoryDTO): Promise<void> {
    const { id, ...updateData } = data
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
