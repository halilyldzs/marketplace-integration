import { Breadcrumb } from "antd"
import { Link, useLocation } from "react-router-dom"
import styles from "./PageBreadcrumb.module.css"

const breadcrumbNameMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Ürünler",
  "/users": "Kullanıcılar",
  "/settings": "Ayarlar",
  "/profile": "Profil",
}

export const PageBreadcrumb = () => {
  const location = useLocation()
  const pathSnippets = location.pathname.split("/").filter((i) => i)

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    }
  })

  const breadcrumbItems = [
    {
      title: <Link to='/dashboard'>Ana Sayfa</Link>,
      key: "home",
    },
    ...extraBreadcrumbItems,
  ]

  return (
    <div className={styles.breadcrumbContainer}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}

export default PageBreadcrumb
