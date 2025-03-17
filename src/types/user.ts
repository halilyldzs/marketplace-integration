import { UserRole } from "./enums"

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
