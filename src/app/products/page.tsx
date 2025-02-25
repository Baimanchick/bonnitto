'use client'

import React from 'react'

import { motion } from 'framer-motion'

import { Api } from '@/services'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import { Navigation } from '@/shared/ui/navigation/Navigation'
import { ProductCard } from '@/shared/ui/product-card/ProductCard'
import { Spin } from '@/shared/ui/spin/Spin'

import styles from './page.module.css'

export default function ProductsPage() {
  const [loadingData, setLoadingData] = React.useState(true)
  const [filterLoading, setFilterLoading] = React.useState(false)
  const [products, setProducts] = React.useState<ProductTypes.Item[]>([])
  const [categories, setCategories] = React.useState<ProductTypes.Category[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<ProductTypes.Category | null>(null)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)
  const pageSize = 10

  const loadData = async (categorySlug?: string, pageNumber: number = 1) => {
    try {
      const productsData = await Api.products.ProductsGET(categorySlug, pageNumber)

      if (pageNumber === 1) {
        setProducts(productsData.data)
      } else {
        setProducts(prev => [...prev, ...productsData.data])
      }
      if (productsData.data.length < pageSize) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error)
    }
  }

  React.useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingData(true)
      setPage(1)
      await loadData(selectedCategory ? selectedCategory.slug : undefined, 1)

      if (!categories.length) {
        try {
          const categoriesData = await Api.categories.CategoriesGET()

          setCategories(categoriesData.data)
        } catch (error) {
          console.error('Ошибка загрузки категорий:', error)
        }
      }
      setLoadingData(false)
    }

    fetchInitialData()
  }, [selectedCategory])

  const handleCategorySelect = (category: ProductTypes.Category) => {
    setSelectedCategory(category)
  }

  const handleChangePage = async () => {
    const nextPage = page + 1

    setFilterLoading(true)
    await loadData(selectedCategory ? selectedCategory.slug : undefined, nextPage)
    setPage(nextPage)
    setFilterLoading(false)
  }

  return (
    <div className={styles.page}>
      <Header />
      {loadingData ? (
        <Spin />
      ) : (
        <main className={'container'}>
          <div className={styles.flex_page}>
            <Navigation navigationItems={categories} onCategorySelect={handleCategorySelect} />
            <motion.div
              className={styles.list_products}
              initial={{ opacity: 0 }}
              animate={{ opacity: filterLoading ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {products.map((product: ProductTypes.Item) => (
                <ProductCard  key={product.slug} product={product} />
              ))}
            </motion.div>
          </div>
          {hasMore && (
            <div className={styles.btn_block}>
              <button className={styles.load_more_button} onClick={handleChangePage} disabled={filterLoading}>
                {filterLoading ? 'Загрузка...' : 'Показать ещё'}
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  )
}
