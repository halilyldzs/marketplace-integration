import {
  AppstoreOutlined,
  DashboardOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"

export const NavItems: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    type: "item",
  },
  {
    key: "products",
    icon: <ShoppingOutlined />,
    label: "Ürünler",
    type: "item",
  },
  {
    key: "categories",
    icon: <AppstoreOutlined />,
    label: "Kategoriler",
    type: "item",
  },
  {
    key: "brands",
    icon: <ShopOutlined />,
    label: "Markalar",
    type: "item",
  },
  {
    key: "orders",
    icon: <ShoppingOutlined />,
    label: "Siparişler",
    type: "item",
  },
  //   {
  //     key: "users",
  //     icon: <TeamOutlined />,
  //     label: "Kullanıcılar",
  //     type: "item",
  //   },
  //   {
  //     key: "settings",
  //     icon: <SettingOutlined />,
  //     label: "Ayarlar",
  //     type: "item",
  //   },
]
