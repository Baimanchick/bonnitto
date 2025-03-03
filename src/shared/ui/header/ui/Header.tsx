'use client'

import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/shared/hooks/reduxHook'

import cls from './Header.module.css'

export const Header = () => {
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleMenu = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <header className={`${cls.header} ${isOpen ? cls.headerOpen : ''}`}>
      <div className={'container'}>
        <div className={cls.items}>
          <div className={`${cls.item}`} onClick={toggleMenu}>
            <div className={`${cls.burger} ${isOpen ? cls.open : ''}`}>
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={`${cls.item_mobile}`}>
            <div
              className={`${cls.burger} ${isOpen ? cls.open : ''}`}
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </div>
            <div className={cls.searchContainer}>
              <Image onClick={() => router.push('/auth/register')} src={isOpen ? '/icons/header/user_light.svg' : '/icons/header/user.svg'} style={{ display: `${isAuth ? 'none' : ''}` }} alt="profile" width={22} height={22} />
            </div>
          </div>

          <div className={cls.item_logo}>
            <Image
              src={isOpen ? '/icons/header/logo_light.svg' : '/icons/header/logo_main.svg'}
              onClick={() => router.push('/')}
              alt="Logo"
              width={50}
              height={75}
              priority
            />
            {
              !isOpen && (
                <Image
                  src={'/icons/header/logo_text.svg'}
                  onClick={() => router.push('/')}
                  alt="Logo"
                  width={270}
                  height={75}
                  className={cls.logo_text}
                  priority
                  style={{ marginLeft: '10px' }}
                />
              )
            }
          </div>

          <div className={cls.item}>
            <div className={cls.actions}>
              <Image onClick={() => router.push('/auth/register')} src={isOpen ? '/icons/header/user_light.svg' : '/icons/header/user.svg'} style={{ display: `${isAuth ? 'none' : ''}` }} alt="profile" width={22} height={22} />
              <Image onClick={() => router.push('/favorites/')} src={isOpen ? '/icons/header/heart_light.svg' : '/icons/header/heart.svg'} alt="favorites_products" width={22} height={22} />
              <Image onClick={() => router.push('/cart/')} src={isOpen ? '/icons/header/cart_light.svg' : '/icons/header/shopping_bag.svg'} alt="cart_products" width={22} height={22} />
            </div>
          </div>

          <div className={cls.item_mobile}>
            <div className={cls.actions}>
              <Image onClick={() => router.push('/favorites/')} src={isOpen ? '/icons/header/heart_light.svg' : '/icons/header/heart.svg'} alt="favorites_products" width={22} height={22} />
              <Image onClick={() => router.push('/cart/')} src={isOpen ? '/icons/header/cart_light.svg' : '/icons/header/shopping_bag.svg'} alt="cart_products" width={22} height={22} />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          className={cls.menu}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className={cls.container_menu}>
            <AnimatePresence mode="wait">
              <motion.div
                key="menuContent"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.4 }}
                className={cls.menuContent}
              >
                <div className={cls.menuLeft}>
                  <ul>
                    <h4 className={cls.menu_title}>Новинки</h4>
                    <li onClick={() => router.push('/popular')}>Популярное</li>
                    <li onClick={() => router.push('/new-year')}>Новогодняя коллекция</li>
                    <li onClick={() => router.push('/sale')}>Sale</li>
                    <li onClick={() => router.push('/products/')}>Весь ассортимент</li>
                  </ul>

                  <div className={cls.menuBlock}>
                    <h4 className={cls.menu_title}>ПОКУПАТЕЛЯМ</h4>
                    <ul>
                      <li className={cls.default_title} onClick={() => router.push('/about')}>О бренде</li>
                      <li className={cls.default_title} onClick={() => router.push('/shops')}>Магазины</li>
                      <li className={cls.default_title} onClick={() => router.push('/dostavka')}>Доставка и оплата</li>
                      <li className={cls.default_title} onClick={() => router.push('/return')}>Обмен и возврат</li>
                      <li className={cls.default_title} onClick={() => router.push('/contacts')}>Контакты</li>
                    </ul>

                    {/* <div className={cls.city}>
                      <h4 className={cls.menu_title}>ВАШ ГОРОД</h4>
                      <p className={cls.point_city}>
                        <Image src={'/icons/header/pin.svg'} alt="pin" width={10} height={11} /> Бишкек
                      </p>
                    </div> */}
                  </div>
                </div>

                <div className={cls.menuRight}>
                  <motion.div
                    className={cls.menuImage}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image src="/images/header/default_image_1.png" alt="Магазины" width={300} height={400} />
                    <p>МАГАЗИНЫ</p>
                  </motion.div>

                  <motion.div
                    className={cls.menuImage}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image src="/images/header/default_image_2.png" alt="О бренде" width={300} height={400} />
                    <p>О БРЕНДЕ</p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

    </header>
  )
}
