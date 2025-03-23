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
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
      render: (categoryId: string) =>
        categories?.find((c: Category) => c.id === categoryId)?.name ||
        categoryId,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => date.toLocaleDateString("tr-TR"),
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    {
      title: "Güncellenme Tarihi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: Date) => date.toLocaleDateString("tr-TR"),
      sorter: (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
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
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <h1>Ürünler</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleCreate}>
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
      />

      <Modal
        title={editingProduct ? "Ürün Düzenle" : "Yeni Ürün"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Form.Item
            name='name'
            label='Ürün Adı'
            rules={[{ required: true, message: "Lütfen ürün adı girin" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Açıklama'
            rules={[{ required: true, message: "Lütfen açıklama girin" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name='price'
            label='Fiyat'
            rules={[{ required: true, message: "Lütfen fiyat girin" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              precision={2}
              prefix='₺'
            />
          </Form.Item>
          <Form.Item
            name='categoryId'
            label='Kategori'
            rules={[{ required: true, message: "Lütfen kategori seçin" }]}>
            <Select loading={categoriesLoading}>
              {categories?.map((category: Category) => (
                <Select.Option
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products
