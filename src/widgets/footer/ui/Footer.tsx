import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import cls from './Footer.module.css';
import {IBM_Plex_Sans_Devanagari} from 'next/font/google'

const footerData = [
  {
    title: null,
    logo: '/icons/footer/Bonnitto.svg',
  },
  {
    title: null,
    links: [
      { text: 'Оплата и доставка', href: '#' },
      { text: 'Возврат и обмен', href: '#' },
      { text: 'Контакты', href: '#' },
    ],
  },
  {
    title: null,
    links: [
      { text: 'Политика конфиденциальности', href: '#' },
      { text: 'Договор-оферта', href: '#' },
    ],
  },
  {
    title: null,
    links: [
      { text: 'О нас', href: '#' },
      { text: 'Найти нас', href: '#' },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          {footerData.map((column, index) => (
            <div key={index} className={styles.column}>
              {column.logo ? (
                <div className={cls.logoWrapper}>
                  <Image
                    src={column.logo}
                    alt="Bonnito Logo"
                    fill
                    style={{ objectFit: 'contain'  }}
                  />
                </div>

              ) : (
                column.links && column.links.map((link, linkIndex) => (
                  <a key={linkIndex} href={link.href}>
                    {link.text}
                  </a>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};


export default Footer;