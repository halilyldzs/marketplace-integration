import { UploadOutlined, UserOutlined } from "@ant-design/icons"
import { auth } from "@config/firebase"
import {
  DEFAULT_SETTINGS,
  firebaseAuthService,
} from "@services/firebase-auth.service"
import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Switch,
  Typography,
  Upload,
} from "antd"
import type { UploadFile } from "antd/es/upload/interface"
import {
  AuthError,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { useState } from "react"
import styles from "./Profile.module.css"
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "./consts/profile.options"
const { Title, Text } = Typography

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

export const Profile = () => {
  const user = useAuthStore((state) => state.user)
  const setTheme = useThemeStore((state) => state.setTheme)
  const setUser = useAuthStore((state) => state.setUser)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [preferencesForm] = Form.useForm()
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)

  // Separate loading states
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [preferencesLoading, setPreferencesLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onFinish = async (values: ProfileFormValues) => {
    try {
      setProfileLoading(true)

      await firebaseAuthService.updateUserData(user!.id, {
        ...values,
        updatedAt: new Date().toISOString(),
      })
      setUser({ ...user!, ...values })
      message.success("Kişisel bilgileriniz başarıyla güncellendi!")
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(
          `Kişisel bilgileriniz güncellenirken bir hata oluştu: ${error.message}`
        )
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (values: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error("Girdiğiniz şifreler eşleşmiyor!")
        return
      }

      setPasswordLoading(true)
      if (!auth.currentUser) {
        message.error("Oturum açık değil. Lütfen tekrar giriş yapın.")
        return
      }

      // Önce kullanıcıyı yeniden doğrula
      try {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email!,
          values.currentPassword
        )
        await reauthenticateWithCredential(auth.currentUser, credential)
      } catch (error: unknown) {
        if (error instanceof Error) {
          const authError = error as AuthError
          switch (authError.code) {
            case "auth/wrong-password":
              message.error("Mevcut şifreniz yanlış!")
              break
            case "auth/too-many-requests":
              message.error(
                "Çok fazla başarısız deneme. Lütfen bir süre bekleyin."
              )
              break
            case "auth/user-token-expired":
              message.error(
                "Oturumunuz süresi dolmuş. Lütfen tekrar giriş yapın."
              )
              break
            case "auth/user-not-found":
              message.error("Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.")
              break
            case "auth/invalid-credential":
              message.error(
                "Geçersiz kimlik bilgileri. Lütfen tekrar giriş yapın."
              )
              break
            default:
              message.error(
                "Kimlik doğrulama başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin."
              )
          }
        }
        setPasswordLoading(false)
        return
      }

      // Şifreyi güncelle
      try {
        await updatePassword(auth.currentUser, values.newPassword)
        message.success("Şifre başarıyla güncellendi!")
        passwordForm.resetFields()
        setIsPasswordModalVisible(false)
      } catch (error: unknown) {
        if (error instanceof Error) {
          const authError = error as AuthError
          switch (authError.code) {
            case "auth/requires-recent-login":
              message.error(
                "Bu işlem için yakın zamanda giriş yapılmış olması gerekiyor. Lütfen çıkış yapıp tekrar giriş yapın."
              )
              break
            case "auth/weak-password":
              message.error(
                "Yeni şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin."
              )
              break
            default:
              message.error(
                `Şifre güncellenirken bir hata oluştu: ${authError.message}`
              )
          }
        }
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setAvatarLoading(true)
      const storage = getStorage()
      const storageRef = ref(storage, `avatars/${user!.id}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await firebaseAuthService.updateUserData(user!.id, {
        avatar: downloadURL,
      })
      setUser({ ...user!, avatar: downloadURL })
      message.success("Profil fotoğrafı güncellendi!")
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(
          `Profil fotoğrafı yüklenirken bir hata oluştu: ${error.message}`
        )
      }
    } finally {
      setAvatarLoading(false)
    }
  }

  const handlePreferencesUpdate = async (values: ProfileFormValues) => {
    try {
      setPreferencesLoading(true)
      await firebaseAuthService.updateUserData(user!.id, {
        settings: values.settings,
        updatedAt: new Date().toISOString(),
      })
      setUser({ ...user!, settings: values.settings || DEFAULT_SETTINGS })
      message.success("Tercihler başarıyla güncellendi!")
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(
          `Tercihler güncellenirken bir hata oluştu: ${error.message}`
        )
      }
    } finally {
      setPreferencesLoading(false)
    }
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.pageHeader}>
        <Title
          level={2}
          className={styles.pageTitle}>
          Profile Settings
        </Title>
        <Text
          type='secondary'
          className={styles.pageDescription}>
          Manage your account settings and preferences
        </Text>
      </div>

      <div className={styles.profileGrid}>
        <Card className={styles.avatarSection}>
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={user?.avatar}
          />
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={(file) => {
              handleAvatarUpload(file)
              return false
            }}
            maxCount={1}
            showUploadList={false}>
            <Button
              type='primary'
              icon={<UploadOutlined />}
              className={styles.uploadButton}
              loading={avatarLoading}>
              Fotoğraf Yükle
            </Button>
          </Upload>
        </Card>

        <Card className={styles.preferencesSection}>
          <Form
            form={form}
            layout='vertical'
            className={styles.preferencesForm}
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
              <Input placeholder='Adınız ve soyadınız' />
            </Form.Item>

            <Form.Item
              label='E-posta'
              name='email'
              rules={[
                { required: true, message: "Lütfen e-posta adresinizi girin!" },
                { type: "email", message: "Geçerli bir e-posta adresi girin!" },
              ]}>
              <Input
                placeholder='E-posta adresiniz'
                disabled
              />
            </Form.Item>

            <Form.Item
              label='Telefon'
              name='phoneNumber'>
              <Input placeholder='Telefon numaranız' />
            </Form.Item>

            <Form.Item>
              <Button
                onClick={() => setIsPasswordModalVisible(true)}
                style={{ marginRight: 8 }}>
                Şifreyi Değiştir
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={profileLoading}>
                Kaydet
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div className={styles.settingsSection}>
        <Card title='Tercihler'>
          <Form
            form={preferencesForm}
            layout='vertical'
            preserve={false}
            onFinish={handlePreferencesUpdate}>
            <Row gutter={24}>
              <Col
                xs={24}
                md={8}>
                <Form.Item
                  label='Tema'
                  name={["settings", "theme"]}
                  initialValue={user?.settings?.theme || "light"}>
                  <Select
                    onChange={(value) => {
                      setTheme(value === "dark")
                    }}
                    options={THEME_OPTIONS}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={8}>
                <Form.Item
                  label='Dil'
                  name={["settings", "language"]}
                  initialValue={user?.settings?.language || "tr"}>
                  <Select options={LANGUAGE_OPTIONS} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={8}>
                <Form.Item
                  label='Bildirimler'
                  name={["settings", "notifications"]}
                  valuePropName='checked'
                  initialValue={user?.settings?.notifications || false}>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button
                type='primary'
                htmlType='submit'
                loading={preferencesLoading}>
                Tercihleri Kaydet
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Modal
        title='Şifre Değiştir'
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false)
          passwordForm.resetFields()
        }}
        centered
        footer={null}
        maskClosable={false}>
        <Form
          form={passwordForm}
          layout='vertical'
          onFinish={handlePasswordChange}>
          <Form.Item
            label='Mevcut Şifre'
            name='currentPassword'
            rules={[
              {
                required: true,
                message: "Lütfen mevcut şifrenizi girin!",
              },
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

          <Form.Item
            label='Yeni Şifre (Tekrar)'
            name='confirmPassword'
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Lütfen yeni şifrenizi tekrar girin!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error("Girdiğiniz şifreler eşleşmiyor!")
                  )
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button
              onClick={() => {
                setIsPasswordModalVisible(false)
                passwordForm.resetFields()
              }}
              style={{ marginRight: 8 }}>
              İptal
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={passwordLoading}>
              Şifreyi Değiştir
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile
