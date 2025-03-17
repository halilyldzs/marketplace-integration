export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
}

export interface ProductFormValues {
  name: string
  description: string
  price: number
  stock: number
  category: string
}
