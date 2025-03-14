import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useAuthStore } from "@store/auth"
import styles from "@styles/features/auth/Login.module.css"
import { Button, Form, Input, message } from "antd"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      await login(values)
      navigate("/dashboard")
    } catch (error) {
      message.error("Giriş başarısız!")
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <div className={styles.imageContent}>
          <h1>Lojistik YS</h1>
          <p>
            Lojistik süreçlerinizi kolayca yönetin, siparişlerinizi takip edin.
          </p>
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>
            <h2>Hoş Geldiniz</h2>
            <p>Devam etmek için giriş yapın</p>
          </div>
          <Form
            name='login'
            onFinish={onFinish}
            layout='vertical'
            size='large'>
            <div className={styles.formItem}>
              <Form.Item
                name='username'
                rules={[
                  {
                    required: true,
                    message: "Lütfen kullanıcı adınızı girin!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className={styles.prefix} />}
                  placeholder='Kullanıcı Adı'
                  className={styles.input}
                />
              </Form.Item>
            </div>

            <div className={styles.formItem}>
              <Form.Item
                name='password'
                rules={[
                  { required: true, message: "Lütfen şifrenizi girin!" },
                ]}>
                <Input.Password
                  prefix={<LockOutlined className={styles.prefix} />}
                  placeholder='Şifre'
                  className={styles.input}
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: "100%" }}>
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
