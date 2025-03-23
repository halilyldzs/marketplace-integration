import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import BrandForm from "@features/brands/components/BrandForm"
import { brandsService } from "@features/brands/services/brands.service"
import type {
  Brand,
  CreateBrandDTO,
  GetBrandsResponse,
  UpdateBrandDTO,
} from "@features/brands/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
  message,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { useRef, useState } from "react"
import styles from "./Brands.module.css"

const { Text } = Typography

const Brands = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const searchTimeout = useRef<NodeJS.Timeout>()

  // Queries
  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands", searchTerm],
    queryFn: () =>
      brandsService.getAll({
        searchTerm,
        pageSize: 10,
        orderByField: "createdAt",
        orderDirection: "desc",
      }),
    staleTime: 1000 * 60, // 1 minute
    initialData: {
      brands: [],
      total: 0,
      hasMore: false,
      lastVisible: null,
    },
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateBrandDTO) => brandsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      message.success("Marka başarıyla oluşturuldu")
      setIsModalOpen(false)
      form.resetFields()
    },
    onError: (error: Error) => {
      message.error(`Marka oluşturulamadı: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateBrandDTO) => brandsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      message.success("Marka başarıyla güncellendi")
      setIsModalOpen(false)
      setEditingBrand(null)
      form.resetFields()
    },
    onError: (error: Error) => {
      message.error(`Marka güncellenemedi: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => brandsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      message.success("Marka başarıyla silindi")
    },
    onError: (error: Error) => {
      message.error(`Marka silinemedi: ${error.message}`)
    },
  })

  // Event handlers
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

  const handleLoadMore = async () => {
    if (!lastVisible) return

    const moreBrands = await brandsService.loadMore(lastVisible, {
      searchTerm,
      pageSize: 10,
      orderByField: "createdAt",
      orderDirection: "desc",
    })

    setLastVisible(moreBrands.lastVisible)
    queryClient.setQueryData(
      ["brands", searchTerm],
      (oldData: GetBrandsResponse | undefined) => {
        if (!oldData) return moreBrands
        return {
          ...moreBrands,
          brands: [...oldData.brands, ...moreBrands.brands],
          total: oldData.total,
        }
      }
    )
  }

  const handleSubmit = (values: { name: string; description?: string }) => {
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, ...values })
    } else {
      createMutation.mutate(values)
    }
  }

  const handleEdit = (record: Brand) => {
    setEditingBrand(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Markayı silmek istediğinize emin misiniz?",
      content: "Bu işlem geri alınamaz.",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        deleteMutation.mutate(id)
      },
    })
  }

  // Table columns
  const columns: ColumnsType<Brand> = [
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
            <h1 className={styles.title}>Markalar</h1>
            <Text type='secondary'>Marka listesi ve yönetimi</Text>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
              placeholder='Marka ara...'
              onChange={handleSearch}
              value={inputValue}
              className={styles.searchInput}
            />
          </div>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBrand(null)
              form.resetFields()
              setIsModalOpen(true)
            }}
            size='large'>
            Yeni Marka
          </Button>
        </div>
      </div>

      <Table<Brand>
        dataSource={brandsData?.brands || []}
        columns={columns}
        rowKey='id'
        loading={brandsLoading && !brandsData?.brands.length}
        scroll={{ x: "max-content" }}
        pagination={false}
        locale={{
          emptyText: brandsLoading ? "Yükleniyor..." : "Marka bulunamadı",
        }}
      />

      {brandsData?.hasMore && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button onClick={handleLoadMore}>Daha Fazla Yükle</Button>
        </div>
      )}

      <Modal
        title={
          <div className={styles.modalTitle}>
            <Text
              strong
              className={styles.modalTitleText}>
              {editingBrand ? "Markayı Düzenle" : "Yeni Marka Oluştur"}
            </Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingBrand(null)
          form.resetFields()
        }}
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
        <BrandForm
          form={form}
          onFinish={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingBrand(null)
            form.resetFields()
          }}
          initialValues={editingBrand || undefined}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default Brands
