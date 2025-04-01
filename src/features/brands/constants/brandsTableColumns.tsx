import { TableEventTypes } from "@/types/table/table-event-types"
import { TableColumnsProps } from "@/types/table/table-store"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Space, TableColumnsType } from "antd/lib"
import { Brand } from "../types"

export const getBrandsTableColumns = <T extends Brand>({
  onEvent,
}: TableColumnsProps<T>): TableColumnsType<T> => {
  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 220,
      responsive: ["lg"],
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
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
      render: (_: unknown, record: Brand) => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() =>
              onEvent({
                type: TableEventTypes.EDIT,
                payload: record as T,
              })
            }
          />
          <Button
            type='text'
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              onEvent({
                type: TableEventTypes.DELETE,
                payload: record as T,
              })
            }
          />
        </Space>
      ),
    },
  ]
}
