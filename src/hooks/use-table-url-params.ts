import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { FilterValue } from "antd/lib/table/interface"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export const useTableUrlParams = <T>(
  onEvent: (event: TableEvent<T | string | FilterEventPayload>) => void
) => {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // Get all filter parameters from URL
    const filters: Record<string, FilterValue | null> = {}
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (
        !["page", "pageSize", "orderByField", "orderDirection"].includes(key)
      ) {
        filters[key] = value.includes(",")
          ? (value.split(",") as unknown as FilterValue)
          : (value as unknown as FilterValue)
      }
    })

    // Get sorting parameters
    const orderByField = searchParams.get("orderByField")
    const orderDirection = searchParams.get("orderDirection")

    // Get pagination parameters
    const current = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10

    // Trigger filter event with URL parameters
    onEvent({
      type: TableEventTypes.FILTER,
      payload: {
        filters,
        pagination: { current, pageSize },
        sorter: {
          field: orderByField || undefined,
          order: orderDirection === "asc" ? "ascend" : "descend",
        },
      },
    })
  }, [searchParams, onEvent])

  const updateUrlParams = (
    pagination: { current?: number; pageSize?: number },
    filters: Record<string, FilterValue | null>,
    sorter: { field?: string; order?: "ascend" | "descend" }
  ) => {
    const newParams = new URLSearchParams(searchParams)

    // Handle filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(
          key,
          Array.isArray(value) ? value.join(",") : String(value)
        )
      } else {
        newParams.delete(key)
      }
    })

    // Handle sorting
    if (sorter.field) {
      newParams.set("orderByField", sorter.field)
      newParams.set(
        "orderDirection",
        sorter.order === "ascend" ? "asc" : "desc"
      )
    } else {
      newParams.delete("orderByField")
      newParams.delete("orderDirection")
    }

    // Handle pagination
    if (pagination.current) {
      newParams.set("page", String(pagination.current))
    }
    if (pagination.pageSize) {
      newParams.set("pageSize", String(pagination.pageSize))
    }

    setSearchParams(newParams)
  }

  return {
    searchParams,
    updateUrlParams,
  }
}
