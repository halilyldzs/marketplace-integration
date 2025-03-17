import { RouteObject } from "react-router-dom"
import Products from "../Products"

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    element: <Products />,
  },
]
