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
import { useRef } from "react"
import { GenericForm } from "../../../components/GenericForm"
import { getProductFormFields } from "../consts/product-form-fields"
import styles from "../Products.module.css"
import { productsService } from "../services/products.service"

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
      onCancel()
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
      onCancel()
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
      onClick={onCancel}>
      İptal
    </Button>
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
      onCancel={onCancel}
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
        defaultValues={product || undefined}
        submitButton={submitButton}
        cancelButton={cancelButton}
        requiredMark='optional'
        className={styles.form}
      />
    </Modal>
  )
}

export default ProductFormModal
