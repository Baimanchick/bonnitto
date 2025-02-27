'use client'

import React from 'react'
import toast from 'react-hot-toast'

import { useRouter } from 'next/navigation'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { login } from '@/store/features/auth/authSlice'

import cls from './page.module.css'

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
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
  }, [email, password, dispatch, router])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.login_container}>
          <form className={cls.form} onSubmit={handleSubmit}>
            <label className={cls.label}>E-mail</label>
            <input className={cls.input} value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
            <label className={cls.label}>Пароль</label>
            <input className={cls.input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            <div onClick={() => router.push('/auth/reset-password')} className={cls.forgotPassword}>
              <span>Забыли пароль?</span>
            </div>
            <button type="submit" className={cls.button}>{loading ? 'Загрузка...' : 'Войти'}</button>
            <div className={cls.bottomText}>
              <div className={cls.google_sign}>
                {/* <span>Войти с помощью :</span>
                <Image src={'/icons/login/google.svg'} alt="google svg" className={cls.icon} width={22} height={22} onClick={() => router.push('/auth/login')}/> */}
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
