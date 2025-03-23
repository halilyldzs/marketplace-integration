import { StyleProvider } from "@ant-design/cssinjs"
import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App as AntApp, ConfigProvider, theme } from "antd"
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
  const { user } = useAuthStore()

  useEffect(() => {
    // Kullanıcı ayarları varsa onları kullan
    if (user?.settings?.theme) {
      setTheme(user.settings.theme === "dark")
      return
    }

    // Kullanıcı ayarları yoksa sistem temasını kullan
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setTheme(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      // Sadece kullanıcı ayarları yoksa sistem temasını takip et
      if (!user?.settings?.theme) {
        setTheme(e.matches)
      }
    }
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setTheme, user?.settings?.theme])

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
        <AntApp>
          <BrowserRouter>
            <AppRoutesComponent />
          </BrowserRouter>
        </AntApp>
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
