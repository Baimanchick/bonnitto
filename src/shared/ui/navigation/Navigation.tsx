import React from 'react'

import { ProductTypes } from '@/shared/types/products/ProductsTypes'

import cls from './Navigation.module.css'

interface Props {
    navigationItems: ProductTypes.Category[]
    // eslint-disable-next-line no-unused-vars
    onCategorySelect: (category: ProductTypes.Category) => void
    onSearchChange: (value: string) => void
}

export const Navigation: React.FC<Props> = ({ navigationItems, onCategorySelect, onSearchChange }) => {
  return (
    <div className={cls.categories}>
      <span onClick={() => onCategorySelect({ slug: '', title: '' })} className={cls.category_item}>ВЕСЬ АССОРТИМЕНТ</span>
      {navigationItems.map((item) => (
        <span onClick={() => onCategorySelect(item)} key={item.slug} className={cls.category_item}>{item.title}</span>
      ))}
      <input className={cls.search} placeholder="Поиск товаров" name="search" onChange={(e) => onSearchChange(e.target.value)} />
    </div>
  )
}
