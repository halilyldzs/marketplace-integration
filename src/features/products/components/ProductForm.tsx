import type { Brand } from "@features/brands/types"
import type { Category } from "@features/categories/types"
import type { ProductFormValues } from "@features/products/types"
import type { FormInstance } from "antd"
import { Button, Form, Input, InputNumber, Select, Space } from "antd"
import { useEffect } from "react"
import styles from "../Products.module.css"

interface ProductFormProps {
  form: FormInstance<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  editMode: boolean
  categories?: Category[]
  brands?: Brand[]
}

const ProductForm = ({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  editMode,
  categories = [],
  brands = [],
}: ProductFormProps) => {
  useEffect(() => {
    return () => {
      form.resetFields()
    }
  }, [form])

  return (
    <Form
      form={form}
      onFinish={onSubmit}
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
        label='Satış Fiyatı'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen satış fiyatı girin" },
          { type: "number", message: "Lütfen geçerli bir fiyat girin" },
        ]}>
        <InputNumber<number>
          className={styles.priceInput}
          size='large'
          min={0}
          step={0.01}
          precision={2}
          prefix='₺'
          placeholder='0.00'
          formatter={(value) => {
            if (value === undefined || value === null) return ""
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }}
          parser={(value) => {
            const parsed = parseFloat(value!.replace(/[^\d.]/g, ""))
            return isNaN(parsed) ? 0 : parsed
          }}
          controls={false}
        />
      </Form.Item>

      <Form.Item
        name='listPrice'
        label='Liste Fiyatı'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen liste fiyatı girin" },
          { type: "number", message: "Lütfen geçerli bir fiyat girin" },
        ]}>
        <InputNumber<number>
          className={styles.priceInput}
          size='large'
          min={0}
          step={0.01}
          precision={2}
          prefix='₺'
          placeholder='0.00'
          formatter={(value) => {
            if (value === undefined || value === null) return ""
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }}
          parser={(value) => {
            const parsed = parseFloat(value!.replace(/[^\d.]/g, ""))
            return isNaN(parsed) ? 0 : parsed
          }}
          controls={false}
        />
      </Form.Item>

      <Form.Item
        name='sku'
        label='Stok Kodu (SKU)'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen stok kodu girin" },
          {
            type: "string",
            min: 3,
            message: "Stok kodu en az 3 karakter olmalıdır",
          },
        ]}>
        <Input
          size='large'
          placeholder='Örn: PRD-001'
        />
      </Form.Item>

      <Form.Item
        name='barcode'
        label='Barkod'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen barkod girin" },
          {
            type: "string",
            min: 8,
            message: "Barkod en az 8 karakter olmalıdır",
          },
        ]}>
        <Input
          size='large'
          placeholder='Örn: 8680000000000'
        />
      </Form.Item>

      <Form.Item
        name='vat'
        label='KDV Oranı (%)'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen KDV oranı girin" },
          { type: "number", message: "Lütfen geçerli bir oran girin" },
        ]}>
        <InputNumber<number>
          className={styles.formInput}
          size='large'
          min={0}
          max={100}
          precision={0}
          placeholder='18'
        />
      </Form.Item>

      <Form.Item
        name='deci'
        label='Desi'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen desi değeri girin" },
          { type: "number", message: "Lütfen geçerli bir değer girin" },
        ]}>
        <InputNumber<number>
          className={styles.formInput}
          size='large'
          min={0}
          step={0.1}
          precision={1}
          placeholder='1.0'
        />
      </Form.Item>

      <Form.Item
        name='stock'
        label='Stok Miktarı'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen stok miktarı girin" },
          { type: "number", message: "Lütfen geçerli bir miktar girin" },
        ]}>
        <InputNumber<number>
          className={styles.formInput}
          size='large'
          min={0}
          precision={0}
          placeholder='100'
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
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        name='brandId'
        label='Marka'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen marka seçin" },
          { type: "string" },
        ]}>
        <Select
          size='large'
          placeholder='Marka seçin'
          options={brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
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
            {editMode ? "Değişiklikleri Kaydet" : "Ürün Oluştur"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ProductForm
