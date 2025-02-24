import React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ProductTypes } from '@/shared/types/products/ProductsTypes'

import cls from './ProductCard.module.css'

interface Props {
    product: ProductTypes.Item
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter()

  return (
    <div onClick={() => router.push(`/products/${product.slug}/`)} className={cls.card}>
      <Image src={product.main_image} alt={product.title} width={330} height={430} className={cls.image} />
      <h2 className={cls.title}>{product.title}</h2>
      <p className={cls.description}>{product.description}</p>
      <span className={cls.price}>{product.base_price} сом</span>
    </div>
  )
}
