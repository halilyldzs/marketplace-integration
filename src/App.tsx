import { useThemeStore } from "@store/theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, theme } from "antd"
import { useEffect } from "react"
import { BrowserRouter, useRoutes } from "react-router-dom"
import AppRoutes from "./routes"
import "./styles/global.css"

const queryClient = new QueryClient()

const AppRoutesComponent = () => {
  const element = useRoutes(AppRoutes)
  return element
}

const AppContent = () => {
  const { isDarkMode, setTheme } = useThemeStore()

  useEffect(() => {
    // Sistem temasını kontrol et
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setTheme(mediaQuery.matches)

    // Tema değişikliklerini dinle
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setTheme])

  useEffect(() => {
    // HTML elementine tema attribute'unu ekle
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    )
  }, [isDarkMode])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
          colorBgContainer: isDarkMode
            ? "var(--neutral-2)"
            : "var(--neutral-1)",
          colorBgElevated: isDarkMode ? "var(--neutral-3)" : "var(--neutral-2)",
          colorText: isDarkMode ? "var(--neutral-8)" : "var(--neutral-10)",
          colorTextSecondary: isDarkMode
            ? "var(--neutral-7)"
            : "var(--neutral-8)",
          boxShadow: isDarkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.2)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
          boxShadowSecondary: isDarkMode
            ? "0 6px 16px rgba(0, 0, 0, 0.3)"
            : "0 6px 16px rgba(0, 0, 0, 0.08)",
        },
      }}>
      <BrowserRouter>
        <AppRoutesComponent />
      </BrowserRouter>
    </ConfigProvider>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
