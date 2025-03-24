import type { RouteObject } from "react-router-dom"
import Brands from "../Brands"

export const brandsRoutes: RouteObject[] = [
  {
    path: "brands",
    element: <Brands />,
  },
]
