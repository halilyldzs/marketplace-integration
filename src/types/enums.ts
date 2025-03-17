export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MANAGER: "manager",
  OPERATOR: "operator",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
