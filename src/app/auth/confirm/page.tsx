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

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const code = pin.join('')

    if (code.length !== 6) {
      toast.error('Введите все цифры из пин-кода')
    }
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
  }, [pin, dispatch, email, router])

  return (
    <div className={cls.page}>
      <main className={cls.main}>
        <div className={cls.confirm_container}>
          <h2>Введите код подтверждения</h2>
          <p>Мы отправили код на вашу почту</p>
          <form onSubmit={handleSubmit} className={cls.form}>
            <PincodeField pin={pin} setPin={setPin} />
            <button type="submit" className={cls.button} disabled={loading}>
              {loading ? 'Загрузка...' : 'Подтвердить'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
