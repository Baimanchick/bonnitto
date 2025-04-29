'use client'

import React from 'react'

import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHook'
import { API_URL } from '@/shared/utils/const'
import { setLogout, setUser, setTokens } from '@/store/features/auth/authSlice'

import cls from './Header.module.css'

export const Header = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [collection, setCollection] = React.useState([])
  const [cards, setCards] = React.useState([])

  React.useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem('user')
    const storedTokens = localStorage.getItem('tokens')

    if (storedUser && storedTokens) {
      dispatch(setUser(JSON.parse(storedUser)))
      dispatch(setTokens(JSON.parse(storedTokens)))
    }
  }, [dispatch])

  const toggleMenu = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }, [])

  const handleLogout = () => {
    dispatch(setLogout())
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  React.useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(`${API_URL}/collections/`)
      const response2 = await axios.get(`${API_URL}/menu-images/`)

      setCards(response2.data.results)
      setCollection(response.data.results)
    }

    loadData()
  }, [])

  if (!mounted) return null

  return (
    <header className={`${cls.header} ${isOpen ? cls.headerOpen : ''}`}>
      <div className="container">
        <div className={cls.items}>
          <div className={`${cls.item}`} onClick={toggleMenu}>
            <div className={`${cls.burger} ${isOpen ? cls.open : ''}`}>
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={`${cls.item_mobile}`}>
            <div className={`${cls.burger} ${isOpen ? cls.open : ''}`} onClick={toggleMenu}>
              <span />
              <span />
              <span />
            </div>
            <div className={cls.searchContainer}>
              <Image
                onClick={() => router.push('/auth/register')}
                src={isOpen ? '/icons/header/user_light.svg' : '/icons/header/user.svg'}
                style={{ display: `${isAuth ? 'none' : ''}` }}
                alt="profile"
                width={22}
                height={22}
              />
            </div>
          </div>

          <div className={cls.item_logo}>
            {isOpen ? (
              <Image
                src="/icons/header/logo_light.svg"
                onClick={() => router.push('/')}
                alt="Logo"
                width={220}
                height={75}
                priority
                className={cls.logo_light}
              />
            ) : (
              <Image
                src="/icons/header/logo_main.svg"
                onClick={() => router.push('/')}
                alt="Logo"
                width={50}
                height={75}
                priority
              />
            )}
            {!isOpen && (
              <Image
                src="/icons/header/logo_text.svg"
                onClick={() => router.push('/')}
                alt="Logo"
                width={270}
                height={75}
                className={cls.logo_text}
                priority
                style={{ marginLeft: '10px' }}
              />
            )}
          </div>

          <div className={cls.item}>
            <div className={cls.actions}>
              {!isAuth ? (
                <Image
                  onClick={() => router.push('/auth/register')}
                  src={isOpen ? '/icons/header/user_light.svg' : '/icons/header/user.svg'}
                  alt="profile"
                  width={22}
                  height={22}
                />
              ) : (
                <Image
                  onClick={handleLogout}
                  src={isOpen ? '/icons/header/logout-icon-white.svg' : '/icons/header/logout-icon.svg'}
                  alt="profile"
                  width={22}
                  height={22}
                />
              )}
              <Image
                onClick={() => router.push('/favorites/')}
                src={isOpen ? '/icons/header/heart_light.svg' : '/icons/header/heart.svg'}
                alt="favorites_products"
                width={22}
                height={22}
              />
              <Image
                onClick={() => router.push('/cart/')}
                src={isOpen ? '/icons/header/cart_light.svg' : '/icons/header/shopping_bag.svg'}
                alt="cart_products"
                width={22}
                height={22}
              />
            </div>
          </div>

          <div className={cls.item_mobile}>
            <div className={cls.actions}>
              <Image
                onClick={() => router.push('/favorites/')}
                src={isOpen ? '/icons/header/heart_light.svg' : '/icons/header/heart.svg'}
                alt="favorites_products"
                width={22}
                height={22}
              />
              <Image
                onClick={() => router.push('/cart/')}
                src={isOpen ? '/icons/header/cart_light.svg' : '/icons/header/shopping_bag.svg'}
                alt="cart_products"
                width={22}
                height={22}
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          className={cls.menu}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                    <li onClick={() => {
                      router.push('/products')
                      setIsOpen(false)
                    }}
                    >Новинки</li>
                    {
                      collection.length > 0 && (
                        collection.map((item: any, i) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <li key={i} onClick={() => {
                            router.push(`/collections/${item.slug}?collection_title=${item.title}`)
                            setIsOpen(false)
                          }}
                          >{item.title}</li>
                        ))
                      )
                    }
                    <li onClick={() => {
                      router.push('/products/')
                      setIsOpen(false)
                    }}
                    >Весь ассортимент</li>
                  </ul>

                  <div className={cls.menuBlock}>
                    <h4 className={cls.menu_title}>ПОКУПАТЕЛЯМ</h4>
                    <ul>
                      <li className={cls.default_title} onClick={() => {
                        router.push('/about')
                        setIsOpen(false)
                      }}
                      >
                        О бренде
                      </li>
                      <li className={cls.default_title} onClick={() => {
                        router.push('/shops')
                        setIsOpen(false)
                      }}
                      >
                        Магазины
                      </li>
                      <li className={cls.default_title} onClick={() => {
                        router.push('/delivery')
                        setIsOpen(false)
                      }}
                      >
                        Доставка и оплата
                      </li>
                      <li className={cls.default_title} onClick={() => {
                        router.push('/return-exchanges')
                        setIsOpen(false)
                      }}
                      >
                        Обмен и возврат
                      </li>
                      <li className={cls.default_title} onClick={() => {
                        router.push('/contacts')
                        setIsOpen(false)
                      }}
                      >
                        Контакты
                      </li>
                      {
                        isAuth && (
                          <li className={cls.default_title} onClick={() => {
                            router.push('/history')
                            setIsOpen(false)
                          }}
                          >
                            История заказов
                          </li>
                        )
                      }
                    </ul>
                  </div>
                </div>

                <div className={cls.menuRight}>
                  {
                    cards.map((item: {image: string, title: string}, index) => (
                      <motion.div
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={cls.menuImage}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          router.push('/shops')
                          setIsOpen(false)
                        }}
                        style={{ height: '400px' }}
                      >
                        <Image src={item.image} alt="Магазины" width={300} height={400} />
                        <p>{item.title}</p>
                      </motion.div>
                    ))
                  }
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </header>
  )
}
