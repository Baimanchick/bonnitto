'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/shared/hooks/reduxHook'
import { Header } from '@/shared/ui/header/ui/Header'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
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
    </>
  )
}
