export interface LoginFormValues {
  username: string
  password: string
  remember?: boolean
}

export interface LoginCredentials {
  username: string
  password: string
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

export interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setAuth: (isAuthenticated: boolean) => void
}
