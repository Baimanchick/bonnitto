import React from 'react'
import toast from 'react-hot-toast'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { favoritesDELETE } from '@/services/favorite'
import { FavoritesType } from '@/shared/types/favorite-types/favorite'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'

import cls from './ProductCard.module.css'

interface Props {
  product: ProductTypes.Item
  is_favorite?: boolean
  favorite?: FavoritesType.Item
  onDeleteFavorite?: () => void
}

export const ProductCard: React.FC<Props> = ({
  product,
  is_favorite,
  favorite,
  onDeleteFavorite,
}) => {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await favoritesDELETE(favorite?.id)
      toast.success('Вы успешно удалили продукт')
      if (onDeleteFavorite) {
        onDeleteFavorite()
      }
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error)
    }
  }

  const calculateDiscountedPrice = React.useCallback((originalPrice: number, discountPercent: number) => {
    return originalPrice * (1 - discountPercent / 100)
  }, [])

  return (
    <div className={cls.card}>
      <div className={cls.imageWrapper}>
        <Image
          src={product.main_image}
          alt={product.title}
          width={330}
          height={430}
          className={cls.image}
          onClick={() => router.push(`/products/${product.slug}/`)}
        />

        {is_favorite ? (
          <Image
            onClick={handleDelete}
            src={'/icons/product_detail/detail_heartFilled.svg'}
            alt="heart svg"
            className={cls.heart_icon}
            width={21}
            height={18}
          />
        ) : null}
      </div>

      <div onClick={() => router.push(`/products/${product.slug}/`)} className={cls.info_section}>
        <h2 className={cls.title}>{product.title}</h2>
        <p style={{ display: `${is_favorite ? 'none' : ''}` }} className={cls.description}>
          {product.description}
        </p>
        {parseInt(product.discount)  ? (
          <div className={cls.product_price__container}>
            <span className={`${cls.discount_price__h2} ${cls.price}`}>{parseInt(product.base_price)} руб.</span>
            <span className={cls.price}>{calculateDiscountedPrice(parseInt(product.base_price), parseInt(product.discount))} руб.</span>
          </div>
        ) : (
          <span className={cls.price}>{parseInt(product.base_price)} руб.</span>
        )}
      </div>
    </div>
  )
}
