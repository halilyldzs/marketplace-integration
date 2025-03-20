import { StyleProvider } from "@ant-design/cssinjs"
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
    <StyleProvider hashPriority='high'>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 14,
            borderRadius: 6,
            colorPrimary: "#1890ff",
          },
          cssVar: true,
          hashed: false,
        }}>
        <BrowserRouter>
          <AppRoutesComponent />
        </BrowserRouter>
      </ConfigProvider>
    </StyleProvider>
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
