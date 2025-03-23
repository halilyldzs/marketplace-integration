import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { categoriesService } from "@features/categories/services/categories.service"
import { Category } from "@features/categories/types"
import { productsService } from "@features/products/services/products.service"
import {
  CreateProductDTO,
  Product,
  ProductFormValues,
} from "@features/products/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"
import styles from "./Products.module.css"

const Products = () => {
  const [form] = Form.useForm<ProductFormValues>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getAll(),
  })

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesService.getAll()
      return response.categories
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateProductDTO) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla oluşturuldu")
      setIsModalOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CreateProductDTO }) =>
      productsService.update({ id, ...values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla güncellendi")
      setIsModalOpen(false)
      setEditingProduct(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla silindi")
    },
  })

  const handleCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Ürünü silmek istediğinize emin misiniz?",
      content: "Bu işlem geri alınamaz.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => deleteMutation.mutate(id),
    })
  }

  const handleSubmit = (values: ProductFormValues) => {
    const productData = {
      ...values,
      images: [], // Şimdilik boş array
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, values: productData })
    } else {
      createMutation.mutate(productData)
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      responsive: ["lg"],
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₺${price.toLocaleString("tr-TR")}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Kategori",
      dataIndex: "categoryId",
      key: "categoryId",
      responsive: ["md"],
      render: (categoryId: string) =>
        categories?.find((c: Category) => c.id === categoryId)?.name ||
        categoryId,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (date: Date) => date.toLocaleDateString("tr-TR"),
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    {
      title: "Güncellenme Tarihi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["lg"],
      render: (date: Date) => date.toLocaleDateString("tr-TR"),
      sorter: (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type='text'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ürünler</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size='large'>
          Yeni Ürün
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={productsLoading || categoriesLoading}
        rowKey='id'
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} ürün`,
        }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          <div className={styles.modalTitle}>
            <h3 className={styles.modalTitleText}>
              {editingProduct ? "Ürün Düzenle" : "Yeni Ürün"}
            </h3>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={520}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          className={styles.form}>
          <Form.Item
            name='name'
            label='Ürün Adı'
            className={styles.formItem}
            rules={[{ required: true, message: "Lütfen ürün adı girin" }]}>
            <Input
              size='large'
              placeholder='Ürün adını girin'
            />
          </Form.Item>

          <Form.Item
            name='description'
            label='Açıklama'
            className={styles.formItem}
            rules={[{ required: true, message: "Lütfen açıklama girin" }]}>
            <Input.TextArea
              size='large'
              placeholder='Ürün açıklamasını girin'
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name='price'
            label='Fiyat'
            className={styles.formItem}
            rules={[{ required: true, message: "Lütfen fiyat girin" }]}>
            <InputNumber
              size='large'
              className={styles.formInput}
              min={0}
              precision={2}
              prefix='₺'
              placeholder='0.00'
            />
          </Form.Item>

          <Form.Item
            name='categoryId'
            label='Kategori'
            className={styles.formItem}
            rules={[{ required: true, message: "Lütfen kategori seçin" }]}>
            <Select
              size='large'
              loading={categoriesLoading}
              placeholder='Kategori seçin'
              showSearch
              optionFilterProp='children'>
              {categories?.map((category: Category) => (
                <Select.Option
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className={styles.formActions}>
            <Button onClick={() => setIsModalOpen(false)}>İptal</Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={createMutation.isPending || updateMutation.isPending}>
              {editingProduct ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default Products
