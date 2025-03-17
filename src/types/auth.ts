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
  id: number
  username: string
  fullName: string
  email: string
  role: "admin" | "user"
}

export interface AuthResponse {
  success: boolean
  user: User
}

export interface AuthStore {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  setAuth: (isAuthenticated: boolean) => void
}
