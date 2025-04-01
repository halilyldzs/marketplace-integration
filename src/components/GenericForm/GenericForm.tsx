import {
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
} from "antd"
import type { FormInstance } from "antd/es/form"
import type { Store } from "antd/es/form/interface"
import { ReactNode, forwardRef, useEffect } from "react"
import styles from "./styles/GenericForm.module.css"
import type { Field } from "./types"

const { TextArea } = Input
const { RangePicker } = DatePicker

interface GenericFormProps<T extends Record<string, unknown>>
  extends Omit<FormProps, "onFinish"> {
  fields: Field[]
  onSubmit: (values: T) => void
  initialValues?: T
  submitButton?: ReactNode
  cancelButton?: ReactNode
  layout?: "horizontal" | "vertical" | "inline"
  labelCol?: { span: number }
  wrapperCol?: { span: number }
  formClassName?: string
  formActionsAlign?: "left" | "center" | "right"
}

export const GenericForm = forwardRef(
  <T extends Record<string, unknown>>(
    {
      fields,
      onSubmit,
      initialValues,
      submitButton,
      cancelButton,
      layout = "vertical",
      labelCol,
      wrapperCol,
      formClassName,
      formActionsAlign = "right",
      ...formProps
    }: GenericFormProps<T>,
    ref: React.ForwardedRef<FormInstance<T>>
  ) => {
    const [form] = Form.useForm<T>()

    const onFinish = (values: T) => {
      onSubmit(values)
    }

    useEffect(() => {
      if (initialValues) {
        form.resetFields()
        form.setFieldsValue(initialValues as Store)
      }
    }, [initialValues, form])

    return (
      <Form
        ref={ref}
        form={form}
        onFinish={onFinish}
        layout={layout}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        className={`${styles.form} ${formClassName || ""}`}
        {...formProps}>
        <div className='grid'>
          {fields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.type !== "checkbox" ? field.label : undefined}
              className={`${styles.formItem} ${field.formItemClassName || ""}`}
              rules={[
                ...(field.rules || []),
                ...(field.required
                  ? [
                      {
                        required: true,
                        message: `Please input ${field.label}!`,
                      },
                    ]
                  : []),
              ]}>
              {renderField(field)}
            </Form.Item>
          ))}
        </div>

        {(submitButton || cancelButton) && (
          <Form.Item
            className={styles.formActions}
            style={{ justifyContent: formActionsAlign }}>
            <Space>
              {cancelButton}
              {submitButton}
            </Space>
          </Form.Item>
        )}
      </Form>
    )
  }
) as <T extends Record<string, unknown>>(
  props: GenericFormProps<T> & { ref?: React.ForwardedRef<FormInstance<T>> }
) => JSX.Element

const renderField = (field: Field) => {
  const commonProps = {
    disabled: field.disabled,
    className: field.inputClassName,
  }

  const inputProps = {
    ...commonProps,
    allowClear: field.allowClear,
  }

  switch (field.type) {
    case "text":
      return (
        <Input
          {...inputProps}
          placeholder={field.placeholder as string}
        />
      )

    case "number":
      return (
        <InputNumber
          {...commonProps}
          style={{ width: "100%" }}
          min={field.min}
          max={field.max}
          step={field.step}
          precision={field.precision}
          placeholder={field.placeholder as string}
          addonBefore={field.prefix}
          formatter={(value) => {
            if (value === null || value === undefined) return ""
            return field.prefix
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : `${value}`
          }}
          parser={(value) => {
            if (!value) return 0
            const parsedValue = value.toString().replace(/[^\d.-]/g, "")
            return !parsedValue ? 0 : Number(parsedValue)
          }}
        />
      )

    case "textarea":
      return (
        <TextArea
          {...inputProps}
          placeholder={field.placeholder as string}
          rows={field.rows}
          showCount={field.showCount}
        />
      )

    case "select":
      return (
        <Select
          {...inputProps}
          placeholder={field.placeholder as string}
          options={field.options}
          mode={field.mode}
          showSearch={field.showSearch}
        />
      )

    case "date":
      return (
        <DatePicker
          {...commonProps}
          placeholder={field.placeholder as string}
          format={field.format}
          showTime={field.showTime}
        />
      )

    case "range":
      return (
        <RangePicker
          {...commonProps}
          placeholder={field.placeholder as [string, string]}
          format={field.format}
          showTime={field.showTime}
        />
      )

    case "switch":
      return <Switch {...commonProps} />

    case "checkbox":
      return <Checkbox {...commonProps}>{field.label}</Checkbox>

    case "radio":
      return (
        <Radio.Group {...commonProps}>
          {field.options?.map((option) => (
            <Radio
              key={option.value}
              value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      )

    default:
      return null
  }
}
