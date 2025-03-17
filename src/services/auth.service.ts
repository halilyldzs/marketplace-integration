import { LoginCredentials, RegisterFormValues } from "@sharedTypes/auth"

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string }> {
    // Mock API call - gerçek API entegrasyonunda değişecek
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === "admin" && credentials.password === "admin") {
      return { token: "mock-jwt-token" }
    }

    throw new Error("Invalid credentials")
  },

  async register(data: RegisterFormValues): Promise<void> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simüle edilmiş kayıt kontrolü
    if (data.username === "admin") {
      throw new Error("Bu kullanıcı adı zaten kullanılıyor")
    }

    // Başarılı kayıt simülasyonu
    return
  },

  async logout(): Promise<void> {
    // Mock API call - gerçek API entegrasyonunda değişecek
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
}
