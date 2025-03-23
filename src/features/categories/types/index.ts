export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryDTO {
  name: string
  slug: string
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  id: string
}
