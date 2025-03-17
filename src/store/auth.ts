import { AuthStore } from "@sharedTypes/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token: string) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setAuth: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
)
