import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

export interface Brand {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateBrandDTO {
  name: string
  description?: string
}

export interface UpdateBrandDTO extends CreateBrandDTO {
  id: string
}

export interface GetBrandsResponse {
  brands: Brand[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}
