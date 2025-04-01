import { TableEventTypes } from "@/types/table/table-event-types"
import { TableColumnsProps } from "@/types/table/table-store"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Space, TableColumnsType } from "antd"
import { FieldValue } from "firebase/firestore"
import { Category } from "../types"

export const getCategoriesTableColumns = ({
  onEvent,
}: TableColumnsProps<Category>): TableColumnsType<Category> => [
  {
    title: "Ad",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    fixed: "left",
  },
  {
    title: "Slug",
    dataIndex: "slug",
    key: "slug",
    responsive: ["md"],
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    responsive: ["lg"],
  },
  {
    title: "Oluşturulma Tarihi",
    dataIndex: "createdAt",
    key: "createdAt",
    responsive: ["md"],
    render: (date: Date | FieldValue) =>
      date instanceof Date ? date.toLocaleDateString("tr-TR") : "-",
    sorter: (a, b) =>
      a.createdAt instanceof Date && b.createdAt instanceof Date
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : 0,
  },
  {
    title: "Güncellenme Tarihi",
    dataIndex: "updatedAt",
    key: "updatedAt",
    responsive: ["lg"],
    render: (date: Date | FieldValue) =>
      date instanceof Date ? date.toLocaleDateString("tr-TR") : "-",
    sorter: (a, b) =>
      a.updatedAt instanceof Date && b.updatedAt instanceof Date
        ? a.updatedAt.getTime() - b.updatedAt.getTime()
        : 0,
  },
  {
    title: "İşlemler",
    key: "actions",
    width: 100,
    fixed: "right",
    render: (_, record) => (
      <Space>
        <Button
          type='text'
          icon={<EditOutlined />}
          onClick={() =>
            onEvent({ type: TableEventTypes.EDIT, payload: record })
          }
        />
        <Button
          type='text'
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            onEvent({ type: TableEventTypes.DELETE, payload: record })
          }
        />
      </Space>
    ),
  },
]
