import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Users from "./pages/Users"
import { useAuthStore } from "./store/auth"

const queryClient = new QueryClient()

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
