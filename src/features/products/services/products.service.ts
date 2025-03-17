import { Product, ProductFormValues, ProductsResponse } from "../types"

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    description: "High performance laptop",
    price: 1299.99,
    stock: 50,
    category: "Electronics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model smartphone",
    price: 999.99,
    stock: 100,
    category: "Electronics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const productsService = {
  async getProducts(): Promise<ProductsResponse> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { products: mockProducts, total: mockProducts.length }
  },

  async createProduct(product: ProductFormValues): Promise<Product> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  },

  async updateProduct(
    id: string,
    product: ProductFormValues
  ): Promise<Product> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Product not found")

    const updatedProduct: Product = {
      ...mockProducts[index],
      ...product,
      updatedAt: new Date().toISOString(),
    }
    mockProducts[index] = updatedProduct
    return updatedProduct
  },

  async deleteProduct(id: string): Promise<void> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Product not found")
    mockProducts.splice(index, 1)
  },
}
