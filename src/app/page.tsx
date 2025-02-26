'use client'

import { Header } from '@/shared/ui/header/ui/Header'
import ImageSlider from '@/shared/ui/ImageSlider/ImageSlider'

import styles from './page.module.css'
import Footer from '@/widgets/footer/ui/Footer'

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>

      <main>
        <ImageSlider/>
      </main>

      <Footer/>
    </div>
  )
}
