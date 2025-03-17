import { authService } from "@services/auth.service"
import { LoginCredentials } from "@sharedTypes/auth"
import { useAuthStore } from "@store/auth"
import { Button, Form, Input, message } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const onFinish = async (values: LoginCredentials) => {
    try {
      const { token } = await authService.login(values)
      login(token)
      navigate("/dashboard")
      message.success("Giriş başarılı!")
    } catch {
      message.error("Kullanıcı adı veya şifre hatalı!")
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
              label='Kullanıcı Adı'
              name='username'
              rules={[
                { required: true, message: "Lütfen kullanıcı adınızı girin!" },
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
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
