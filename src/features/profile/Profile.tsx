import { UploadOutlined } from "@ant-design/icons"
import { auth } from "@config/firebase"
import { firebaseAuthService } from "@services/firebase-auth.service"
import { useAuthStore } from "@store/auth"
import {
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

const { Option } = Select
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

const Profile = () => {
  const user = useAuthStore((state) => state.user)
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

      console.log("values", values)

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
      setUser({ ...user!, settings: values.settings })
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
      <Title
        className={styles.pageTitle}
        level={2}>
        Profil Ayarları
      </Title>
      <Text
        className={styles.pageDescription}
        type='secondary'>
        Hesap bilgilerinizi ve tercihlerinizi buradan yönetebilirsiniz.
      </Text>

      <Row
        gutter={[24, 24]}
        className={`${styles.rowContainer} ${styles.centeredRow}`}>
        <Col className={styles.centeredCol}>
          <Card
            bordered={false}
            className={styles.avatarCard}>
            <div className={styles.avatarContainer}>
              <div
                className={`${styles.avatarCircle} ${
                  user?.avatar
                    ? styles.avatarCircleWithImage
                    : styles.avatarCircleNoImage
                }`}>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt='Profil'
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
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
                  icon={<UploadOutlined />}
                  loading={avatarLoading}
                  className={styles.uploadButton}>
                  Fotoğraf Yükle
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
      </Row>

      <Row
        gutter={[24, 24]}
        className={styles.rowContainer}>
        <Col span={24}>
          <Card
            title='Kişisel Bilgiler'
            bordered={false}
            className={styles.cardContainer}>
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
              <Row gutter={24}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='E-posta'
                    name='email'
                    rules={[
                      {
                        required: true,
                        message: "Lütfen e-posta adresinizi girin!",
                      },
                      {
                        type: "email",
                        message: "Geçerli bir e-posta adresi girin!",
                      },
                    ]}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Telefon'
                    name='phoneNumber'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: "right" }}>
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
        </Col>
      </Row>

      <Row
        gutter={[24, 24]}
        className={styles.rowContainer}>
        <Col xs={24}>
          <Card
            title='Tercihler'
            bordered={false}
            className={styles.cardContainer}>
            <Form
              form={preferencesForm}
              layout='vertical'
              initialValues={user?.settings}
              onFinish={handlePreferencesUpdate}>
              <Row gutter={24}>
                <Col
                  xs={24}
                  md={8}>
                  <Form.Item
                    label='Tema'
                    name={["settings", "theme"]}>
                    <Select className={styles.fullWidthSelect}>
                      <Option value='light'>Açık</Option>
                      <Option value='dark'>Koyu</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  md={8}>
                  <Form.Item
                    label='Dil'
                    name={["settings", "language"]}>
                    <Select className={styles.fullWidthSelect}>
                      <Option value='tr'>Türkçe</Option>
                      <Option value='en'>English</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  md={8}>
                  <Form.Item
                    label='Bildirimler'
                    name={["settings", "notifications"]}
                    valuePropName='checked'>
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={preferencesLoading}>
                  Tercihleri Kaydet
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

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
