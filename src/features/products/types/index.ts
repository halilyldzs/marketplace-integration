import {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from "firebase/firestore"

export interface Product {
  id: string
  name: string
  nameLower: string
  description: string
  price: number
  categoryId: string
  images: string[]
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export interface ProductsResponse {
  products: Product[]
  total: number
}

export interface CreateProductDTO {
  name: string
  description: string
  price: number
  categoryId: string
  images: string[]
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string
}

export interface GetProductsResponse {
  products: Product[]
  total: number
  hasMore: boolean
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
}

export type ProductFormValues = CreateProductDTO
