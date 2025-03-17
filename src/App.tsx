import { useThemeStore } from "@store/theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import { BrowserRouter, useRoutes } from "react-router-dom"
import AppRoutes from "./routes"
import "./styles/global.css"
import { darkTheme, lightTheme } from "./theme"

const queryClient = new QueryClient()

const AppRoutesComponent = () => {
  const element = useRoutes(AppRoutes)
  return element
}

const App = () => {
  const { isDarkMode } = useThemeStore()

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <BrowserRouter>
          <AppRoutesComponent />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
