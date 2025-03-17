import {
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import styles from "@styles/layouts/MainLayout.module.css"
import { Button, Layout, Menu, Switch, theme } from "antd"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

const { Header, Content, Footer, Sider } = Layout
const { useToken } = theme

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useToken()
  const logout = useAuthStore((state) => state.logout)
  const { isDarkMode, toggleTheme } = useThemeStore()

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
      key: "/products",
      icon: <ShopOutlined />,
      label: <Link to='/products'>Ürünler</Link>,
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
        theme={isDarkMode ? "dark" : "light"}
        className={styles.sider}>
        <div
          className={styles.logo}
          style={{ color: token.colorPrimary }}>
          Lojistik YS
        </div>
        <Menu
          mode='inline'
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme={isDarkMode ? "dark" : "light"}
          style={{ border: "none" }}
        />
      </Sider>
      <Layout>
        <Header
          className={styles.header}
          style={{ background: isDarkMode ? token.colorBgContainer : "#fff" }}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren='🌙'
            unCheckedChildren='☀️'
          />
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginLeft: "auto" }}>
            Çıkış Yap
          </Button>
        </Header>
        <Content
          className={styles.content}
          style={{ background: isDarkMode ? token.colorBgContainer : "#fff" }}>
          <Outlet />
        </Content>
        <Footer
          className={styles.footer}
          style={{ background: "transparent" }}>
          Lojistik YS ©{new Date().getFullYear()} - Tüm hakları saklıdır.
        </Footer>
      </Layout>
    </Layout>
  )
}

export default MainLayout
