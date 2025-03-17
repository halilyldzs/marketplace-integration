import { UploadOutlined } from "@ant-design/icons"
import { auth } from "@config/firebase"
import { firebaseAuthService } from "@services/firebase-auth.service"
import { useAuthStore } from "@store/auth"
import { Button, Form, Input, message, Select, Switch, Upload } from "antd"
import type { UploadFile } from "antd/es/upload/interface"
import { updatePassword } from "firebase/auth"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { useState } from "react"

const { Option } = Select

interface ProfileFormValues {
  fullName: string
  email: string
  phoneNumber?: string
  settings?: {
    theme: "light" | "dark"
    language: "tr" | "en"
    notifications: boolean
  }
}

const Profile = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onFinish = async (values: ProfileFormValues) => {
    try {
      setLoading(true)
      await firebaseAuthService.updateUserData(user!.id, {
        ...values,
        updatedAt: new Date().toISOString(),
      })
      setUser({ ...user!, ...values })
      message.success("Profil başarıyla güncellendi!")
    } catch (error) {
      message.error(`Profil güncellenirken bir hata oluştu: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (values: {
    currentPassword: string
    newPassword: string
  }) => {
    try {
      setLoading(true)
      if (!auth.currentUser) throw new Error("No user logged in")
      await updatePassword(auth.currentUser, values.newPassword)
      message.success("Şifre başarıyla güncellendi!")
      form.resetFields(["currentPassword", "newPassword"])
    } catch (error) {
      message.error(`Şifre güncellenirken bir hata oluştu: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true)
      const storage = getStorage()
      const storageRef = ref(storage, `avatars/${user!.id}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await firebaseAuthService.updateUserData(user!.id, {
        avatar: downloadURL,
      })
      setUser({ ...user!, avatar: downloadURL })
      message.success("Profil fotoğrafı güncellendi!")
    } catch (error) {
      message.error(`Profil fotoğrafı yüklenirken bir hata oluştu: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Profil Ayarları</h2>

      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          <Form
            form={form}
            layout='vertical'
            initialValues={
              user || {
                fullName: "",
                email: "",
                phoneNumber: "",
                settings: {
                  theme: "light",
                  language: "tr",
                  notifications: false,
                },
              }
            }
            onFinish={onFinish}>
            <Form.Item
              label='Ad Soyad'
              name='fullName'
              rules={[
                {
                  required: true,
                  message: "Lütfen adınızı ve soyadınızı girin!",
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              label='E-posta'
              name='email'
              rules={[
                { required: true, message: "Lütfen e-posta adresinizi girin!" },
                { type: "email", message: "Geçerli bir e-posta adresi girin!" },
              ]}>
              <Input disabled />
            </Form.Item>

            <Form.Item
              label='Telefon'
              name='phoneNumber'>
              <Input />
            </Form.Item>

            <Form.Item
              label='Tema'
              name={["settings", "theme"]}>
              <Select>
                <Option value='light'>Açık</Option>
                <Option value='dark'>Koyu</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Dil'
              name={["settings", "language"]}>
              <Select>
                <Option value='tr'>Türkçe</Option>
                <Option value='en'>English</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Bildirimler'
              name={["settings", "notifications"]}
              valuePropName='checked'>
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}>
                Kaydet
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Şifre Değiştir</h3>
          <Form
            layout='vertical'
            onFinish={handlePasswordChange}>
            <Form.Item
              label='Mevcut Şifre'
              name='currentPassword'
              rules={[
                { required: true, message: "Lütfen mevcut şifrenizi girin!" },
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              label='Yeni Şifre'
              name='newPassword'
              rules={[
                { required: true, message: "Lütfen yeni şifrenizi girin!" },
                { min: 6, message: "Şifre en az 6 karakter olmalıdır!" },
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}>
                Şifreyi Değiştir
              </Button>
            </Form.Item>
          </Form>

          <h3>Profil Fotoğrafı</h3>
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={(file) => {
              handleAvatarUpload(file)
              return false
            }}
            maxCount={1}>
            <Button icon={<UploadOutlined />}>Fotoğraf Yükle</Button>
          </Upload>
        </div>
      </div>
    </div>
  )
}

export default Profile
