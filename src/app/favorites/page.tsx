'use client'

import React from 'react'
import toast from 'react-hot-toast'

import { useRouter } from 'next/navigation'

import { favoritesGET } from '@/services/favorite'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { FavoritesType } from '@/shared/types/favorite-types/favorite'
import { Header } from '@/shared/ui/header/ui/Header'
import { ProductCard } from '@/shared/ui/product-card/ProductCard'
import { Spin } from '@/shared/ui/spin/Spin'
import Footer from '@/widgets/footer/ui/Footer'

import cls from './page.module.css'

export default function Favorites() {
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const [favorites, setFavorites] = React.useState<FavoritesType.ApiResponse | null>(null)

  const loadFavorite = async () => {
    try {
      const response = await favoritesGET()

      if (!response) {
        toast.error('ошибка')

        return
      }

      setFavorites(response)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isAuth) {
      router.push('/auth/register')

      return
    }
    loadFavorite()
  }, [isAuth])

  return (
    <div className={cls.page}>
      <Header />

      {!favorites ? (
        <Spin/>
      ) : (
        !favorites?.results.length ? (
          <div className={cls.empty}>
            <div className={cls.flexx}>
              <h2 className={cls.empty_title}>В избранных пусто</h2>
              <button className={cls.btn} onClick={() => router.back()}>Вернуться назад</button>
            </div>
          </div>
        ) : (
          <div className={'container'}>
            {favorites?.results.map((item) => (
              <ProductCard
                favorite={item}
                is_favorite={true}
                key={item.id}
                product={item.product}
                onDeleteFavorite={loadFavorite}
              />
            ))}
          </div>
        )
      )}
      <Footer/>
    </div>
  )
}
