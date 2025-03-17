import { useAuthStore } from "@store/auth"
import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
  authRequired?: boolean
  redirectPath?: string
}

const ProtectedRoute = ({
  children,
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

  return <>{children}</>
}

export default ProtectedRoute
