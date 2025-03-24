import { Brand } from "@/features/brands/types"
import { Category } from "@/features/categories/types"

export type TableStore = {
  categories?: Category[]
  brands?: Brand[]
}

export type TableDataSource<T> = {
  data: T[]
  isLoading: boolean
}
