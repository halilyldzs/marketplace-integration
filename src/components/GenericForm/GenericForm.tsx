import { Form, FormProps, Space } from "antd"
import { ReactNode } from "react"
import { FormField } from "./components/FormField"
import { DEFAULT_FORM_LAYOUT } from "./constants"
import styles from "./styles/GenericForm.module.css"
import { Field } from "./types"

interface GenericFormProps<T extends Record<string, unknown>>
  extends Omit<FormProps, "onFinish"> {
  fields: Field[]
  onSubmit: (values: T) => void
  defaultValues?: Partial<T>
  submitButton?: ReactNode
  cancelButton?: ReactNode
}

export const GenericForm = <T extends Record<string, unknown>>({
  fields,
  onSubmit,
  defaultValues,
  submitButton,
  cancelButton,
  ...formProps
}: GenericFormProps<T>) => {
  const [form] = Form.useForm<T>()

  const onFinish = (values: T) => {
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout={DEFAULT_FORM_LAYOUT}
      initialValues={defaultValues}
      className={styles.form}
      {...formProps}>
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.type !== "checkbox" ? field.label : undefined}
          className={styles.formItem}
          rules={[
            ...(field.rules || []),
            ...(field.required
              ? [{ required: true, message: `Please input ${field.label}!` }]
              : []),
          ]}>
          <FormField field={field} />
        </Form.Item>
      ))}

      {(submitButton || cancelButton) && (
        <Form.Item className={styles.formActions}>
          <Space>
            {cancelButton}
            {submitButton}
          </Space>
        </Form.Item>
      )}
    </Form>
  )
}
