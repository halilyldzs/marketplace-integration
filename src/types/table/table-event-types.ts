import { FilterValue } from "antd/es/table/interface"

export const TableEventTypes = {
  EDIT: "EDIT",
  DELETE: "DELETE",
  FILTER: "FILTER",
  SORT: "sort",
  PAGE: "page",
  SIZE: "size",
  SEARCH: "search",
  RESET: "reset",
  SELECT: "SELECT",
} as const

export type TableEventTypes =
  (typeof TableEventTypes)[keyof typeof TableEventTypes]

export type TableEvent<T> =
  | {
      type: "EDIT"
      payload: T
    }
  | {
      type: "DELETE"
      payload: T
    }
  | {
      type: "FILTER"
      payload: FilterEventPayload
    }
  | {
      type: "SELECT"
      payload: T[]
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
