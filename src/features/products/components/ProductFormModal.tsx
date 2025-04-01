import { brandsService } from "@/features/brands/services/brands.service"
import { categoriesService } from "@/features/categories/services/categories.service"
import { useBroadcast } from "@/hooks/useBroadcast"
import type {
  CreateProductDTO,
  Product,
  ProductFormValues,
  UpdateProductDTO,
} from "@features/products/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Modal, Typography, message } from "antd"
import type { FormInstance } from "antd/es/form"
import { useMemo, useRef } from "react"
import { GenericForm } from "../../../components/GenericForm"
import { getProductFormFields } from "../consts/product-form-fields"
import { productsService } from "../services/products.service"
import styles from "../styles/ProductForm.module.css"

const { Text } = Typography

type ProductFormModalProps = {
  product: Product | null
  open: boolean
  onCancel: () => void
}

const ProductFormModal = ({
  product,
  open,
  onCancel,
}: ProductFormModalProps) => {
  const formRef = useRef<FormInstance<ProductFormValues>>(null)
  const queryClient = useQueryClient()

  const { invalidateQueries } = useBroadcast()

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  })

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateProductDTO) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      invalidateQueries(["products"])
      message.success("Ürün başarıyla oluşturuldu")
      cancel()
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
      cancel()
    },
    onError: (error: Error) => {
      message.error(`Ürün güncellenemedi: ${error.message}`)
    },
  })

  const handleSubmit = (values: ProductFormValues) => {
    const productData = {
      ...values,
      images: [],
    }

    if (product) {
      updateMutation.mutate({ id: product.id, ...productData })
    } else {
      createMutation.mutate(productData)
    }
  }

  const fields = getProductFormFields({
    brands: brandsData?.brands || [],
    categories: categoriesData?.categories || [],
    formRef,
  })

  const cancel = () => {
    formRef.current?.resetFields()
    onCancel()
  }

  const submitButton = (
    <Button
      type='primary'
      size='large'
      htmlType='submit'
      loading={createMutation.isPending || updateMutation.isPending}>
      {product ? "Ürünü Güncelle" : "Ürün Oluştur"}
    </Button>
  )

  const cancelButton = (
    <Button
      size='large'
      onClick={cancel}>
      İptal
    </Button>
  )

  const initialValues = useMemo(
    () => (product ? getInitialValues(product) : undefined),
    [product]
  )

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <Text
            strong
            className={styles.modalTitleText}>
            {product ? "Ürünü Düzenle" : "Yeni Ürün Oluştur"}
          </Text>
        </div>
      }
      open={open}
      onCancel={cancel}
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
      <GenericForm<ProductFormValues>
        ref={formRef}
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitButton={submitButton}
        cancelButton={cancelButton}
        requiredMark='optional'
        className={styles.form}
      />
    </Modal>
  )
}

function getInitialValues(product: Product) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    listPrice: product.listPrice,
    sku: product.sku,
    barcode: product.barcode,
    vat: product.vat,
    deci: product.deci,
    stock: product.stock,
    categoryId: product.categoryId,
    brandId: product.brandId,
    images: product.images,
  }
}

export default ProductFormModal
