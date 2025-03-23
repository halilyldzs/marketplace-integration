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

class BrandsService {
  private collection = collection(db, "brands")

  async getAll({
    searchTerm = "",
    pageSize = 10,
    orderByField = "createdAt",
    orderDirection = "desc" as OrderByDirection,
  } = {}): Promise<GetBrandsResponse> {
    let q = query(
      this.collection,
      orderBy(orderByField, orderDirection),
      limit(pageSize)
    )

    if (searchTerm) {
      q = query(
        this.collection,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        orderBy("name"),
        limit(pageSize)
      )
    }

    const snapshot = await getDocs(q)
    const countSnapshot = await getCountFromServer(this.collection)

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
  }

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
      this.collection,
      orderBy(orderByField, orderDirection),
      startAfter(lastVisible),
      limit(pageSize)
    )

    if (searchTerm) {
      q = query(
        this.collection,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        orderBy("name"),
        startAfter(lastVisible),
        limit(pageSize)
      )
    }

    const snapshot = await getDocs(q)
    const countSnapshot = await getCountFromServer(this.collection)

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
  }

  async create(data: CreateBrandDTO): Promise<Brand> {
    const now = new Date()
    const docRef = await addDoc(this.collection, {
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
  }

  async update({ id, ...data }: UpdateBrandDTO): Promise<void> {
    const docRef = doc(this.collection, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    })
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collection, id)
    await deleteDoc(docRef)
  }
}

export const brandsService = new BrandsService()
