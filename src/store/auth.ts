import { AuthState, AuthStore } from "@sharedTypes/auth"
import { create } from "zustand"

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  login: async () => {
    // Login işlemi
    set({ isAuthenticated: true })
  },
  logout: () => {
    set(initialState)
  },
  setAuth: (isAuthenticated: boolean) => {
    set({ isAuthenticated })
  },
}))
