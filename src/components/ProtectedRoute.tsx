import { useAuthStore } from "@store/auth"
import { Navigate, Outlet } from "react-router-dom"

interface ProtectedRouteProps {
  authRequired?: boolean
  redirectPath?: string
}

const ProtectedRoute = ({
  authRequired = true,
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (authRequired && !isAuthenticated) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    )
  }

  if (!authRequired && isAuthenticated) {
    return (
      <Navigate
        to='/dashboard'
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
