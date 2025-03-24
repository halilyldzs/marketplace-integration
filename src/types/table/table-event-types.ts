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

export type TableEventPayload = unknown

export type TableEvent<T = unknown> = {
  type: TableEventTypes
  payload: T
}
