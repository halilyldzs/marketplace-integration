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
import { ReactNode, forwardRef } from "react"
import styles from "./styles/GenericForm.module.css"
import { Field } from "./types"

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

    return (
      <Form
        ref={ref}
        form={form}
        onFinish={onFinish}
        layout={layout}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        initialValues={initialValues}
        preserve
        onValuesChange={(changedValues, allValues) => {
          console.log("Form values changed:", changedValues, allValues)
        }}
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
        <div style={{ width: "100%" }}>
          <InputNumber
            {...commonProps}
            placeholder={field.placeholder as string}
            min={field.min}
            max={field.max}
            step={field.step}
            prefix={field.prefix}
            suffix={field.suffix}
            style={{ width: "100%" }}
            controls={true}
            addonBefore={field.prefix}
            addonAfter={field.suffix}
          />
        </div>
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
