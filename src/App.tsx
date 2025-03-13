import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "./components/Layout/MainLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Users from "./pages/Users"

function App() {
  // Burada gerçek bir auth kontrolü yapılmalı
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to='/dashboard' /> : <Login />}
        />
        <Route
          path='/'
          element={isAuthenticated ? <MainLayout /> : <Navigate to='/login' />}>
          <Route
            index
            element={<Navigate to='/dashboard' />}
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
          {/* Diğer route'lar buraya eklenebilir */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
