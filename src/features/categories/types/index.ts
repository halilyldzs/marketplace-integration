import { FieldValue } from "firebase/firestore"

export interface Category {
  id: string
  name: string
  slug: string
  nameLower: string
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export interface CreateCategoryDTO {
  name: string
  slug: string
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  id: string
}
