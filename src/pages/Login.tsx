import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { Button, message } from "antd"
import React from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { useAuthStore } from "../store/auth"
import styles from "./Login.module.css"

interface LoginFormValues {
  username: string
  password: string
  remember?: boolean
}

const loginSchema = yup.object({
  username: yup.string().required("Kullanıcı adı gerekli"),
  password: yup
    .string()
    .required("Şifre gerekli")
    .min(6, "Şifre en az 6 karakter olmalı"),
  remember: yup.boolean(),
})

const Login: React.FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      remember: true,
    },
    resolver: yupResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      if (values.username === "admin" && values.password === "admin123") {
        return { success: true }
      }
      throw new Error("Hatalı giriş!")
    },
    onSuccess: () => {
      localStorage.setItem("isAuthenticated", "true")
      setAuth(true)
      message.success("Giriş başarılı!")
      window.location.replace("/dashboard")
    },
    onError: (error) => {
      message.error(error instanceof Error ? error.message : "Giriş başarısız!")
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values)
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formItem}>
              <span className={styles.prefix}>
                <UserOutlined />
              </span>
              <input
                {...register("username")}
                placeholder='Kullanıcı Adı'
                className={styles.input}
                disabled={loginMutation.isPending}
              />
              {errors.username && (
                <span className={styles.error}>{errors.username.message}</span>
              )}
            </div>

            <div className={styles.formItem}>
              <span className={styles.prefix}>
                <LockOutlined />
              </span>
              <input
                type='password'
                {...register("password")}
                placeholder='Şifre'
                className={styles.input}
                disabled={loginMutation.isPending}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password.message}</span>
              )}
            </div>

            <div className={styles.formItem}>
              <label>
                <input
                  type='checkbox'
                  {...register("remember")}
                  disabled={loginMutation.isPending}
                />
                <span>Beni Hatırla</span>
              </label>
              <a
                href='/forgot-password'
                style={{ float: "right" }}>
                Şifremi Unuttum
              </a>
            </div>

            <div className={styles.formItem}>
              <Button
                type='primary'
                htmlType='submit'
                block
                loading={loginMutation.isPending}>
                Giriş Yap
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
