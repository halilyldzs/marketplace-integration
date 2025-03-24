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

  const validatePrices = (_: unknown, value: number) => {
    try {
      const listPrice = form.getFieldValue("listPrice")

      if (listPrice > 0 && value > listPrice) {
        return Promise.reject("Satış fiyatı liste fiyatından büyük olamaz")
      }
      return Promise.resolve()
    } catch {
      return Promise.resolve()
    }
  }

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
        className={`${styles.formItem} ${styles.fullWidth}`}
        rules={[
          { required: true, message: "Lütfen ürün adı girin" },
          { type: "string" },
          { whitespace: true, message: "Ürün adı boşluk olamaz" },
          { min: 3, message: "Ürün adı en az 3 karakter olmalıdır" },
        ]}>
        <Input
          size='middle'
          placeholder='Ürün adını girin'
          maxLength={50}
          showCount
        />
      </Form.Item>

      <Form.Item
        name='description'
        label='Açıklama'
        className={`${styles.formItem} ${styles.fullWidth}`}
        rules={[
          { required: true, message: "Lütfen açıklama girin" },
          { type: "string" },
          { whitespace: true, message: "Açıklama boşluk olamaz" },
          { min: 10, message: "Açıklama en az 10 karakter olmalıdır" },
        ]}>
        <Input.TextArea
          size='middle'
          placeholder='Ürün açıklamasını girin'
          rows={3}
          maxLength={500}
          showCount
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
          size='middle'
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
          size='middle'
          placeholder='Örn: 8680000000000'
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
          size='middle'
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
          size='middle'
          placeholder='Marka seçin'
          options={brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        name='price'
        label='Satış Fiyatı'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen satış fiyatı girin" },
          { type: "number", message: "Lütfen geçerli bir fiyat girin" },
          { validator: validatePrices },
        ]}>
        <InputNumber<number>
          className={styles.priceInput}
          size='middle'
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
          size='middle'
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
          onChange={() => {
            form.validateFields(["price"])
          }}
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
          size='middle'
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
          size='middle'
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
          size='middle'
          min={0}
          precision={0}
          placeholder='100'
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
