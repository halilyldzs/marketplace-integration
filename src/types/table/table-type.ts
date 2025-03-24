export const TableTypes = {
  PRODUCT: "product",
  ORDER: "order",
  BRAND: "brand",
} as const

export type TableTypes = (typeof TableTypes)[keyof typeof TableTypes]
