'use client'

import React from 'react'
import toast from 'react-hot-toast'

import { useRouter } from 'next/navigation'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { PincodeField } from '@/shared/ui/pincode-field/pincode-field'
import { passwordReset, passwordResetConfirm } from '@/store/features/auth/authSlice'

import cls from './page.module.css'

export default function ResetPassword() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [email, setEmail] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [pin, setPin] = React.useState<string[]>(Array(6).fill(''))
  const [isNextStep, setIsNextStep] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handlePasswordReset = React.useCallback(async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    try {
      await dispatch(passwordReset({ email })).unwrap()
      toast('Подтвердите почту и придумайте новый пароль')

      setIsNextStep(true)
    } catch (error) {
      console.log('ошибка сбрасывания пароля', error)
      toast.error('Произошла ошибка при сбрасывания пароля, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [email, dispatch, router])

  const handlePasswordResetConfirm = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const code = pin.join('')

    if (code.length !== 6) {
      toast.error('Введите все цифры из пин-кода')
    }
    setLoading(true)
    try {
      await dispatch(passwordResetConfirm({ email, new_password: newPassword, code: code })).unwrap()

      router.push('/auth/login')
      toast.success('Вы успешно сменили пароль! Пожалуйста, войдите в аккаунт.')

    } catch (error) {
      console.log('ошибка сбрасывания пароля', error)
      toast.error('Произошла ошибка при сбрасывания пароля, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [pin ,email, newPassword, dispatch, router])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.resetPassword_container}>
          {!isNextStep ? (
            <form className={cls.form} onSubmit={handlePasswordReset}>
              <label className={cls.label}>E-mail</label>
              <input className={cls.input} value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
              <button type="submit" className={cls.button}>{loading ? 'Загрузка...' : 'Продолжить'}</button>
            </form>
          ) : (
            <form className={cls.form} onSubmit={handlePasswordResetConfirm}>
              <label className={cls.label}>Код подтверждения</label>
              <PincodeField pin={pin} setPin={setPin}/>
              <label className={cls.label}>Новый Пароль</label>
              <input className={cls.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
              <button type="submit" className={cls.button}>{loading ? 'Загрузка...' : 'Сменить пароль'}</button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
