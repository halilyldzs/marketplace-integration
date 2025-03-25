import { Brand } from "@/features/brands/types"
import { Category } from "@/features/categories/types"
import { TableEvent } from "./table-event-types"

export type TableStore = {
  categories?: Category[]
  brands?: Brand[]
}

export type TableDataSource<T> = {
  data: T[]
  isLoading: boolean
}

export type TableColumnsProps<T> = {
  onEvent: (event: TableEvent<T | string>) => void
  tableStore: TableStore
}
