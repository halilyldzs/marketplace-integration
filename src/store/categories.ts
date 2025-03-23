import { categoriesService } from "@features/categories/services/categories.service"
import type { Category } from "@features/categories/types"
import { create } from "zustand"

interface CategoriesStore {
  categories: Category[]
  isLoading: boolean
  error: Error | null
  fetchCategories: () => Promise<void>
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null })
      const categories = await categoriesService.getAll()
      set({ categories, isLoading: false })
    } catch (error) {
      set({ error: error as Error, isLoading: false })
    }
  },
}))
