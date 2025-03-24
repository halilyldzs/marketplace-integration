import { getProductTableColumns } from "@/features/products/consts/product-table-columns"
import { TableEvent } from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { TableTypes } from "@/types/table/table-type"
import { Product } from "@features/products/types"
import { ColumnsType } from "antd/es/table"

export type GetTableFunction<T extends Product> = (
  tableType: TableTypes,
  tableStore: TableStore,
  tableDataSource: TableDataSource<T>
) => void

export const getTableFunction = <T extends Product>(
  tableType: TableTypes,
  tableStore: TableStore,
  onEvent: (event: TableEvent<T | string>) => void
): ColumnsType<T> => {
  switch (tableType) {
    case TableTypes.PRODUCT:
      return getProductTableColumns<T>({ onEvent, tableStore })

    default:
      return []
  }
}
