import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { TableTypes } from "@/types/table/table-type"
import { getTableFunction } from "@/utils/get-table-function"
import { Product } from "@features/products/types"
import { Table } from "antd"
import type {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface"
import { useSearchParams } from "react-router-dom"

interface GlobalTableProps<T extends Product> {
  tableType: TableTypes
  tableStore: TableStore
  tableDataSource: TableDataSource<T>
  onEvent: (event: TableEvent<T | string | FilterEventPayload>) => void
}

export const GlobalTable = <T extends Product>({
  tableType,
  tableStore,
  tableDataSource,
  onEvent,
}: GlobalTableProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const columns = getTableFunction<T>(tableType, tableStore, onEvent)

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    // Update URL search parameters
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
    const sortResult = Array.isArray(sorter) ? sorter[0] : sorter
    if (sortResult.field) {
      newParams.set("orderByField", sortResult.field as string)
      newParams.set(
        "orderDirection",
        sortResult.order === "ascend" ? "asc" : "desc"
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

    // Trigger filter event
    onEvent({
      type: TableEventTypes.FILTER,
      payload: {
        filters,
        pagination: {
          current: pagination.current || 1,
          pageSize: pagination.pageSize || 10,
        },
        sorter: {
          field: sortResult.field as string,
          order: sortResult.order as "ascend" | "descend" | undefined,
        },
      },
    })
  }

  return (
    <Table<T>
      columns={columns}
      dataSource={tableDataSource.data}
      rowKey='id'
      pagination={{
        showSizeChanger: true,
        showTotal: (total: number) => `Toplam ${total} kayıt`,
        current: Number(searchParams.get("page")) || 1,
        pageSize: Number(searchParams.get("pageSize")) || 10,
      }}
      scroll={{ x: 1200 }}
      loading={tableDataSource.isLoading}
      onChange={handleTableChange}
    />
  )
}
