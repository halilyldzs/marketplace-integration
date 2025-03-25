import shipImage from "@/assets/ship.jpg"
import { useAuthSync } from "@hooks/useAuthSync"
import { firebaseAuthService } from "@services/firebase-auth.service"
import { useAuthStore } from "@store/auth"
import { Button, Checkbox, Form, Input, message } from "antd"
import CryptoJS from "crypto-js"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

const STORAGE_KEY = "auth_credentials"

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const setUser = useAuthStore((state) => state.setUser)
  const { notifyLogin } = useAuthSync()
  const [form] = Form.useForm()

  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        savedData,
        window.location.hostname
      ).toString(CryptoJS.enc.Utf8)
      const { email, password } = JSON.parse(decrypted)
      form.setFieldsValue({ email, password, remember: true })
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const onFinish = async (values: {
    email: string
    password: string
    remember: boolean
  }) => {
    try {
      const userCredential = await firebaseAuthService.login(values)
      const userData = await firebaseAuthService.getUserData(
        userCredential.user.uid
      )

      if (!userData) {
        throw new Error("Kullanıcı bilgileri bulunamadı!")
      }

      if (values.remember) {
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          window.location.hostname
        ).toString()
        localStorage.setItem(STORAGE_KEY, encrypted)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }

      login(userCredential.user.uid)
      setUser(userData)
      navigate("/dashboard")
      notifyLogin()
      message.success("Giriş başarılı!")
    } catch (error: Error | unknown) {
      message.error(
        error instanceof Error ? error.message : "Giriş yapılamadı!"
      )
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img
          src={shipImage}
          alt='Lojistik'
          className={styles.image}
        />
        <div className={styles.overlay}>
          <h1>Pazaryeri 360</h1>
          <p>E-ticaret süreçlerinizi kolayca yönetin</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2>Hoş Geldiniz</h2>
          <p className={styles.subtitle}>Devam etmek için giriş yapın</p>

          <Form
            form={form}
            name='login'
            onFinish={onFinish}
            layout='vertical'>
            <Form.Item
              label='E-posta'
              name='email'
              rules={[
                { required: true, message: "Lütfen e-posta adresinizi girin!" },
                { type: "email", message: "Geçerli bir e-posta adresi girin!" },
              ]}>
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Şifre'
              name='password'
              rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}>
              <Input.Password size='large' />
            </Form.Item>

            <Form.Item
              name='remember'
              valuePropName='checked'>
              <Checkbox>Beni Hatırla</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                block>
                Giriş Yap
              </Button>
            </Form.Item>

            <div className={styles.registerLink}>
              Hesabınız yok mu?{" "}
              <a onClick={() => navigate("/register")}>Kayıt olun</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
