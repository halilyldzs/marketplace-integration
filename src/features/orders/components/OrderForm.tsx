import { productsService } from "@/features/products/services/products.service"
import { GetProductsResponse } from "@/features/products/types"
import { useQuery } from "@tanstack/react-query"

import { Button, Form, Input, InputNumber, Select, Space } from "antd"
import { useEffect, useState } from "react"
import styles from "../Orders.module.css"
import { Order, OrderItem } from "../types"

export interface OrderFormValues {
  id?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  selectedProductIds: string[]
  items: OrderItem[]
  totalAmount: number
  notes?: string
}

interface OrderFormProps {
  order?: Order
  onSubmit: (values: OrderFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  isEditing?: boolean
}

const OrderForm = ({
  order,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing = false,
}: OrderFormProps) => {
  const [form] = Form.useForm<OrderFormValues>()
  const [productSearchTerm, setProductSearchTerm] = useState("")

  const { data: productsData } = useQuery<GetProductsResponse>({
    queryKey: ["products", productSearchTerm],
    queryFn: () =>
      productsService.getAll({
        searchTerm: productSearchTerm,
        pageSize: 100,
        orderByField: "createdAt",
        orderDirection: "desc",
        searchFields: productSearchTerm
          ? ["name", "sku", "barcode", "id"]
          : undefined,
      }),
  })

  useEffect(() => {
    if (isEditing && order) {
      const selectedProductIds = order.items.map((item) => item.productId)
      form.setFieldsValue({
        ...order,
        selectedProductIds,
      })
    }
    return () => {
      form.resetFields()
    }
  }, [isEditing, order, form])

  const handleSubmit = (values: OrderFormValues) => {
    const selectedProducts =
      productsData?.products?.filter((product) =>
        values.selectedProductIds.includes(product.id)
      ) || []

    // Mevcut siparişin ürünlerini koru
    const existingItems = order?.items || []

    // Yeni seçilen ürünler için OrderItem nesneleri oluştur
    const newItems: OrderItem[] = values.selectedProductIds
      .map((productId) => {
        // Eğer ürün zaten varsa, mevcut OrderItem'ı kullan
        const existingItem = existingItems.find(
          (item) => item.productId === productId
        )
        if (existingItem) {
          return existingItem
        }

        // Yeni ürün için OrderItem oluştur
        const product = selectedProducts.find((p) => p.id === productId)
        if (!product) return null

        return {
          id: +new Date(),
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          total: product.price,
        }
      })
      .filter((item): item is OrderItem => item !== null)

    onSubmit({
      ...values,
      items: newItems,
    })
  }

  return (
    <div className={styles.formContainer}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout='vertical'
        className={styles.form}
        requiredMark='optional'>
        <div className={styles.formGrid}>
          <Form.Item
            name='customerName'
            label='Müşteri Adı'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen müşteri adı girin" },
              { type: "string" },
              { whitespace: true, message: "Müşteri adı boşluk olamaz" },
              { min: 3, message: "Müşteri adı en az 3 karakter olmalıdır" },
            ]}>
            <Input
              size='large'
              placeholder='Müşteri adını girin'
              maxLength={50}
              showCount
            />
          </Form.Item>

          <Form.Item
            name='customerEmail'
            label='E-posta'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen e-posta adresi girin" },
              { type: "email", message: "Geçerli bir e-posta adresi girin" },
            ]}>
            <Input
              size='large'
              placeholder='ornek@email.com'
            />
          </Form.Item>

          <Form.Item
            name='customerPhone'
            label='Telefon'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen telefon numarası girin" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Geçerli bir telefon numarası girin",
              },
            ]}>
            <Input
              size='large'
              placeholder='5XX XXX XX XX'
            />
          </Form.Item>

          <Form.Item
            name='totalAmount'
            label='Toplam Tutar'
            className={styles.formItem}
            rules={[
              { required: true, message: "Lütfen toplam tutarı girin" },
              {
                type: "number",
                min: 0,
                message: "Toplam tutar 0'dan küçük olamaz",
              },
            ]}>
            <InputNumber
              size='large'
              style={{ width: "100%" }}
              placeholder='0.00'
              formatter={(value) =>
                `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/₺\s?|(,*)/g, "")}
              precision={2}
            />
          </Form.Item>
        </div>

        <Form.Item
          name='shippingAddress'
          label='Teslimat Adresi'
          className={styles.formItem}
          rules={[
            { required: true, message: "Lütfen teslimat adresi girin" },
            { type: "string" },
            { whitespace: true, message: "Teslimat adresi boşluk olamaz" },
            { min: 10, message: "Teslimat adresi en az 10 karakter olmalıdır" },
          ]}>
          <Input.TextArea
            size='large'
            placeholder='Teslimat adresini girin'
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          name='selectedProductIds'
          label='Sipariş Ürünleri'
          className={styles.formItem}
          rules={[
            { required: true, message: "Lütfen en az bir ürün ekleyin" },
            { type: "array", min: 1, message: "En az bir ürün eklemelisiniz" },
          ]}>
          <Select
            mode='multiple'
            size='large'
            placeholder='Ürün adı, stok kodu veya barkod ile arayın...'
            showSearch
            onSearch={setProductSearchTerm}
            filterOption={false}
            options={productsData?.products?.map((product) => ({
              key: product.id,
              label: `${product.name} (SKU: ${product.sku}, Barkod: ${product.barcode})`,
              value: product.id,
            }))}
            loading={!productsData}
          />
        </Form.Item>

        <Form.Item
          name='notes'
          label='Sipariş Notları'
          className={styles.formItem}>
          <Input.TextArea
            size='large'
            placeholder='Sipariş notlarını girin'
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item className={styles.formActions}>
          <Space>
            <Button
              size='large'
              onClick={onCancel}>
              İptal
            </Button>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              loading={isSubmitting}>
              {isEditing ? "Güncelle" : "Oluştur"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default OrderForm
