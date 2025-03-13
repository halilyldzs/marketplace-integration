import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Space, Table, Tag } from "antd"
import React from "react"

const Users: React.FC = () => {
  const columns = [
    {
      title: "Kullanıcı Adı",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Ad Soyad",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "E-posta",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "Admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: () => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            size='small'>
            Düzenle
          </Button>
          <Button
            type='primary'
            danger
            icon={<DeleteOutlined />}
            size='small'>
            Sil
          </Button>
        </Space>
      ),
    },
  ]

  const data = [
    {
      key: "1",
      username: "admin",
      fullName: "Admin User",
      email: "admin@example.com",
      role: "Admin",
    },
    {
      key: "2",
      username: "user1",
      fullName: "John Doe",
      email: "john@example.com",
      role: "User",
    },
    // Daha fazla örnek veri eklenebilir
  ]

  return (
    <Card
      title='Kullanıcı Yönetimi'
      extra={
        <Button
          type='primary'
          icon={<UserOutlined />}>
          Yeni Kullanıcı
        </Button>
      }>
      <Table
        columns={columns}
        dataSource={data}
      />
    </Card>
  )
}

export default Users
