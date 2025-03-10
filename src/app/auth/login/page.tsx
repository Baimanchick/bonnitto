'use client'

import React from 'react'
import toast from 'react-hot-toast'

import axios from 'axios'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { API_URL } from '@/shared/utils/const'
import { login } from '@/store/features/auth/authSlice'

import cls from './page.module.css'

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string, password?: string }>({})

  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  React.useEffect(() => {
    if (code) {
      handleGoogleAuth(code)
    }
  }, [code])

  const handleGoogleAuth = async (authorizationCode: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/users/auth/google/`, {
        code: authorizationCode,
      })

      const { refresh, access, user } = data

      localStorage.setItem('tokens', JSON.stringify({ refresh, access }))
      localStorage.setItem('user', JSON.stringify(user))

      // dispatch(authSlice.actions.setTokens({ refresh, access }))
      // dispatch(authSlice.actions.setUser(user))

      toast.success('Вы успешно вошли через Google!')
      router.push('/')
    } catch (error) {
      console.error('Google OAuth error', error)
      toast.error('Ошибка входа через Google')
    }
  }

  const handleGoogleLogin = () => {
    const clientId = '621400015086-rd89l55lb24pgh4rbmjgg6fcr7cqkf5m.apps.googleusercontent.com'
    // const redirectUri = 'http://localhost:3000/auth/login/'
    const redirectUri = 'https://bonnitto.ru/auth/login/'
    const scope = 'openid profile email'
    const responseType = 'code'
    const prompt = 'consent'

    const googleUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${responseType}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&prompt=${prompt}`

    window.location.href = googleUrl
  }

  const validate = React.useCallback(() => {
    const newErrors: { email?: string, password?: string } = {}

    if (!email) {
      newErrors.email = 'E-mail не может быть пустым!'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный E-mail'
    }

    if (!password) {
      newErrors.password = 'Пароль не может быть пустым!'
    }
    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }, [email, password])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()

    if (!validate()) {
      toast.error('Пожалуйста, исправьте ошибки в форме')
      setLoading(false)

      return
    }

    try {
      await dispatch(login({ email, password })).unwrap()
      toast.success('Вы успешно вошли')
      router.push('/')
    } catch (error) {
      console.log('ошибка авторизации', error)
      toast.error('Произошла ошибка при входе, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [email, password, dispatch, router, validate])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.login_container}>
          <form className={cls.form} onSubmit={handleSubmit}>
            <label className={cls.label}>E-mail</label>
            <div>
              <input
                className={`${cls.input} ${errors.email ? cls.inputError : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
              />
              {errors.email && <span className={cls.errorText}>{errors.email}</span>}
            </div>
            <label className={cls.label}>Пароль</label>
            <div>
              <input
                className={`${cls.input} ${errors.password ? cls.inputError : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
              {errors.password && <span className={cls.errorText}>{errors.password}</span>}
            </div>

            <div
              onClick={() => router.push('/auth/reset-password')}
              className={cls.forgotPassword}
            >
              <span>Забыли пароль?</span>
            </div>

            <button type="submit" className={cls.button}>
              {loading ? 'Загрузка...' : 'Войти'}
            </button>

            <div className={cls.bottomText}>
              <div className={cls.google_sign} onClick={handleGoogleLogin}>
                <span>Войти с помощью :</span>
                <Image
                  src={'/icons/login/google.svg'}
                  alt="google svg"
                  className={cls.icon}
                  width={22}
                  height={22}
                />
              </div>
              <div className={cls.bottomText_item}>
                <span onClick={() => router.push('/auth/register')}>Регистрация</span>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
