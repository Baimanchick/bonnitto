'use client'

import { useRouter } from 'next/navigation'

import { Header } from '@/shared/ui/header/ui/Header'

import styles from './page.module.css'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <Header/>

      <main className={styles.not_found}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text} style={{ textAlign: 'center' }}>Мы не смогли найти сайт по адресу, проверьте адрес ещё раз</p>
        <button className={styles.btn} onClick={() => router.push('/')}>Вернуться на главную страницу</button>
      </main>
    </div>
  )
}
