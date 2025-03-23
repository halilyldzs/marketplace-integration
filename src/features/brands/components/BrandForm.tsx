import { Brand } from "@features/brands/types"
import { Button, Form, Input, Space } from "antd"
import { FormInstance } from "antd/es/form"
import styles from "./BrandForm.module.css"

interface BrandFormProps {
  onFinish: (values: { name: string; description?: string }) => void
  onCancel: () => void
  initialValues?: Brand
  isLoading?: boolean
  form: FormInstance
}

const BrandForm = ({
  onFinish,
  onCancel,
  initialValues,
  isLoading,
  form,
}: BrandFormProps) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout='vertical'
      className={styles.form}
      requiredMark='optional'
      initialValues={initialValues}>
      <Form.Item
        name='name'
        label='Marka Adı'
        className={styles.formItem}
        rules={[
          { required: true, message: "Lütfen marka adı girin" },
          { type: "string" },
        ]}>
        <Input
          size='large'
          placeholder='Marka adını girin'
          maxLength={50}
          showCount
        />
      </Form.Item>

      <Form.Item
        name='description'
        label='Açıklama'
        className={styles.formItem}
        rules={[{ type: "string" }]}>
        <Input.TextArea
          size='large'
          placeholder='Marka açıklamasını girin'
          rows={4}
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
            loading={isLoading}>
            {initialValues ? "Değişiklikleri Kaydet" : "Marka Oluştur"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default BrandForm
