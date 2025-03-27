export const TableTypes = {
  PRODUCT: "product",
  ORDER: "order",
  BRAND: "brand",
  CATEGORIES: "categories",
} as const

export type TableTypes = (typeof TableTypes)[keyof typeof TableTypes]
