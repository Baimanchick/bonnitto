'use client'
import React from 'react'
import toast from 'react-hot-toast'

import { useRouter } from 'next/navigation'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { register } from '@/store/features/auth/authSlice'

import cls from './page.module.css'

export default function Register() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string, password?: string, agree?: string }>({})

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

            <div className={cls.forgotPassword}>
              <input
                className={`${cls.checkbox} ${errors.agree ? cls.inputError : ''}`}
                type="checkbox"
              />
              <span>Я согласен с условиями использования</span>
            </div>

            <button className={cls.button} type="submit">{loading ? 'Загрузка...' : 'Регистрация'}</button>
            <div onClick={() => router.push('/auth/login')} className={cls.bottomText}>
              <span>Есть аккаунт?</span>
              <span>Вход</span>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
