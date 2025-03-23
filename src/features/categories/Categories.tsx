import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import CategoryForm from "@features/categories/components/CategoryForm"
import type { GetCategoriesParams } from "@features/categories/services/categories.service"
import { categoriesService } from "@features/categories/services/categories.service"
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@features/categories/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Modal, Space, Table, Typography, message } from "antd"
import type { ColumnsType, TablePaginationConfig } from "antd/es/table"
import { FirebaseError } from "firebase/app"
import {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from "firebase/firestore"
import { useState } from "react"

const { Text } = Typography

const Categories = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: [
      "categories",
      pagination.current,
      pagination.pageSize,
      searchTerm,
    ],
    queryFn: async () => {
      const params: GetCategoriesParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        orderByField: "createdAt",
        orderDirection: "desc",
        searchTerm: searchTerm || undefined,
      }

      const result = await categoriesService.getAll(params)
      setLastVisible(result.lastVisible)
      setPagination((prev) => ({ ...prev, total: result.total }))
      return result
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDTO) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      message.success("Kategori eklendi")
      handleModalClose()
    },
    onError: (error: FirebaseError) => {
      console.error("Category creation error details:", error)
      message.error("Kategori eklenirken bir sorun oluştu")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryDTO) => categoriesService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      message.success("Kategori güncellendi")
      handleModalClose()
    },
    onError: (error) => {
      console.error("Category update error details:", error)
      message.error("Kategori güncellenirken bir sorun oluştu")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      message.success("Kategori silindi")
    },
    onError: (error) => {
      console.error("Category deletion error details:", error)
      message.error("Kategori silinirken bir sorun oluştu")
    },
  })

  const handleSubmit = async (values: CreateCategoryDTO) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ ...values, id: selectedCategory.id })
      } else {
        await createMutation.mutateAsync(values)
      }
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Kategoriyi silmek istediğinizden emin misiniz?",
      content: "Bu işlem geri alınamaz",
      okText: "Sil",
      cancelText: "İptal",
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(id),
    })
  }

  const handleTableChange = async (newPagination: TablePaginationConfig) => {
    if (newPagination.current! > pagination.current!) {
      // Next page
      const params: Omit<GetCategoriesParams, "page"> = {
        pageSize: pagination.pageSize,
        orderByField: "createdAt",
        orderDirection: "desc",
        searchTerm: searchTerm || undefined,
      }

      const result = await categoriesService.loadMore(lastVisible, params)
      setLastVisible(result.lastVisible)
      setPagination((prev) => ({
        ...prev,
        current: newPagination.current,
      }))

      // Update cache manually
      queryClient.setQueryData(
        ["categories", newPagination.current, pagination.pageSize, searchTerm],
        result
      )
    } else {
      // Previous page or page size change
      setPagination(newPagination)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination((prev) => ({ ...prev, current: 1 }))
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
          alignItems: "center",
        }}>
        <h1 style={{ margin: 0 }}>Kategoriler</h1>
        <Space>
          <Input.Search
            placeholder='Kategori ara...'
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size='large'>
            Yeni Kategori
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data?.categories}
        loading={isLoading}
        rowKey='id'
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} kategori`,
        }}
        onChange={(newPagination) => handleTableChange(newPagination)}
      />

      <Modal
        title={
          <div
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 24px",
              margin: "-20px -24px 20px",
            }}>
            <Text
              strong
              style={{ fontSize: 18 }}>
              {selectedCategory ? "Kategori Düzenle" : "Yeni Kategori Oluştur"}
            </Text>
          </div>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={520}
        styles={{
          body: {
            padding: "24px",
          },
        }}>
        <CategoryForm
          initialValues={selectedCategory || undefined}
          onSubmit={handleSubmit}
          onCancel={handleModalClose}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default Categories
