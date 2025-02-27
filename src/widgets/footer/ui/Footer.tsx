'use client'

import React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import cls from './Footer.module.css'

const footerData = [
  {
    id: 'logo',
    logo: '/icons/footer/Bonnitto.svg',
  },
  {
    id: 'column1',
    links: [
      { text: 'Оплата и доставка' },
      { text: 'Возврат и обмен' },
      { text: 'Контакты' },
    ],
  },
  {
    id: 'column2',
    links: [
      { text: 'Политика конфиденциальности' },
      { text: 'Договор-оферта' },
    ],
  },
  {
    id: 'column3',
    links: [
      { text: 'О нас' },
      { text: 'Найти нас' },
    ],
  },
]

const Footer: React.FC = () => {
  const router = useRouter()

  return (
    <footer className={cls.footer}>
      <div className={cls.container}>
        <div className={cls.links}>
          {footerData.map((column) => (
            <div key={column.id} className={cls.column}>
              {column.logo ? (
                <div className={cls.logoWrapper}>
                  <Image
                    src={column.logo}
                    alt="Bonnito Logo"
                    fill
                    className={cls.logo}
                    onClick={() => router.push('/')}
                  />
                </div>
              ) : (
                column.links && column.links.map((link) => (
                  <div key={link.text.length}>
                    {link.text}
                  </div>
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
