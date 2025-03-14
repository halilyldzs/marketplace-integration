import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Checkbox, Form, Input, message } from "antd"
import React from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

interface LoginFormValues {
  username: string
  password: string
  remember: boolean
}

interface LoginProps {
  setAuth: (value: boolean) => void
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const navigate = useNavigate()

  const onFinish = async (values: LoginFormValues) => {
    try {
      // Burada gerçek bir API çağrısı yapılmalı
      if (values.username === "admin" && values.password === "admin123") {
        localStorage.setItem("isAuthenticated", "true")
        setAuth(true)
        message.success("Giriş başarılı!")
        navigate("/dashboard", { replace: true })
      } else {
        message.error("Kullanıcı adı veya şifre hatalı!")
      }
    } catch (error) {
      console.error("Login error:", error)
      message.error("Giriş işlemi sırasında bir hata oluştu!")
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <div className={styles.imageContent}>
          <h1>Lojistik Yönetim Sistemi</h1>
          <p>
            Modern ve güvenli platformumuz ile lojistik operasyonlarınızı
            kolayca yönetin
          </p>
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>
            <h2>Giriş Yap</h2>
            <p>Hesabınıza giriş yaparak devam edin</p>
          </div>
          <Form<LoginFormValues>
            name='login'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size='large'>
            <Form.Item
              name='username'
              rules={[
                { required: true, message: "Lütfen kullanıcı adınızı girin!" },
              ]}>
              <Input
                prefix={<UserOutlined />}
                placeholder='Kullanıcı Adı'
              />
            </Form.Item>

            <Form.Item
              name='password'
              rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Şifre'
              />
            </Form.Item>

            <Form.Item>
              <Form.Item
                name='remember'
                valuePropName='checked'
                noStyle>
                <Checkbox>Beni Hatırla</Checkbox>
              </Form.Item>
              <a
                href='/forgot-password'
                style={{ float: "right" }}>
                Şifremi Unuttum
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
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
