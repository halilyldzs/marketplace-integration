import { db } from "@config/firebase"
import {
  DocumentData,
  OrderByDirection,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore"
import type {
  Brand,
  CreateBrandDTO,
  GetBrandsResponse,
  UpdateBrandDTO,
} from "../types"

const brandsCollection = collection(db, "brands")

export const brandsService = {
  async getAll({
    searchTerm = "",
    pageSize = 10,
    orderByField = "createdAt",
    orderDirection = "desc" as OrderByDirection,
  } = {}): Promise<GetBrandsResponse> {
    let q = query(
      brandsCollection,
      orderBy(orderByField, orderDirection),
      limit(pageSize)
    )

    if (searchTerm) {
      q = query(
        brandsCollection,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        orderBy("name"),
        limit(pageSize)
      )
    }

    const [snapshot, countSnapshot] = await Promise.all([
      getDocs(q),
      getCountFromServer(brandsCollection),
    ])

    const brands = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Brand[]

    return {
      brands,
      total: countSnapshot.data().count,
      hasMore: snapshot.docs.length === pageSize,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    }
  },

  async loadMore(
    lastVisible: QueryDocumentSnapshot<DocumentData>,
    {
      searchTerm = "",
      pageSize = 10,
      orderByField = "createdAt",
      orderDirection = "desc" as OrderByDirection,
    } = {}
  ): Promise<GetBrandsResponse> {
    let q = query(
      brandsCollection,
      orderBy(orderByField, orderDirection),
      startAfter(lastVisible),
      limit(pageSize)
    )

    if (searchTerm) {
      q = query(
        brandsCollection,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        orderBy("name"),
        startAfter(lastVisible),
        limit(pageSize)
      )
    }

    const [snapshot, countSnapshot] = await Promise.all([
      getDocs(q),
      getCountFromServer(brandsCollection),
    ])

    const brands = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Brand[]

    return {
      brands,
      total: countSnapshot.data().count,
      hasMore: snapshot.docs.length === pageSize,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    }
  },

  async create(data: CreateBrandDTO): Promise<Brand> {
    const now = new Date()
    const docRef = await addDoc(brandsCollection, {
      ...data,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: docRef.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }
  },

  async update({ id, ...data }: UpdateBrandDTO): Promise<void> {
    const docRef = doc(brandsCollection, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    })
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(brandsCollection, id)
    await deleteDoc(docRef)
  },
}
