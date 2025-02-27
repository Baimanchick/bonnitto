'use client'

import React from 'react'

import { Header } from '@/shared/ui/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header/>
      {children}
      <Footer/>
    </>
  )
}
