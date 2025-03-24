import { productsService } from "@/features/products/services/products.service"
import { GetProductsResponse } from "@/features/products/types"
import { useQuery } from "@tanstack/react-query"
import type { FormInstance } from "antd"
import { Button, Form, Input, Select, Space } from "antd"
import { useEffect, useState } from "react"
import styles from "../Orders.module.css"

export interface OrderFormValues {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: string[]
  notes?: string
}

interface OrderFormProps {
  form: FormInstance<OrderFormValues>
  onSubmit: (values: OrderFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

const OrderForm = ({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
}: OrderFormProps) => {
  useEffect(() => {
    return () => {
      form.resetFields()
    }
  }, [form])

  const [productSearchTerm, setProductSearchTerm] = useState("")

  const { data: productsData } = useQuery<GetProductsResponse>({
    queryKey: ["products", productSearchTerm],
    queryFn: () =>
      productsService.getAll({
        searchTerm: productSearchTerm,
        pageSize: 10,
        orderByField: "createdAt",
        orderDirection: "desc",
      }),
  })

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout='vertical'
      className={styles.form}
      requiredMark='optional'>
      <Form.Item
        name='customerName'
        label='Müşteri Adı'
        className={`${styles.formItem} ${styles.fullWidth}`}
        rules={[
          { required: true, message: "Lütfen müşteri adı girin" },
          { type: "string" },
          { whitespace: true, message: "Müşteri adı boşluk olamaz" },
          { min: 3, message: "Müşteri adı en az 3 karakter olmalıdır" },
        ]}>
        <Input
          size='middle'
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
          size='middle'
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
          size='middle'
          placeholder='5XX XXX XX XX'
        />
      </Form.Item>

      <Form.Item
        name='shippingAddress'
        label='Teslimat Adresi'
        className={`${styles.formItem} ${styles.fullWidth}`}
        rules={[
          { required: true, message: "Lütfen teslimat adresi girin" },
          { type: "string" },
          { whitespace: true, message: "Teslimat adresi boşluk olamaz" },
          { min: 10, message: "Teslimat adresi en az 10 karakter olmalıdır" },
        ]}>
        <Input.TextArea
          size='middle'
          placeholder='Teslimat adresini girin'
          rows={3}
          maxLength={200}
          showCount
        />
      </Form.Item>

      <Form.Item
        name='items'
        label='Sipariş Ürünleri'
        className={`${styles.formItem} ${styles.fullWidth}`}
        rules={[
          { required: true, message: "Lütfen en az bir ürün ekleyin" },
          { type: "array", min: 1, message: "En az bir ürün eklemelisiniz" },
        ]}>
        <Select
          mode='multiple'
          placeholder='Ürün seçin'
          showSearch
          onSearch={setProductSearchTerm}
          filterOption={false}
          options={productsData?.products?.map((product) => ({
            label: `${product.name} (${product.sku})`,
            value: product.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name='notes'
        label='Sipariş Notları'
        className={`${styles.formItem} ${styles.fullWidth}`}>
        <Input.TextArea
          size='middle'
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
            Sipariş Oluştur
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default OrderForm
