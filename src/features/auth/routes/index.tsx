import ProtectedRoute from "@components/ProtectedRoute"
import { RouteObject } from "react-router-dom"
import Login from "../Login"
import Register from "../Register"

export const authRoutes: RouteObject[] = [
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
