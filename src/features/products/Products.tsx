import { GlobalTable } from "@/components/GlobalTable/GlobalTable"
import ProductFormModal from "@/features/products/components/ProductFormModal"
import { useBroadcast } from "@/hooks/useBroadcast"
import {
  FilterEventPayload,
  TableEvent,
  TableEventTypes,
} from "@/types/table/table-event-types"
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { brandsService } from "@features/brands/services/brands.service"
import { categoriesService } from "@features/categories/services/categories.service"
import type { GetProductsResponse } from "@features/products/services/products.service"
import { productsService } from "@features/products/services/products.service"
import type { Product } from "@features/products/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Input, Modal, Tooltip, Typography, message } from "antd"
import { useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import styles from "./Products.module.css"
import { getProductTableColumns } from "./consts/product-table-columns"

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
  })

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsService.getAll(),
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

      <GlobalTable<Product>
        columns={getProductTableColumns({
          onEvent: handleEvent,
          tableStore: {
            brands: brandsData?.brands || [],
            categories: categoriesData?.categories || [],
          },
        })}
        tableDataSource={{
          data: productsData?.products || [],
          isLoading: productsLoading,
        }}
        onEvent={handleEvent}
      />

      <ProductFormModal
        product={editingProduct}
        open={openModal}
        onCancel={() => {
          setOpenModal(false)
          setEditingProduct(null)
        }}
      />
    </div>
  )
}

export default Products
