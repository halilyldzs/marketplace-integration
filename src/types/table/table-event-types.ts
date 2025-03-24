import { FilterValue } from "antd/es/table/interface"

export const TableEventTypes = {
  EDIT: "edit",
  DELETE: "delete",
  FILTER: "filter",
  SORT: "sort",
  PAGE: "page",
  SIZE: "size",
  SEARCH: "search",
  RESET: "reset",
} as const

export type TableEventTypes =
  (typeof TableEventTypes)[keyof typeof TableEventTypes]

export interface TableEvent<T> {
  type: TableEventTypes
  payload: T
}

export interface FilterEventPayload {
  filters: Record<string, FilterValue | null>
  pagination: {
    current: number
    pageSize: number
  }
  sorter: {
    field?: string
    order?: "ascend" | "descend"
  }
}
