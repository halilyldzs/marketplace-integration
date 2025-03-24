import { TableEvent, TableEventTypes } from "@/types/table/table-event-types"
import { TableDataSource, TableStore } from "@/types/table/table-store"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import type { Product } from "@features/products/types"
import { Button, Space, Table } from "antd"
import { ColumnsType } from "antd/es/table"

type ProductTableProps<T> = {
  tableStore: TableStore
  tableDataSource: TableDataSource<T>
  handleEvent: (event: TableEvent<Product | string>) => void
}

const ProductTable = <T extends Product>({
  tableStore: { categories, brands },
  tableDataSource: { data, isLoading },
  handleEvent,
}: ProductTableProps<T>) => {
  const columns: ColumnsType<T> = [
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 120,
    },
    {
      title: "Barkod",
      dataIndex: "barcode",
      key: "barcode",
      width: 140,
      responsive: ["lg"],
    },
    {
      title: "Satış Fiyatı",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => `₺${price.toFixed(2)}`,
      filters: [
        { text: "0-100₺", value: "0-100" },
        { text: "100-500₺", value: "100-500" },
        { text: "500-1000₺", value: "500-1000" },
        { text: "1000₺ ve üzeri", value: "1000+" },
      ],
      onFilter: (value, record) => {
        const price = record.price
        switch (value) {
          case "0-100":
            return price >= 0 && price <= 100
          case "100-500":
            return price > 100 && price <= 500
          case "500-1000":
            return price > 500 && price <= 1000
          case "1000+":
            return price > 1000
          default:
            return true
        }
      },
    },
    {
      title: "Liste Fiyatı",
      dataIndex: "listPrice",
      key: "listPrice",
      width: 120,
      responsive: ["lg"],
      render: (listPrice: number) => `₺${listPrice.toFixed(2)}`,
    },
    {
      title: "KDV",
      dataIndex: "vat",
      key: "vat",
      width: 80,
      responsive: ["lg"],
      render: (vat: number) => `%${vat}`,
      filters: [
        { text: "%0", value: 0 },
        { text: "%1", value: 1 },
        { text: "%8", value: 8 },
        { text: "%18", value: 18 },
      ],
      onFilter: (value, record) => record.vat === value,
    },
    {
      title: "Desi",
      dataIndex: "deci",
      key: "deci",
      width: 80,
      responsive: ["lg"],
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      filters: [
        { text: "Stokta Yok", value: "0" },
        { text: "1-10", value: "1-10" },
        { text: "11-50", value: "11-50" },
        { text: "50+", value: "50+" },
      ],
      onFilter: (value, record) => {
        const stock = record.stock
        switch (value) {
          case "0":
            return stock === 0
          case "1-10":
            return stock > 0 && stock <= 10
          case "11-50":
            return stock > 10 && stock <= 50
          case "50+":
            return stock > 50
          default:
            return true
        }
      },
    },
    {
      title: "Kategori",
      dataIndex: "categoryId",
      key: "categoryId",
      responsive: ["md"],
      render: (categoryId: string) =>
        categories?.find((c) => c.id === categoryId)?.name || "-",
      filters:
        categories?.map((category) => ({
          text: category.name,
          value: category.id,
        })) || [],
      onFilter: (value, record) => record.categoryId === value,
    },
    {
      title: "Marka",
      dataIndex: "brandId",
      key: "brandId",
      responsive: ["md"],
      render: (brandId: string) =>
        brands?.find((b) => b.id === brandId)?.name || "-",
      filters:
        brands?.map((brand) => ({
          text: brand.name,
          value: brand.id,
        })) || [],
      onFilter: (value, record) => record.brandId === value,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (date: Date) => date.toLocaleString(),
    },
    {
      title: "İşlemler",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() =>
              handleEvent({
                type: TableEventTypes.EDIT,
                payload: record,
              })
            }
          />
          <Button
            type='text'
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              handleEvent({
                type: TableEventTypes.DELETE,
                payload: record.id,
              })
            }
          />
        </Space>
      ),
    },
  ]

  return (
    <Table<T>
      dataSource={data as T[]}
      columns={columns}
      rowKey='id'
      loading={isLoading}
      scroll={{ x: "max-content" }}
      pagination={false}
      locale={{
        emptyText: isLoading ? "Yükleniyor..." : "Ürün bulunamadı",
      }}
    />
  )
}

export default ProductTable
