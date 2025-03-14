import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Users from "./pages/Users"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  return (
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
              <Login setAuth={setIsAuthenticated} />
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
  )
}

export default App
