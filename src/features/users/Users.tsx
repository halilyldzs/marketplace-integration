import { User } from "@sharedTypes/user"
import { useQuery } from "@tanstack/react-query"
import { Button, Space, Table } from "antd"
import { usersService } from "./services/users.service"

const Users = () => {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usersService.getUsers,
  })

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
      title: "İşlemler",
      key: "actions",
      render: () => (
        <Space>
          <Button type='primary'>Düzenle</Button>
          <Button danger>Sil</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={users}
        rowKey='id'
      />
    </div>
  )
}

export default Users
