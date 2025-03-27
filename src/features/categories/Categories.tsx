import { GlobalTable } from "@/components/GlobalTable/GlobalTable"
import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { TableTypes } from "@/types/table/table-type"
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import CategoryForm from "@features/categories/components/CategoryForm"
import type { GetCategoriesParams } from "@features/categories/services/categories.service"
import { categoriesService } from "@features/categories/services/categories.service"
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@features/categories/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Modal, Typography, message } from "antd"
import type { TablePaginationConfig } from "antd/es/table"
import { FirebaseError } from "firebase/app"
import { useRef, useState } from "react"
import styles from "./Categories.module.css"

const { Text } = Typography

const Categories = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const searchTimeout = useRef<NodeJS.Timeout>()

  const { data: categoriesData, isLoading } = useQuery({
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
    mutationFn: () =>
      Promise.all(
        selectedCategories.map((category) =>
          categoriesService.delete(category.id)
        )
      ),
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

  const handleDelete = () => {
    Modal.confirm({
      title: `${selectedCategories.length} kategoriyi silmek istediğinizden emin misiniz?`,
      content: "Bu işlem geri alınamaz",
      okText: "Sil",
      cancelText: "İptal",
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(),
    })
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

  const handleEvent = (
    event: TableEvent<Category | string | FilterEventPayload>
  ) => {
    switch (event.type) {
      case TableEventTypes.EDIT:
        handleEdit(event.payload as Category)
        break
      case TableEventTypes.DELETE:
        setSelectedCategories([event.payload as Category])
        handleDelete()
        break
    }
  }

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

      <GlobalTable<Category>
        tableType={TableTypes.CATEGORIES}
        tableStore={{
          categories: categoriesData?.categories || [],
        }}
        tableDataSource={{
          data: categoriesData?.categories || [],
          isLoading,
        }}
        onEvent={handleEvent}
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
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
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
