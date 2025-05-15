import React from 'react'
import toast from 'react-hot-toast'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { favoritesDELETE } from '@/services/favorite'
import { getDiscount, getDiscountPercentage } from '@/shared/tools/discount'
import { FavoritesType } from '@/shared/types/favorite-types/favorite'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { API_URL } from '@/shared/utils/const'

import cls from './ProductCard.module.css'

interface Props {
  product: ProductTypes.List
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

  return (
    <div className={cls.card}>
      <div className={cls.imageWrapper}>
        <Image
          src={product.main_image_of_variant ? `${API_URL}${product.main_image_of_variant.image}` : product.product.main_image}
          alt={product.product.title}
          width={330}
          height={430}
          className={cls.image}
          onClick={() => router.push(`/products/${product.product.slug}/`)}
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

      <div onClick={() => router.push(`/products/${product.product.slug}/?color=${product.color.id}`)} className={cls.info_section}>
        <h2 className={cls.title}>{product.product.title}</h2>
        <p style={{ display: `${is_favorite ? 'none' : ''}` }} className={cls.description}>
          {product.product.description}
        </p>
        {parseInt(product.product.discount)  ? (
          <div className={cls.product_price__container}>
            <span className={`${cls.discount_price__h2} ${cls.price}`}>{parseInt(product.product.base_price)} руб.</span>
            <span className={cls.price}>{getDiscount(parseInt(product.product.base_price), product.product.discount)} руб.</span>
            <span className={cls.price}>Скидка: {getDiscountPercentage(parseInt(product.product.base_price), parseInt(product.product.discount))}%</span>
          </div>
        ) : (
          <span className={cls.price}>{getDiscount(parseInt(product.product.base_price), product.product.discount)} руб.</span>
        )}
        <div className={cls.color_container}>
          {/* {
            product.product.available_colors.map((item) => (
              <div key={item.id}>
                <div className={cls.rectangle} style={{ backgroundColor: item.hex_code }} />
              </div>
            ))
          } */}
          {
            product.color && (
              <div>
                <div className={cls.rectangle} style={{ backgroundColor: product.color.hex_code }} />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
