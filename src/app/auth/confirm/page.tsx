'use client'
import React from 'react'
import toast from 'react-hot-toast'

import { useRouter } from 'next/navigation'

import { useAppDispatch } from '@/shared/hooks/reduxHook'
import { PincodeField } from '@/shared/ui/pincode-field/pincode-field'
import { activateUser } from '@/store/features/auth/authSlice'

import cls from './page.module.css'

export default function Confirm() {
  const router = useRouter()
  const email = localStorage.getItem('email')
  const dispatch = useAppDispatch()
  const [pin, setPin] = React.useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<string | null>(null)

  const validate = React.useCallback(() => {
    if (pin.length !== 6 || pin.some(digit => digit === '')) {
      setErrors('Пин-код должен содержать 6 цифр')

      return false
    }
    setErrors(null)

    return true
  }, [pin])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Пожалуйста, исправьте ошибки в пин-коде')

      return
    }

    const code = pin.join('')

    setLoading(true)
    try {
      await dispatch(activateUser({ email, activation_code: code })).unwrap()
      toast.success('Вы успешно зарегистрировались')
      router.push('/')
      localStorage.removeItem('email')
    } catch (error) {
      console.log(error)
      toast.error('Произошла ошибка при активации аккаунта, попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }, [pin, dispatch, email, router, validate])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.confirm_container}>
          <h2>Введите код подтверждения</h2>
          <p>Мы отправили код на вашу почту</p>
          <form onSubmit={handleSubmit} className={cls.form}>
            <div>
              <PincodeField pin={pin} setPin={setPin} />
              {errors && <span className={cls.errorText}>{errors}</span>}
            </div>
            <button type="submit" className={cls.button} disabled={loading}>
              {loading ? 'Загрузка...' : 'Подтвердить'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
