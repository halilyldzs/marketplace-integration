import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { categoriesService } from "@features/categories/services/categories.service"
import { Category, CreateCategoryDTO } from "@features/categories/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
  message,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"

const { Text } = Typography

const Categories = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm<CreateCategoryDTO>()

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDTO) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      message.success("Kategori başarıyla oluşturuldu")
      setIsModalOpen(false)
      form.resetFields()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      message.success("Kategori başarıyla silindi")
    },
  })

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Kategoriyi silmek istediğinize emin misiniz?",
      content: "Bu işlem geri alınamaz.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => deleteMutation.mutate(id),
    })
  }

  const handleCreate = async (values: CreateCategoryDTO) => {
    try {
      await createMutation.mutateAsync(values)
    } catch (error) {
      console.error("Failed to create category:", error)
      message.error("Kategori oluşturulurken bir hata oluştu")
    }
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const generateSlug = (name: string) => {
    // Get the last part after the final slash, or use the whole string if no slash exists
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

  const columns: ColumnsType<Category> = [
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
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
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
            onClick={() => console.log("Edit", record)}
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
          alignItems: "center",
        }}>
        <h1 style={{ margin: 0 }}>Kategoriler</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          size='large'>
          Yeni Kategori
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={isLoading}
        rowKey='id'
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} kategori`,
        }}
      />

      <Modal
        title={
          <div
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 24px",
              margin: "-20px -24px 20px",
            }}>
            <Text
              strong
              style={{ fontSize: 18 }}>
              Yeni Kategori Oluştur
            </Text>
          </div>
        }
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={520}
        bodyStyle={{ padding: "24px" }}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleCreate}
          autoComplete='off'
          requiredMark='optional'>
          <Form.Item
            name='name'
            label='Kategori Adı'
            rules={[
              { required: true, message: "Lütfen kategori adını giriniz" },
              { min: 2, message: "Kategori adı en az 2 karakter olmalıdır" },
            ]}
            style={{ marginBottom: 24 }}>
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
                  style={{ fontSize: 12 }}>
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
            style={{ marginBottom: 32 }}>
            <Input
              size='large'
              placeholder='ornek-kategori'
            />
          </Form.Item>
          <Divider style={{ margin: "0 0 24px" }} />
          <Form.Item style={{ marginBottom: 0 }}>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Button
                size='large'
                onClick={handleModalCancel}>
                İptal
              </Button>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                loading={createMutation.isPending}>
                Kategori Oluştur
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Categories
