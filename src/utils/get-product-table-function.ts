import { getProductTableColumns } from "@/features/products/components/table/consts/product-table-columns"
import { TableEvent } from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { TableTypes } from "@/types/table/table-type"
import { Product } from "@features/products/types"
import { ColumnsType } from "antd/es/table"

export type GetTableFunction<T> = (
  tableType: TableTypes,
  tableStore: TableStore,
  tableDataSource: TableDataSource<T>
) => void

export const getTableFunction = (
  tableType: TableTypes,
  tableStore: TableStore,
  onEvent: (event: TableEvent<Product | string>) => void
): ColumnsType<Product> => {
  switch (tableType) {
    case TableTypes.PRODUCT:
      return getProductTableColumns({ onEvent, tableStore })

    default:
      return []
  }
}
