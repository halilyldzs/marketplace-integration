import { SettingsFormValues } from "@sharedTypes/settings"

export const settingsService = {
  async updateSettings(settings: SettingsFormValues): Promise<void> {
    // Mock API call - gerçek API entegrasyonunda değişecek
    console.log("Updating settings:", settings)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
}
