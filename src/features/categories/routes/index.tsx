import { RouteObject } from "react-router-dom"
import Categories from "../Categories"

export const categoryRoutes: RouteObject[] = [
  {
    path: "categories",
    element: <Categories />,
  },
]
