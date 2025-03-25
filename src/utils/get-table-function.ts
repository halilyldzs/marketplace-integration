import { getBrandsTableColumns } from "@/features/brands/consts/brandsTableColumns"
import { Brand } from "@/features/brands/types"
import { getProductTableColumns } from "@/features/products/consts/product-table-columns"
import { Product } from "@/features/products/types"
import { TableBase } from "@/types/table/table-base"
import { TableEvent } from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { TableTypes } from "@/types/table/table-type"
import { ColumnsType } from "antd/es/table"

export type GetTableFunction<T> = (
  tableType: TableTypes,
  tableStore: TableStore,
  tableDataSource: TableDataSource<T>
) => void

export const getTableFunction = <T extends TableBase>(
  tableType: TableTypes,
  tableStore: TableStore,
  onEvent: (event: TableEvent<T | string>) => void
): ColumnsType<T> => {
  switch (tableType) {
    case TableTypes.PRODUCT:
      return getProductTableColumns({
        onEvent: onEvent as (event: TableEvent<Product | string>) => void,
        tableStore,
      }) as ColumnsType<T>
    case TableTypes.BRAND:
      return getBrandsTableColumns({
        onEvent: onEvent as (event: TableEvent<Brand | string>) => void,
        tableStore,
      }) as ColumnsType<T>
    default:
      return []
  }
}
