import { AuthStore } from "@sharedTypes/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

const DEFAULT_SETTINGS = {
  theme: "light" as const,
  language: "tr" as const,
  notifications: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token: string) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setAuth: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setUser: (user) =>
        set({
          user: user
            ? {
                ...user,
                settings: user.settings || DEFAULT_SETTINGS,
              }
            : null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
)
