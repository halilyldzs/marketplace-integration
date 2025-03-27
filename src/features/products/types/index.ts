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
  listPrice: number
  sku: string
  barcode: string
  vat: number
  deci: number
  stock: number
  categoryId: string
  brandId: string
  images: string[]
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
  [key: string]: unknown
}

export interface ProductsResponse {
  products: Product[]
  total: number
}

export interface CreateProductDTO {
  name: string
  description: string
  price: number
  listPrice: number
  sku: string
  barcode: string
  vat: number
  deci: number
  stock: number
  categoryId: string
  brandId: string
  images: string[]
  [key: string]: unknown
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

export type ProductFormValues = {
  name: string
  description: string
  price: number
  listPrice: number
  sku: string
  barcode: string
  vat: number
  deci: number
  stock: number
  categoryId: string
  brandId: string
  images: string[]
}
