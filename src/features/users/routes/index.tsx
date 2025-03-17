import { RouteObject } from "react-router-dom"
import Users from "../Users"

export const userRoutes: RouteObject[] = [
  {
    path: "users",
    element: <Users />,
  },
]
