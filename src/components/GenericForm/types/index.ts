import type { Rule } from "antd/es/form"

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "date"
  | "range"
  | "switch"
  | "checkbox"
  | "radio"

export interface Field {
  name: string
  label: string
  type: FieldType
  rules?: Rule[]
  placeholder?: string | [string, string]
  options?: { label: string; value: string | number }[]
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  rows?: number
  showCount?: boolean
  allowClear?: boolean
  multiple?: boolean
  showSearch?: boolean
  mode?: "multiple" | "tags"
  format?: string
  showTime?: boolean
  defaultValue?: string | number | boolean | Date | [Date, Date]
}
