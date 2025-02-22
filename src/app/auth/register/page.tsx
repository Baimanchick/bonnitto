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

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(register({ email, password })).unwrap()
      localStorage.setItem('email', email)
      toast('Пложалуйтса подтвердите почту ')
      router.push('/auth/confirm')
    } catch (error) {
      console.log('ошибка при регистрации',error)
      toast.error('Произошла ошибка при регистрации, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [email, password, dispatch, router])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.register_container}>   
          {/* <h1 className={cls.main_title}>Создайте аккаунт и откройте мир моды!</h1> */}
          <form className={cls.form} onSubmit={handleSubmit}>
            <label className={cls.label}>E-mail</label>
            <input className={cls.input} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className={cls.label}>Пароль</label>
            <input className={cls.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className={cls.forgotPassword}>
              <input className={cls.checkbox} type="checkbox" />
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
