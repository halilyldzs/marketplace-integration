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
import { updatePassword } from "firebase/auth"
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
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)

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
    confirmPassword: string
  }) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error("Girdiğiniz şifreler eşleşmiyor!")
        return
      }

      setLoading(true)
      if (!auth.currentUser) throw new Error("No user logged in")
      await updatePassword(auth.currentUser, values.newPassword)
      message.success("Şifre başarıyla güncellendi!")
      passwordForm.resetFields()
      setIsPasswordModalVisible(false)
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
                  loading={loading}>
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
              form={form}
              layout='vertical'
              initialValues={user?.settings}
              onFinish={onFinish}>
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
                  loading={loading}>
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
              loading={loading}>
              Şifreyi Değiştir
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile
