import shipImage from "@/assets/ship.jpg"
import { firebaseAuthService } from "@services/firebase-auth.service"
import { Button, Form, Input, message } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

interface RegisterFormValues {
  email: string
  password: string
  fullName: string
  username: string
  phoneNumber: string
}

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setLoading(true)
      await firebaseAuthService.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        username: values.username,
        phoneNumber: values.phoneNumber,
      })
      message.success("Kayıt başarılı! Giriş yapabilirsiniz.")
      navigate("/login")
    } catch (error: Error | unknown) {
      message.error(
        error instanceof Error
          ? error.message
          : "Kayıt sırasında bir hata oluştu!"
      )
    } finally {
      setLoading(false)
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
          <h2>Kayıt Ol</h2>
          <p className={styles.subtitle}>Yeni bir hesap oluşturun</p>

          <Form
            name='register'
            onFinish={onFinish}
            layout='vertical'>
            <Form.Item
              label='Ad Soyad'
              name='fullName'
              rules={[
                {
                  required: true,
                  message: "Lütfen adınızı ve soyadınızı girin!",
                },
              ]}>
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Kullanıcı Adı'
              name='username'
              rules={[
                { required: true, message: "Lütfen kullanıcı adı girin!" },
              ]}>
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Telefon'
              name='phoneNumber'
              rules={[
                { required: true, message: "Lütfen telefon numaranızı girin!" },
                {
                  pattern: /^5[0-9]{9}$/,
                  message:
                    "Telefon numarası 5 ile başlamalı ve 10 hane olmalıdır! (5XX XXX XXXX)",
                },
              ]}>
              <Input
                size='large'
                placeholder='5XX XXX XXXX'
                maxLength={10}
              />
            </Form.Item>

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
              rules={[
                { required: true, message: "Lütfen şifrenizi girin!" },
                { min: 6, message: "Şifre en az 6 karakter olmalıdır!" },
              ]}>
              <Input.Password size='large' />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                loading={loading}
                block>
                Kayıt Ol
              </Button>
            </Form.Item>

            <div className={styles.registerLink}>
              Zaten hesabınız var mı?{" "}
              <a onClick={() => navigate("/login")}>Giriş yapın</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Register
