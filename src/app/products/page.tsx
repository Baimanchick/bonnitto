'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { motion } from 'framer-motion'

import { Api } from '@/services'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Navigation } from '@/shared/ui/navigation/Navigation'
import { ProductCard } from '@/shared/ui/product-card/ProductCard'
import { Spin } from '@/shared/ui/spin/Spin'

import styles from './page.module.css'

export default function ProductsPage() {
  const [loadingData, setLoadingData] = useState(true)
  const [filterLoading, setFilterLoading] = useState(false)
  const [products, setProducts] = useState<ProductTypes.Item[]>([])
  const [categories, setCategories] = useState<ProductTypes.Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ProductTypes.Category | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const pageSize = 10

  const loadData = useCallback(async (categorySlug?: string, pageNumber: number = 1) => {
    try {
      const productsData = await Api.products.ProductsGET(categorySlug, pageNumber)

      setProducts(prev => (pageNumber === 1 ? productsData.data : [...prev, ...productsData.data]))
      setHasMore(productsData.data.length >= pageSize)
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error)
    }
  }, [])

  const fetchInitialData = useCallback(async () => {
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
  }, [loadData, selectedCategory, categories.length])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const handleCategorySelect = useCallback((category: ProductTypes.Category) => {
    setSelectedCategory(category)
    setPage(1)
  }, [])

  const handleChangePage = useCallback(async () => {
    const nextPage = page + 1

    setFilterLoading(true)
    await loadData(selectedCategory ? selectedCategory.slug : undefined, nextPage)
    setPage(nextPage)
    setFilterLoading(false)
  }, [page, selectedCategory, loadData])

  return (
    <div className={styles.page}>
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
                <ProductCard key={product.slug} product={product} />
              ))}
            </motion.div>
          </div>
          {hasMore && (
            <div className={styles.btn_block}>
              <button
                className={styles.load_more_button}
                onClick={handleChangePage}
                disabled={filterLoading}
              >
                {filterLoading ? 'Загрузка...' : 'Показать ещё'}
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  )
}
