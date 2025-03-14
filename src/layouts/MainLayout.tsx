import {
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useAuthStore } from "@store/auth"
import styles from "@styles/layouts/MainLayout.module.css"
import { Button, Layout, Menu } from "antd"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

const { Header, Content, Footer, Sider } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to='/dashboard'>Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to='/users'>Kullanıcılar</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to='/settings'>Ayarlar</Link>,
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme='light'
        className={styles.sider}>
        <div className={styles.logo}>Lojistik YS</div>
        <Menu
          mode='inline'
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ border: "none" }}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginLeft: "auto" }}>
            Çıkış Yap
          </Button>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>
          Lojistik YS ©{new Date().getFullYear()} - Tüm hakları saklıdır.
        </Footer>
      </Layout>
    </Layout>
  )
}

export default MainLayout
