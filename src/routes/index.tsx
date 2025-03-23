import { categoryRoutes } from "@/features/categories/routes"
import ProtectedRoute from "@components/ProtectedRoute"
import { authRoutes } from "@features/auth/routes"
import { dashboardRoutes } from "@features/dashboard/routes"
import { productRoutes } from "@features/products/routes"
import { profileRoutes } from "@features/profile/routes"
import { settingRoutes } from "@features/settings/routes"
import { userRoutes } from "@features/users/routes"
import MainLayout from "@layouts/MainLayout"
import { RouteObject } from "react-router-dom"

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      ...dashboardRoutes,
      ...productRoutes,
      ...categoryRoutes,
      ...userRoutes,
      ...settingRoutes,
      ...profileRoutes,
    ],
  },
]

export const routes: RouteObject[] = [...protectedRoutes, ...authRoutes]

export default routes
