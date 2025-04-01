import { Field } from "@/components/GenericForm/types"
import styles from "@/features/products/styles/ProductForm.module.css"
import type { Brand } from "@features/brands/types"
import type { Category } from "@features/categories/types"
import type { FormInstance, Rule } from "antd/es/form"
import type { ProductFormValues } from "../types"

interface ProductFormFieldsProps {
  categories: Category[]
  brands: Brand[]
  formRef: React.RefObject<FormInstance<ProductFormValues>>
}

export const getProductFormFields = ({
  categories,
  brands,
  formRef,
}: ProductFormFieldsProps) => {
  const fields: Field[] = [
    {
      name: "name",
      label: "Ürün Adı",
      type: "text" as const,
      required: true,
      placeholder: "Ürün adını girin",
      maxLength: 50,
      showCount: true,
      formItemClassName: "col-span-12",
      rules: [
        { type: "string" as const },
        { whitespace: true, message: "Ürün adı boşluk olamaz" },
        { min: 3, message: "Ürün adı en az 3 karakter olmalıdır" },
      ] as Rule[],
    },
    {
      name: "description",
      label: "Açıklama",
      type: "textarea" as const,
      required: true,
      placeholder: "Ürün açıklamasını girin",
      rows: 3,
      maxLength: 500,
      showCount: true,
      formItemClassName: "col-span-12",
      inputClassName: styles.descriptionInput,
      rules: [
        { type: "string" as const },
        { whitespace: true, message: "Açıklama boşluk olamaz" },
        { min: 10, message: "Açıklama en az 10 karakter olmalıdır" },
      ] as Rule[],
    },
    {
      name: "sku",
      label: "Stok Kodu (SKU)",
      type: "text" as const,
      required: true,
      placeholder: "Örn: PRD-001",
      formItemClassName: "col-span-4",
      rules: [
        {
          type: "string" as const,
          min: 3,
          message: "Stok kodu en az 3 karakter olmalıdır",
        },
      ] as Rule[],
    },
    {
      name: "barcode",
      label: "Barkod",
      type: "text" as const,
      required: true,
      placeholder: "Örn: 8680000000000",
      formItemClassName: "col-span-4",
      rules: [
        {
          type: "string" as const,
          min: 8,
          message: "Barkod en az 8 karakter olmalıdır",
        },
      ] as Rule[],
    },
    {
      name: "categoryId",
      label: "Kategori",
      type: "select" as const,
      required: true,
      placeholder: "Kategori seçin",
      formItemClassName: "col-span-4",
      options: categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    },
    {
      name: "brandId",
      label: "Marka",
      type: "select" as const,
      required: true,
      placeholder: "Marka seçin",
      formItemClassName: "col-span-4",
      options: brands.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })),
    },
    {
      name: "price",
      label: "Satış Fiyatı",
      type: "number" as const,
      required: true,
      placeholder: "0.00",
      min: 0,
      step: 0.01,
      precision: 2,
      prefix: "₺",
      formItemClassName: "col-span-4",
      rules: [
        { type: "number" as const, message: "Lütfen geçerli bir fiyat girin" },
        {
          validator: async (_: unknown, value: number) => {
            const form = formRef.current
            if (!form) return Promise.resolve()
            const listPrice = form.getFieldValue("listPrice")
            if (listPrice > 0 && value > listPrice) {
              return Promise.reject(
                "Satış fiyatı liste fiyatından büyük olamaz"
              )
            }
            return Promise.resolve()
          },
        },
      ] as Rule[],
    },
    {
      name: "listPrice",
      label: "Liste Fiyatı",
      type: "number" as const,
      required: true,
      placeholder: "0.00",
      min: 0,
      step: 0.01,
      precision: 2,
      prefix: "₺",
      formItemClassName: "col-span-4",
      rules: [
        { type: "number" as const, message: "Lütfen geçerli bir fiyat girin" },
      ] as Rule[],
    },
    {
      name: "vat",
      label: "KDV Oranı (%)",
      type: "number" as const,
      required: true,
      placeholder: "18",
      min: 0,
      max: 100,
      precision: 0,
      formItemClassName: "col-span-4",
      rules: [
        { type: "number" as const, message: "Lütfen geçerli bir oran girin" },
      ] as Rule[],
    },
    {
      name: "deci",
      label: "Desi",
      type: "number" as const,
      required: true,
      placeholder: "1.0",
      min: 0,
      step: 0.1,
      precision: 1,
      formItemClassName: "col-span-4",
      rules: [
        { type: "number" as const, message: "Lütfen geçerli bir değer girin" },
      ] as Rule[],
    },
    {
      name: "stock",
      label: "Stok Miktarı",
      type: "number" as const,
      required: true,
      placeholder: "100",
      min: 0,
      precision: 0,
      formItemClassName: "col-span-4",
      rules: [
        { type: "number" as const, message: "Lütfen geçerli bir miktar girin" },
      ] as Rule[],
    },
  ]

  return fields
}
