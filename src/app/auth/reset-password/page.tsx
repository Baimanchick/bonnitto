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
  const [errors, setErrors] = React.useState<{ email?: string, newPassword?: string, pin?: string }>({})

  const validate = React.useCallback(() => {
    const newErrors: { email?: string, newPassword?: string, pin?: string } = {}

    if (!email) {
      newErrors.email = 'E-mail не может быть пустым!'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный E-mail'
    }

    if (!newPassword && isNextStep) {
      newErrors.newPassword = 'Пароль не может быть пустым!'
    } else if (newPassword.length < 6 && isNextStep) {
      newErrors.newPassword = 'Пароль должен содержать минимум 6 символов'
    }

    if (pin.some(p => p === '' && isNextStep)) {
      newErrors.pin = 'Пин-код должен содержать все цифры'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }, [email, newPassword, pin])

  const handlePasswordReset = React.useCallback(async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()

    if (!validate()) {
      toast.error('Пожалуйста, исправьте ошибки в форме')
      setLoading(false)

      return
    }

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
  }, [email, validate, dispatch, router])

  const handlePasswordResetConfirm = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Пожалуйста, исправьте ошибки в форме')

      return
    }

    const code = pin.join('')

    if (code.length !== 6) {
      toast.error('Введите все цифры из пин-кода')

      return
    }

    setLoading(true)
    try {
      await dispatch(passwordResetConfirm({ email, new_password: newPassword, code })).unwrap()

      router.push('/auth/login')
      toast.success('Вы успешно сменили пароль! Пожалуйста, войдите в аккаунт.')
    } catch (error) {
      console.log('ошибка сбрасывания пароля', error)
      toast.error('Произошла ошибка при сбрасывания пароля, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [pin, email, newPassword, validate, dispatch, router])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.resetPassword_container}>
          {!isNextStep ? (
            <form className={cls.form} onSubmit={handlePasswordReset}>
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
              <button type="submit" className={cls.button}>{loading ? 'Загрузка...' : 'Продолжить'}</button>
            </form>
          ) : (
            <form className={cls.form} onSubmit={handlePasswordResetConfirm}>
              <label className={cls.label}>Код подтверждения</label>
              <div>
                <PincodeField pin={pin} setPin={setPin}/>
                {errors.pin && <span className={cls.errorText}>{errors.pin}</span>}
              </div>
              <label className={cls.label}>Новый Пароль</label>
              <div>
                <input
                  className={`${cls.input} ${errors.newPassword ? cls.inputError : ''}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                />
                {errors.newPassword && <span className={cls.errorText}>{errors.newPassword}</span>}
              </div>
              <button type="submit" className={cls.button}>{loading ? 'Загрузка...' : 'Сменить пароль'}</button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
