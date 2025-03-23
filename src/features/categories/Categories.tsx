import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
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
import { useRef, useState } from "react"
import styles from "./Categories.module.css"

const { Text } = Typography

const Categories = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)

  const searchTimeout = useRef<NodeJS.Timeout>()

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value)
    }, 500)
  }

  const columns: ColumnsType<Category> = [
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Kategoriler</h1>
            <Text type='secondary'>Kategori listesi ve yönetimi</Text>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
              placeholder='Kategori ara...'
              bordered={false}
              allowClear
              onChange={handleSearch}
              value={inputValue}
              className={styles.searchInput}
            />
          </div>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size='large'>
            Yeni Kategori
          </Button>
        </div>
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
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          <div className={styles.modalTitle}>
            <Text
              strong
              className={styles.modalTitleText}>
              {selectedCategory ? "Kategori Düzenle" : "Yeni Kategori Oluştur"}
            </Text>
          </div>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={{ xs: "90%", sm: 520 }}
        style={{ padding: "24px" }}>
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
