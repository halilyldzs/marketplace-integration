import {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from "firebase/firestore"

export interface Brand {
  id: string
  name: string
  nameLower: string
  description?: string
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export interface CreateBrandDTO {
  name: string
  description?: string
}

export interface UpdateBrandDTO extends Partial<CreateBrandDTO> {
  id: string
}

export interface GetBrandsResponse {
  brands: Brand[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}
