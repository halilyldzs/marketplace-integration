import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./features/auth/Login"
import Dashboard from "./features/dashboard/Dashboard"
import Settings from "./features/settings/Settings"
import Users from "./features/users/Users"
import MainLayout from "./layouts/MainLayout"
import { useAuthStore } from "./store/auth"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/login'
            element={
              isAuthenticated ? (
                <Navigate
                  to='/dashboard'
                  replace
                />
              ) : (
                <Login />
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
    </QueryClientProvider>
  )
}

export default App
