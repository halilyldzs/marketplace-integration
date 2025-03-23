import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { categoriesService } from "@features/categories/services/categories.service"
import type { Category } from "@features/categories/types"
import type { GetProductsResponse } from "@features/products/services/products.service"
import { productsService } from "@features/products/services/products.service"
import type {
  CreateProductDTO,
  Product,
  ProductFormValues,
  UpdateProductDTO,
} from "@features/products/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { useCallback, useRef, useState } from "react"
import styles from "./Products.module.css"

const { Text } = Typography

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm<ProductFormValues>()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const searchTimeout = useRef<NodeJS.Timeout>()

  // Queries
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
    initialData: {
      categories: [],
      total: 0,
      hasMore: false,
      lastVisible: null,
    },
  })

  const { data: productsData, isLoading: productsLoading } =
    useQuery<GetProductsResponse>({
      queryKey: ["products", searchTerm],
      queryFn: () =>
        productsService.getAll({
          searchTerm,
          pageSize: 10,
          orderByField: "createdAt",
          orderDirection: "desc",
        }),

      initialData: {
        products: [],
        total: 0,
        hasMore: false,
        lastVisible: null,
      },
    })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateProductDTO) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla oluşturuldu")
      setIsModalOpen(false)
      form.resetFields()
    },
    onError: (error: Error) => {
      message.error(`Ürün oluşturulamadı: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductDTO) => productsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla güncellendi")
      setIsModalOpen(false)
      setEditingProduct(null)
      form.resetFields()
    },
    onError: (error: Error) => {
      message.error(`Ürün güncellenemedi: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla silindi")
    },
    onError: (error: Error) => {
      message.error(`Ürün silinemedi: ${error.message}`)
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

  const handleLoadMore = useCallback(async () => {
    if (!lastVisible) return

    const moreProducts = await productsService.loadMore(lastVisible, {
      searchTerm,
      pageSize: 10,
      orderByField: "createdAt",
      orderDirection: "desc",
    })

    setLastVisible(moreProducts.lastVisible)
    queryClient.setQueryData<GetProductsResponse>(
      ["products", searchTerm],
      (oldData) => {
        if (!oldData) return moreProducts
        return {
          ...moreProducts,
          products: [...oldData.products, ...moreProducts.products],
          total: oldData.total,
        }
      }
    )
  }, [lastVisible, queryClient, searchTerm])

  const handleSubmit = (values: ProductFormValues) => {
    console.log("Form values:", values)
    const productData = {
      ...values,
      images: [], // Şimdilik boş array
    }
    console.log("Product data to be sent:", productData)

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...productData })
    } else {
      createMutation.mutate(productData)
    }
  }

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Ürünü silmek istediğinize emin misiniz?",
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
  const columns: ColumnsType<Product> = [
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
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₺${price.toFixed(2)}`,
    },
    {
      title: "Kategori",
      dataIndex: "categoryId",
      key: "categoryId",
      responsive: ["md"],
      render: (categoryId: string) =>
        categoriesData?.categories.find((c) => c.id === categoryId)?.name ||
        "-",
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
            <h1 className={styles.title}>Ürünler</h1>
            <Text type='secondary'>Ürün listesi ve yönetimi</Text>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
              placeholder='Ürün ara...'
              variant='borderless'
              allowClear
              onChange={handleSearch}
              value={inputValue}
              className={styles.searchInput}
            />
          </div>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null)
              form.resetFields()
              setIsModalOpen(true)
            }}
            size='large'>
            Yeni Ürün
          </Button>
        </div>
      </div>

      <Table<Product>
        dataSource={productsData?.products || []}
        columns={columns}
        rowKey='id'
        loading={productsLoading && !productsData?.products.length}
        scroll={{ x: "max-content" }}
        pagination={false}
        locale={{
          emptyText: productsLoading ? "Yükleniyor..." : "Ürün bulunamadı",
        }}
      />

      {productsData?.hasMore && (
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
              {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Oluştur"}
            </Text>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingProduct(null)
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
        <Form
          form={form}
          onFinish={handleSubmit}
          layout='vertical'
          className={styles.form}
          requiredMark='optional'>
          <Form.Item
            name='name'
            label='Ürün Adı'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen ürün adı girin" },
              { type: "string" },
            ]}>
            <Input
              size='large'
              placeholder='Ürün adını girin'
              maxLength={50}
              showCount
            />
          </Form.Item>

          <Form.Item
            name='description'
            label='Açıklama'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen açıklama girin" },
              { type: "string" },
            ]}>
            <Input.TextArea
              size='large'
              placeholder='Ürün açıklamasını girin'
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name='price'
            label='Fiyat'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen fiyat girin" },
              { type: "number", message: "Lütfen geçerli bir fiyat girin" },
            ]}>
            <InputNumber<number>
              size='large'
              className={styles.priceInput}
              min={0}
              step={0.01}
              precision={2}
              prefix='₺'
              placeholder='0.00'
              stringMode={false}
              formatter={(value) => {
                if (value === null || value === undefined) return ""
                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }}
              parser={(value) => {
                if (!value || value === "₺") return 0
                const cleanValue = value.replace(/[^\d.]/g, "")
                const firstDotIndex = cleanValue.indexOf(".")
                const sanitizedValue =
                  firstDotIndex === -1
                    ? cleanValue
                    : cleanValue.slice(0, firstDotIndex + 1) +
                      cleanValue.slice(firstDotIndex + 1).replace(/\./g, "")
                const parsed = parseFloat(sanitizedValue)
                return isNaN(parsed) ? 0 : parsed
              }}
              onInput={(value: string) => {
                if (!/^\d*\.?\d*$/.test(value)) {
                  return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1")
                }
                return value
              }}
              controls={false}
            />
          </Form.Item>

          <Form.Item
            name='categoryId'
            label='Kategori'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen kategori seçin" },
              { type: "string" },
            ]}>
            <Select
              size='large'
              placeholder='Kategori seçin'
              options={categoriesData?.categories.map((category: Category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </Form.Item>

          <Form.Item className={styles.formActions}>
            <Space>
              <Button
                size='large'
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingProduct(null)
                  form.resetFields()
                }}>
                İptal
              </Button>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                loading={createMutation.isPending || updateMutation.isPending}>
                {editingProduct ? "Değişiklikleri Kaydet" : "Ürün Oluştur"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products
