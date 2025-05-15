'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

import { Api } from '@/services'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { ProductCard } from '@/shared/ui/product-card/ProductCard'
import { Spin } from '@/shared/ui/spin/Spin'

import styles from './page.module.css'

export default function NewProductsPage() {
  const [filterLoading, setFilterLoading] = useState(false)
  const [products, setProducts] = useState<ProductTypes.List[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const searchParams = useSearchParams()
  const collectionTitle = searchParams.get('collection_title')

  const pageSize = 10

  const loadData = useCallback(async (pageNumber: number = 1) => {
    try {
      const productsData = await Api.products.ProductsGET(undefined, pageNumber, undefined, undefined, true)

      setProducts(prev => (pageNumber === 1 ? productsData.data : [...prev, ...productsData.data]))
      setHasMore(productsData.data.length >= pageSize)
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error)
    } finally {
    }
  }, [])

  useEffect(() => {
    setFilterLoading(true)
    loadData(1).finally(() => {
      setFilterLoading(false)
    })
  }, [])

  const handleChangePage = useCallback(async () => {
    const nextPage = page + 1

    setFilterLoading(true)
    await loadData(nextPage)
    setPage(nextPage)
    setFilterLoading(false)
  }, [page, loadData])

  return (
    <div className={styles.page}>
      {filterLoading ? (
        <Spin />
      ) : (
        <>
          <main className={'container'}>
            <div className={styles.flex_page}>
              <motion.div
                className={styles.list_products}
                initial={{ opacity: 0 }}
                animate={{ opacity: filterLoading ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {
                  products.length > 0 ? (
                    products.map((product: ProductTypes.List) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div>
                      <h1>Здесь пусто</h1>
                    </div>
                  )
                }
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
        </>
      )}
    </div>
  )
}
