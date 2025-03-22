import { User } from "./user"

export interface LoginFormValues {
  username: string
  password: string
  remember?: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterFormValues {
  fullName: string
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export interface AuthResponse {
  success: boolean
  user: User
}

export interface AuthStore {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  setAuth: (isAuthenticated: boolean) => void
  setUser: (user: User | null) => void
}
