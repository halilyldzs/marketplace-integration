import { StyleProvider } from "@ant-design/cssinjs"
import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App as AntApp, ConfigProvider, theme } from "antd"
import { useEffect } from "react"
import { BrowserRouter, useRoutes } from "react-router-dom"
import "./index.css"
import { routes } from "./routes"

const queryClient = new QueryClient()

const AppRoutesComponent = () => {
  const element = useRoutes(routes)
  return element
}

const AppContent = () => {
  const { isDarkMode, setTheme } = useThemeStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user?.settings?.theme) {
      setTheme(user.settings.theme === "dark")
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setTheme(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      if (!user?.settings?.theme) {
        setTheme(e.matches)
      }
    }
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setTheme, user?.settings?.theme])

  useEffect(() => {
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
            fontFamily: "Poppins, sans-serif",
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
