import { useTableUrlParams } from "@/hooks/useTableUrlParams"
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
  const { searchParams, updateUrlParams } = useTableUrlParams<T>(onEvent)
  const columns = getTableFunction<T>(tableType, tableStore, onEvent)

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    const sortResult = Array.isArray(sorter) ? sorter[0] : sorter

    updateUrlParams(
      {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters,
      {
        field: sortResult.field as string,
        order: sortResult.order as "ascend" | "descend",
      }
    )

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
