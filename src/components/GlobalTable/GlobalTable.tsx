import { useTableUrlParams } from "@/hooks/useTableUrlParams"
import { TableBase } from "@/types/table/table-base"
import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { TableDataSource } from "@/types/table/table-store"
import { Table } from "antd"
import { ColumnsType } from "antd/es/table"
import type {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface"

interface GlobalTableProps<T> {
  tableDataSource: TableDataSource<T>
  columns: ColumnsType<T>
  onEvent: (event: TableEvent<T | string | FilterEventPayload>) => void
}

export const GlobalTable = <T extends TableBase>({
  columns,
  tableDataSource,
  onEvent,
}: GlobalTableProps<T>) => {
  const { searchParams, updateUrlParams } = useTableUrlParams<T>(onEvent)

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
      rowSelection={{
        onChange: (selectedRowKeys, selectedRows) => {
          onEvent({
            type: TableEventTypes.SELECT,
            payload: selectedRows as T[],
          })
        },
      }}
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
