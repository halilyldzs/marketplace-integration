import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Button, Space, Table, message } from "antd"
import type { ColumnsType } from "antd/es/table"
import { categoriesService } from "./services/categories.service"
import type { Category } from "./types"

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  })

  const handleEdit = (record: Category) => {
    // TODO: Edit modal'ı açılacak
    console.log("Edit", record)
  }

  const handleDelete = async (id: string) => {
    try {
      await categoriesService.delete(id)
      message.success("Kategori başarıyla silindi")
    } catch (err) {
      console.error("Kategori silme hatası:", err)
      message.error("Kategori silinirken bir hata oluştu")
    }
  }

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => date.toLocaleDateString("tr-TR"),
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    {
      title: "Güncellenme Tarihi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: Date) => date.toLocaleDateString("tr-TR"),
      sorter: (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type='text'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <h1>Kategoriler</h1>
        <Button type='primary'>Yeni Kategori</Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={isLoading}
        rowKey='id'
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} kategori`,
        }}
      />
    </div>
  )
}

export default Categories
