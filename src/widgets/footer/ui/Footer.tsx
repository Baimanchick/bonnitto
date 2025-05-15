'use client'

import React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import Insta from '../../../shared/assets/black-instagram-icon.svg'
import Telega from '../../../shared/assets/telegram-black-icon.svg'

import cls from './Footer.module.css'

const footerData = [
  {
    id: 'logo',
    logo: '/icons/footer/Bonnitto.svg',
  },
  {
    id: 'column1',
    links: [
      { text: 'Доставка и оплата', link: '/delivery' },
      { text: 'Обмен и возрат', link: '/return-exchanges' },
      { text: 'Контакты', link: '/contacts' },
    ],
  },
  {
    id: 'column2',
    links: [
      { text: 'Политика конфиденциальности', link: '/privacy' },
      { text: 'Договор-оферта', link:'/offer-agreement' },
    ],
  },
  {
    id: 'column3',
    links: [
      { text: 'О нас', link: '/about' },
      { text: 'Найти нас', link: '/found' },
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
          <a href="https://www.instagram.com/bonnitto.store?igsh=amVieGlzeWYyeGM2" style={{ cursor: 'pointer' }}>
            <Image src={Insta} alt="svg" width={24} height={24} />
          </a>
          <a href="https://t.me/bonnittostore" style={{ cursor: 'pointer' }}>
            <Image src={Telega} alt="svg" width={24} height={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
