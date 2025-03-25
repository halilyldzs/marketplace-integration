import { GlobalTable } from "@/components/GlobalTable/GlobalTable"
import { useBroadcast } from "@/hooks/useBroadcast"
import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { TableTypes } from "@/types/table/table-type"
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { brandsService } from "@features/brands/services/brands.service"
import { categoriesService } from "@features/categories/services/categories.service"
import ProductForm from "@features/products/components/ProductForm"
import type { GetProductsResponse } from "@features/products/services/products.service"
import { productsService } from "@features/products/services/products.service"
import type {
  CreateProductDTO,
  Product,
  ProductFormValues,
  UpdateProductDTO,
} from "@features/products/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Modal, Tooltip, Typography, message } from "antd"
import { useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import styles from "./Products.module.css"

const { Text } = Typography

const Products = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  const { invalidateQueries } = useBroadcast()

  const [searchTerm, setSearchTerm] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const searchTimeout = useRef<NodeJS.Timeout>()

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsService.getAll(),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const { data: productsData, isLoading: productsLoading } =
    useQuery<GetProductsResponse>({
      queryKey: ["products", searchTerm, searchParams.toString()],
      queryFn: () =>
        productsService.getAll({
          searchTerm,
          pageSize: Number(searchParams.get("pageSize")) || 10,
          page: Number(searchParams.get("page")) || 1,
          orderByField:
            (searchParams.get("orderByField") as keyof Product) || "createdAt",
          orderDirection:
            (searchParams.get("orderDirection") as "asc" | "desc") || "desc",
          ...Object.fromEntries(
            Array.from(searchParams.entries()).filter(
              ([key]) =>
                ![
                  "page",
                  "pageSize",
                  "orderByField",
                  "orderDirection",
                ].includes(key)
            )
          ),
        }),
      initialData: undefined,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    })

  const createMutation = useMutation({
    mutationFn: (data: CreateProductDTO) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      invalidateQueries(["products"])
      message.success("Ürün başarıyla oluşturuldu")
      setEditingProduct(null)
      setOpenModal(false)
    },
    onError: (error: Error) => {
      message.error(`Ürün oluşturulamadı: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductDTO) => productsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      invalidateQueries(["products"])
      message.success("Ürün başarıyla güncellendi")
      setEditingProduct(null)
      setOpenModal(false)
    },
    onError: (error: Error) => {
      message.error(`Ürün güncellenemedi: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      Promise.all(
        selectedProducts.map((product) => productsService.delete(product.id))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      invalidateQueries(["products"])
      message.success(`${selectedProducts.length} ürün başarıyla silindi`)
      setSelectedProducts([])
    },
    onError: (error: Error) => {
      message.error(
        `${selectedProducts.length} ürün silinemedi: ${error.message}`
      )
    },
  })

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
    event: TableEvent<Product | string | FilterEventPayload>
  ) => {
    switch (event.type) {
      case TableEventTypes.EDIT:
        setEditingProduct(event.payload as Product)
        setOpenModal(true)
        break
      case TableEventTypes.DELETE:
        setSelectedProducts([event.payload as Product])
        handleDelete()
        break
      case TableEventTypes.SELECT:
        setSelectedProducts(event.payload as Product[])
        break
      case TableEventTypes.FILTER:
        // TODO: Filter event is handled by URL params
        break
    }
  }

  const handleSubmit = (values: ProductFormValues) => {
    const productData = {
      ...values,
      images: [],
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...productData })
    } else {
      createMutation.mutate(productData)
    }
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `Seçilen ${selectedProducts.length} ürünü silmek istediğinize emin misiniz?`,
      content: "Bu işlem geri alınamaz.",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        deleteMutation.mutate()
      },
    })
  }

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
          <div className={styles.buttonContainer}>
            <Tooltip title='Toplu Ürün Silmek için seçiniz'>
              <Button
                disabled={selectedProducts.length === 0}
                type='primary'
                size='large'
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}>
                Toplu Ürün Sil
              </Button>
            </Tooltip>

            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingProduct(null)
                setOpenModal(true)
              }}
              size='large'>
              Yeni Ürün
            </Button>
          </div>
        </div>
      </div>

      <GlobalTable
        tableType={TableTypes.PRODUCT}
        tableStore={{
          categories: categoriesData?.categories || [],
          brands: brandsData?.brands || [],
        }}
        tableDataSource={{
          data: productsData?.products || [],
          isLoading: productsLoading,
        }}
        onEvent={handleEvent}
      />

      <ProductForm
        product={editingProduct}
        open={openModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        categories={categoriesData?.categories || []}
        brands={brandsData?.brands || []}
        onCancel={() => {
          setOpenModal(false)
          setEditingProduct(null)
        }}
      />
    </div>
  )
}
export default Products
