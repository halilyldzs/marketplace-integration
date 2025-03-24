export type TableEventTypes = {
  edit: "edit"
  delete: "delete"
  filter: "filter"
  sort: "sort"
  page: "page"
  size: "size"
  search: "search"
  reset: "reset"
}

export type TableEvent = {
  type: TableEventTypes
  payload: TableEventPayload
}

export type TableEventPayload = {
  id: string
  [key: string]: unknown
}
