'use client'
import React from 'react'
import toast from 'react-hot-toast'

import axios from 'axios'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { API_URL } from '@/shared/utils/const'
import { register } from '@/store/features/auth/authSlice'

import cls from './page.module.css'

export default function Register() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string, password?: string, agree?: string }>({})

  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  React.useEffect(() => {
    if (code) {
      handleGoogleAuth(code)
      router.push('/')
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
    const newErrors: { email?: string, password?: string, agree?: string } = {}

    if (!email) {
      newErrors.email = 'E-mail не может быть пустым!'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный E-mail'
    }

    if (!password) {
      newErrors.password = 'Пароль не может быть пустым!'
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }, [email, password])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!validate()) {
      toast.error('Пожалуйста, исправьте ошибки в форме')
      setLoading(false)

      return
    }

    try {
      await dispatch(register({ email, password })).unwrap()
      localStorage.setItem('email', email)
      toast('Пожалуйста, подтвердите почту')
      router.push('/auth/confirm')
    } catch (error) {
      console.log('ошибка при регистрации', error)
      toast.error('Произошла ошибка при регистрации, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [email, password, dispatch, router])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.register_container}>
          <form className={cls.form} onSubmit={handleSubmit}>
            <label className={cls.label}>E-mail</label>
            <div>
              <input
                className={`${cls.input} ${errors.email ? cls.inputError : ''}`}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className={cls.errorText}>{errors.email}</span>}
            </div>

            <label className={cls.label}>Пароль</label>
            <div>
              <input
                className={`${cls.input} ${errors.password ? cls.inputError : ''}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className={cls.errorText}>{errors.password}</span>}
            </div>

            <button className={cls.button} type="submit">{loading ? 'Загрузка...' : 'Регистрация'}</button>
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
            <div onClick={() => router.push('/auth/login')} className={cls.bottomText}>
              <span>Вход</span>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
