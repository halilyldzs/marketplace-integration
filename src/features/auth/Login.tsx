import { firebaseAuthService } from "@services/firebase-auth.service"
import { useAuthStore } from "@store/auth"
import { Button, Form, Input, message } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const setUser = useAuthStore((state) => state.setUser)

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const userCredential = await firebaseAuthService.login(values)
      const userData = await firebaseAuthService.getUserData(
        userCredential.user.uid
      )

      if (!userData) {
        throw new Error("Kullanıcı bilgileri bulunamadı!")
      }

      login(userCredential.user.uid)
      setUser(userData)
      navigate("/dashboard")
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
          src='/public/assets/ship.jpg'
          alt='Lojistik'
          className={styles.image}
        />
        <div className={styles.overlay}>
          <h1>Lojistik YS</h1>
          <p>Lojistik süreçlerinizi kolayca yönetin</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2>Hoş Geldiniz</h2>
          <p className={styles.subtitle}>Devam etmek için giriş yapın</p>

          <Form
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
