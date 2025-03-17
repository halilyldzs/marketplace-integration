import { UserRole } from "./enums"

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

export interface User {
  id: string
  email: string
  username: string
  fullName: string
  role: UserRole
  permissions?: string[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isActive: boolean
  phoneNumber?: string
  avatar?: string
  company?: {
    name: string
    position: string
    department?: string
  }
  settings?: {
    theme: "light" | "dark"
    language: string
    notifications: boolean
  }
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
