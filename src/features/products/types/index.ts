export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  images: string[]
  createdAt: Date
  updatedAt: Date
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

export type ProductFormValues = CreateProductDTO
