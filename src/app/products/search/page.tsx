'use client'

import React from 'react'

import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

import { Api } from '@/services'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import { Navigation } from '@/shared/ui/navigation/Navigation'
import { ProductCard } from '@/shared/ui/product-card/ProductCard'
import { Spin } from '@/shared/ui/spin/Spin'

import styles from '../page.module.css'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get('query') || ''

  const [loadingData, setLoadingData] = React.useState(false)
  const [products, setProducts] = React.useState<ProductTypes.Item[]>([])
  const [categories, setCategories] = React.useState<ProductTypes.Category[]>([])

  const fetchCategories = React.useCallback(async () => {
    try {
      const categoriesData = await Api.categories.CategoriesGET()

      setCategories(categoriesData.data)
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error)
    }
  }, [])

  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const fetchSearchResults = React.useCallback(async () => {
    if (!query) return

    setLoadingData(true)
    try {
      const result = await Api.searchProducts.searchProductsApi(query)

      if (result.success) {
        setProducts(result.data.results)
      } else {
        console.error('Search failed:', result.error)
      }
    } catch (error) {
      console.error('Error in search effect:', error)
    } finally {
      setLoadingData(false)
    }
  }, [query])

  React.useEffect(() => {
    fetchSearchResults()
  }, [fetchSearchResults])

  const handleCategorySelect = React.useCallback(
    (category: ProductTypes.Category) => {
      router.push(`/products?category=${category.slug}`)
    },
    [router],
  )

  return (
    <div className={styles.page}>
      <Header />
      {loadingData ? (
        <Spin />
      ) : (
        <main className={'container'}>
          <div className={styles.flex_page}>
            <Navigation
              navigationItems={categories}
              onCategorySelect={handleCategorySelect}
            />
            <motion.div
              className={styles.list_products}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))
              ) : (
                <div className={styles.no_results}>
                  <h2>По вашему запросу ничего не найдено</h2>
                  <p>Попробуйте изменить параметры поиска</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      )}
    </div>
  )
}
