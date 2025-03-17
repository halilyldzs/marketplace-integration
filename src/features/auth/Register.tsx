import { firebaseAuthService } from "@services/firebase-auth.service"
import { Button, Form, Input, message } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

interface RegisterFormValues {
  email: string
  password: string
  fullName: string
  username: string
}

const Register = () => {
  const navigate = useNavigate()

  const onFinish = async (values: RegisterFormValues) => {
    try {
      await firebaseAuthService.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        username: values.username,
      })
      message.success("Kayıt başarılı! Giriş yapabilirsiniz.")
      navigate("/login")
    } catch (error: Error | unknown) {
      message.error(
        error instanceof Error
          ? error.message
          : "Kayıt sırasında bir hata oluştu!"
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
