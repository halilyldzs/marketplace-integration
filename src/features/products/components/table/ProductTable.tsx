import { TableEvent } from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { Product } from "@features/products/types"
import { Table } from "antd"
import { getProductTableColumns } from "./consts/product-table-columns"

interface ProductTableProps<T> {
  tableStore: TableStore
  tableDataSource: TableDataSource<T>
  onEvent: (event: TableEvent<Product | string>) => void
}

export const ProductTable = <T extends Product>({
  tableStore,
  tableDataSource,
  onEvent,
}: ProductTableProps<T>) => {
  const columns = getProductTableColumns({
    onEvent,
    tableStore: {
      categories: tableStore.categories ?? [],
      brands: tableStore.brands ?? [],
    },
  })

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
