import { lazy } from "react"
import type { RouteObject } from "react-router-dom"

const Brands = lazy(() => import("../Brands"))

export const brandsRoutes: RouteObject[] = [
  {
    path: "brands",
    element: <Brands />,
  },
]
