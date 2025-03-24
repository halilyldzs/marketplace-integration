import { TableEvent } from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { TableTypes } from "@/types/table/table-type"
import { getTableFunction } from "@/utils/get-product-table-function"
import { Product } from "@features/products/types"
import { Table } from "antd"

interface GlobalTableProps<T> {
  tableType: TableTypes
  tableStore: TableStore
  tableDataSource: TableDataSource<T>
  onEvent: (event: TableEvent<Product | string>) => void
}

export const GlobalTable = <T extends Product>({
  tableType,
  tableStore,
  tableDataSource,
  onEvent,
}: GlobalTableProps<T>) => {
  const columns = getTableFunction(tableType, tableStore, onEvent)

  return (
    <Table
      columns={columns}
      dataSource={tableDataSource.data}
      rowKey='id'
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Toplam ${total} kayıt`,
      }}
      scroll={{ x: 1200 }}
      loading={tableDataSource.isLoading}
    />
  )
}
