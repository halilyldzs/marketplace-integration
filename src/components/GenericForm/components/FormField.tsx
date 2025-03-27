import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
} from "antd"
import { Field } from "../types"

const { TextArea } = Input
const { RangePicker } = DatePicker

interface FormFieldProps {
  field: Field
}

export const FormField = ({ field }: FormFieldProps) => {
  const commonProps = {
    disabled: field.disabled,
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
          placeholder={field.placeholder as string}
          min={field.min}
          max={field.max}
          step={field.step}
          prefix={field.prefix}
          suffix={field.suffix}
          style={{ width: "100%" }}
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
          style={{ width: "100%" }}
        />
      )

    case "range":
      return (
        <RangePicker
          {...commonProps}
          placeholder={field.placeholder as [string, string]}
          format={field.format}
          showTime={field.showTime}
          style={{ width: "100%" }}
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
