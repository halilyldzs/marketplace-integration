import { brandsRoutes } from "@/features/brands/routes"
import { categoryRoutes } from "@/features/categories/routes"
import { ordersRoutes } from "@/features/orders/routes"
import ProtectedRoute from "@components/ProtectedRoute"
import { authRoutes } from "@features/auth/routes"
import { dashboardRoutes } from "@features/dashboard/routes"
import { productRoutes } from "@features/products/routes"
import { profileRoutes } from "@features/profile/routes"
import { settingRoutes } from "@features/settings/routes"
import { userRoutes } from "@features/users/routes"
import MainLayout from "@layouts/MainLayout"
import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate
            to='/dashboard'
            replace
          />
        ),
      },
      ...dashboardRoutes,
      ...productRoutes,
      ...categoryRoutes,
      ...userRoutes,
      ...settingRoutes,
      ...profileRoutes,
      ...brandsRoutes,
      ...ordersRoutes,
    ],
  },
]

export const routes: RouteObject[] = [...protectedRoutes, ...authRoutes]

export default routes
