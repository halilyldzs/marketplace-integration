import ProtectedRoute from "@components/ProtectedRoute"
import Login from "@features/auth/Login"
import Dashboard from "@features/dashboard/Dashboard"
import Settings from "@features/settings/Settings"
import Users from "@features/users/Users"
import MainLayout from "@layouts/MainLayout"
import { RouteObject } from "react-router-dom"

export const routes: RouteObject[] = [
  {
    element: <ProtectedRoute authRequired={false} />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]
