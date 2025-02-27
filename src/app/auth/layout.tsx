'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/shared/hooks/reduxHook'
import { Header } from '@/shared/ui/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    if (isAuth) {
      router.push('/')
    } else {
      setChecked(true)
    }
  }, [isAuth, router])

  if (!checked) {
    return null
  }

  return (
    <>
      <Header/>
      {children}
      <Footer/>
    </>
  )
}
