import ProtectedRoute from "@components/ProtectedRoute"
import Login from "@features/auth/Login"
import Register from "@features/auth/Register"
import Dashboard from "@features/dashboard/Dashboard"
import Products from "@features/products/Products"
import Settings from "@features/settings/Settings"
import Users from "@features/users/Users"
import MainLayout from "@layouts/MainLayout"
import { RouteObject } from "react-router-dom"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute
        authRequired={false}
        redirectPath='/dashboard'>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute
        authRequired={false}
        redirectPath='/dashboard'>
        <Register />
      </ProtectedRoute>
    ),
  },
]
