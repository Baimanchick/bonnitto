import { Header } from '@/shared/ui/header/ui/Header'

import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>

      <main>
        <h1>hello</h1>
      </main>
    </div>
  )
}
