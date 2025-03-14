import { create } from "zustand"

interface AuthStore {
  isAuthenticated: boolean
  setAuth: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  setAuth: (value) => set({ isAuthenticated: value }),
}))
