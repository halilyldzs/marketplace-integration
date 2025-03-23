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
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Category[]
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
