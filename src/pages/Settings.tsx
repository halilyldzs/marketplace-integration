import { SaveOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Select, Space, Switch } from "antd"
import React from "react"

const { Option } = Select

interface SettingsFormValues {
  companyName: string
  emailNotifications: boolean
  language: "tr" | "en"
  theme: "light" | "dark"
}

const Settings: React.FC = () => {
  const [form] = Form.useForm<SettingsFormValues>()

  const onFinish = (values: SettingsFormValues) => {
    console.log("Received values:", values)
    // Burada API çağrısı yapılabilir
  }

  return (
    <Space
      direction='vertical'
      style={{ width: "100%" }}
      size='large'>
      <Card title='Sistem Ayarları'>
        <Form<SettingsFormValues>
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            companyName: "Lojistik YS",
            emailNotifications: true,
            language: "tr",
            theme: "light",
          }}>
          <Form.Item
            name='companyName'
            label='Şirket Adı'
            rules={[{ required: true, message: "Lütfen şirket adını girin!" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name='emailNotifications'
            label='E-posta Bildirimleri'
            valuePropName='checked'>
            <Switch />
          </Form.Item>

          <Form.Item
            name='language'
            label='Dil'>
            <Select>
              <Option value='tr'>Türkçe</Option>
              <Option value='en'>English</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='theme'
            label='Tema'>
            <Select>
              <Option value='light'>Açık</Option>
              <Option value='dark'>Koyu</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              htmlType='submit'>
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title='Yedekleme'>
        <Space>
          <Button type='primary'>Yedek Al</Button>
          <Button>Yedeği Geri Yükle</Button>
        </Space>
      </Card>
    </Space>
  )
}

export default Settings
