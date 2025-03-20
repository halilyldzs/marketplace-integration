import { SettingsFormValues } from "@sharedTypes/settings"
import { useMutation } from "@tanstack/react-query"
import { Button, Card, Form, Input, message } from "antd"
import { settingsService } from "./services/settings.service"

const Settings = () => {
  const [form] = Form.useForm<SettingsFormValues>()

  const updateMutation = useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      message.success("Ayarlar güncellendi")
    },
    onError: () => {
      message.error("Ayarlar güncellenirken bir hata oluştu")
    },
  })

  const onFinish = (values: SettingsFormValues) => {
    updateMutation.mutate(values)
  }

  return (
    <div>
      <Card>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            companyName: "Lojistik YS",
            email: "info@lojistik.com",
            phone: "+90 555 555 5555",
          }}>
          <Form.Item
            label='Şirket Adı'
            name='companyName'
            rules={[{ required: true, message: "Lütfen şirket adını girin" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='E-posta'
            name='email'
            rules={[
              { required: true, message: "Lütfen e-posta adresini girin" },
              { type: "email", message: "Geçerli bir e-posta adresi girin" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Telefon'
            name='phone'
            rules={[
              { required: true, message: "Lütfen telefon numarasını girin" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={updateMutation.isPending}>
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Settings
