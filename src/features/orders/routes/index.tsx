import { RouteObject } from "react-router-dom"
import Orders from "../Orders"

export const ordersRoutes: RouteObject[] = [
  {
    path: "orders",
    element: <Orders />,
  },
]
