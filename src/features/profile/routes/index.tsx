import { RouteObject } from "react-router-dom"
import Profile from "../Profile"

export const profileRoutes: RouteObject[] = [
  {
    path: "profile",
    element: <Profile />,
  },
]
