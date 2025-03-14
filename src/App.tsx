import { useThemeStore } from "@store/theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, theme } from "antd"
import { BrowserRouter, useRoutes } from "react-router-dom"
import { routes } from "./routes"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const AppRoutes = () => {
  const element = useRoutes(routes)
  return element
}

const App = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
