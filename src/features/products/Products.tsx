import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { productsService } from "@features/products/services/products.service"
import { Product, ProductFormValues } from "@features/products/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from "antd"
import { useState } from "react"

const Products = () => {
  const [form] = Form.useForm<ProductFormValues>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productsService.getProducts,
  })

  const createMutation = useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla oluşturuldu")
      setIsModalOpen(false)
      form.resetFields()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProductFormValues }) =>
      productsService.updateProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      message.success("Ürün başarıyla güncellendi")
      setIsModalOpen(false)
      setEditingProduct(null)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: productsService.deleteProduct,
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
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, values })
    } else {
      createMutation.mutate(values)
    }
  }

  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₺${price.toFixed(2)}`,
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleCreate}>
          Yeni Ürün
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.products}
        loading={isLoading}
        rowKey='id'
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
            name='stock'
            label='Stok'
            rules={[{ required: true, message: "Lütfen stok miktarı girin" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name='category'
            label='Kategori'
            rules={[{ required: true, message: "Lütfen kategori girin" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products
