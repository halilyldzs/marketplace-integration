import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, theme } from "antd"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./features/auth/Login"
import Dashboard from "./features/dashboard/Dashboard"
import Settings from "./features/settings/Settings"
import Users from "./features/users/Users"
import MainLayout from "./layouts/MainLayout"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/login'
              element={
                !isAuthenticated ? (
                  <Login />
                ) : (
                  <Navigate
                    to='/dashboard'
                    replace
                  />
                )
              }
            />
            <Route
              path='/'
              element={
                isAuthenticated ? (
                  <MainLayout />
                ) : (
                  <Navigate
                    to='/login'
                    replace
                  />
                )
              }>
              <Route
                index
                element={
                  <Navigate
                    to='/dashboard'
                    replace
                  />
                }
              />
              <Route
                path='dashboard'
                element={<Dashboard />}
              />
              <Route
                path='users'
                element={<Users />}
              />
              <Route
                path='settings'
                element={<Settings />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
