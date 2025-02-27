import React from 'react'

import Image from 'next/image'

import cls from './Footer.module.css'
import styles from './Footer.module.css'

const footerData = [
  {
    id: 'logo',
    logo: '/icons/footer/Bonnitto.svg',
  },
  {
    id: 'column1',
    links: [
      { text: 'Оплата и доставка', href: '/payment-delivery' },
      { text: 'Возврат и обмен', href: '/return-exchange' },
      { text: 'Контакты', href: '/contacts' },
    ],
  },
  {
    id: 'column2',
    links: [
      { text: 'Политика конфиденциальности', href: '/privacy-policy' },
      { text: 'Договор-оферта', href: '/offer-agreement' },
    ],
  },
  {
    id: 'column3',
    links: [
      { text: 'О нас', href: '/about-us' },
      { text: 'Найти нас', href: '/find-us' },
    ],
  },
]

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          {footerData.map((column) => (
            <div key={column.id} className={styles.column}>
              {column.logo ? (
                <div className={cls.logoWrapper}>
                  <Image
                    src={column.logo}
                    alt="Bonnito Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ) : (
                column.links && column.links.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.text}
                  </a>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
