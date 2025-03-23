import { Button, Divider, Form, Input, Space, Typography } from "antd"
import { useEffect } from "react"
import { Category, CreateCategoryDTO } from "../types"
import styles from "./CategoryForm.module.css"

const { Text } = Typography

interface CategoryFormProps {
  initialValues?: Category
  onSubmit: (values: CreateCategoryDTO) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

const CategoryForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) => {
  const [form] = Form.useForm<CreateCategoryDTO>()

  useEffect(() => {
    form.resetFields()
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        slug: initialValues.slug,
      })
    }
  }, [form, initialValues])

  const generateSlug = (name: string) => {
    const lastPart = name.split("/").pop() || name
    return lastPart
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = generateSlug(name)
    form.setFieldsValue({ slug })
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onSubmit}
      initialValues={initialValues}
      autoComplete='off'
      requiredMark='optional'>
      <Form.Item
        name='name'
        label='Kategori Adı'
        rules={[
          { required: true, message: "Lütfen kategori adını giriniz" },
          { min: 2, message: "Kategori adı en az 2 karakter olmalıdır" },
        ]}
        className={styles.formItem}>
        <Input
          size='large'
          placeholder='Örn: Elektronik'
          onChange={handleNameChange}
          maxLength={50}
          showCount
        />
      </Form.Item>
      <Form.Item
        name='slug'
        label={
          <Space>
            <span>Slug</span>
            <Text
              type='secondary'
              className={styles.slugLabel}>
              (Otomatik oluşturulur)
            </Text>
          </Space>
        }
        rules={[
          { required: true, message: "Lütfen slug giriniz" },
          {
            pattern: /^[a-z0-9-]+$/,
            message: "Slug sadece küçük harf, rakam ve tire içerebilir",
          },
        ]}
        className={styles.formItemLarge}>
        <Input
          size='large'
          placeholder='ornek-kategori'
        />
      </Form.Item>
      <Divider className={styles.divider} />
      <Form.Item className={styles.actions}>
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
            {initialValues ? "Değişiklikleri Kaydet" : "Kategori Oluştur"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CategoryForm
