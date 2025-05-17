/* eslint-disable react/no-array-index-key */
'use client'

import React from 'react'
import toast from 'react-hot-toast'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Api } from '@/services'
import { addFavorite } from '@/services/favorite'
import { ProductSlugGET } from '@/services/products-api'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import ProductGallery from '@/shared/ui/product-gallery/product-gallery'
import { Spin } from '@/shared/ui/spin/Spin'

import cls from './page.module.css'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const { products_slug } = useParams()
  const color = searchParams.get('color')

  const [defaultProductDetail, setDefaultProductDetail] =
    React.useState<ProductTypes.DefaultItemDetail | null>(null)
  const [productDetail, setProductDetail] = React.useState<ProductTypes.ItemDetail[] | null>(null)
  const [selectedVariant, setSelectedVariant] = React.useState<ProductTypes.ItemDetail | null>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [expandedCharts, setExpandedCharts] = React.useState<number[]>([])
  const [isImageLoaded, setIsImageLoaded] = React.useState(false)

  const openModal = React.useCallback(() => setIsModalOpen(true), [])
  const closeModal = React.useCallback(() => setIsModalOpen(false), [])
  const toggleChart = React.useCallback((index: number) => {
    setExpandedCharts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }, [])
  const isChartExpanded = React.useCallback(
    (index: number) => expandedCharts.includes(index),
    [expandedCharts],
  )

  const loadData = async () => {
    try {
      const productData = await ProductSlugGET(products_slug)

      setDefaultProductDetail(productData)
      if (isAuth && productData?.in_cart) {
        setIsAdded(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const loadColorData = async () => {
    if (!defaultProductDetail) return
    try {
      const colorId = String(color ? color : defaultProductDetail.available_colors[0].id)
      const productColorData = await Api.products.ProductSlugVariantsGET(products_slug, colorId)

      setProductDetail(productColorData.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleColorClick = React.useCallback(
    async (colorId: number) => {
      try {
        const productColorData = await Api.products.ProductSlugVariantsGET(
          products_slug,
          String(colorId),
        )

        setProductDetail(productColorData.data)
      } catch (error) {
        console.error('Ошибка при выборе цвета:', error)
      }
    },
    [products_slug],
  )

  React.useEffect(() => {
    if (isAuth) {
      localStorage.removeItem('cartItems')
    }
  }, [isAuth])

  React.useEffect(() => {
    if (products_slug) loadData()
  }, [products_slug])

  React.useEffect(() => {
    if (defaultProductDetail?.available_colors.length) loadColorData()
  }, [defaultProductDetail])

  React.useEffect(() => {
    if (productDetail && productDetail.length > 0) {
      setSelectedVariant(productDetail[0])
      const json = localStorage.getItem('cartItems')

      if (json) {
        try {
          const items = JSON.parse(json)

          setIsAdded(items.some((i: any) => i.variant === productDetail[0].id))
        } catch {
          console.error('Ошибка парсинга cartItems')
        }
      }
    }
  }, [productDetail])

  const handleAddToCart = React.useCallback(async () => {
    if (!selectedVariant) return
    if (isAuth) {
      try {
        await Api.cart.CartPOST({ variant: selectedVariant.id, quantity: 1 })
        toast.success('Продукт добавлен в корзину')
        setIsAdded(true)
      } catch {
        toast.error('Не удалось добавить в корзину')
      }
    } else {
      const json = localStorage.getItem('cartItems')
      let items: { variant: number; quantity: number }[] = []

      if (json) {
        try {
          items = JSON.parse(json)
        } catch {}
      }
      if (items.some((i) => i.variant === selectedVariant.id)) {
        toast('Уже в корзине')
      } else {
        items.push({ variant: selectedVariant.id, quantity: 1 })
        localStorage.setItem('cartItems', JSON.stringify(items))
        toast.success('Добавлено в корзину')
        setIsAdded(true)
      }
    }
  }, [selectedVariant, isAuth])

  const handleAddToFavorite = React.useCallback(async () => {
    if (!isAuth) {
      toast.error('Сначала авторизуйтесь')
      router.push('/auth/register')

      return
    }
    if (!products_slug) {
      toast.error('Информация о продукте не загружена')

      return
    }
    try {
      await addFavorite({ product: products_slug })
      toast.success('В избранное')
      loadData()
    } catch (error) {
      console.error(error)
    }
  }, [isAuth, products_slug])

  const images = React.useMemo(
    () => selectedVariant?.color.images.map((i) => i.image) || [],
    [selectedVariant],
  )

  const toggleDescription = React.useCallback(() => {
    setExpanded((p) => !p)
  }, [])

  const getFormattedDescription = React.useCallback(() => {
    if (!defaultProductDetail) return ''
    const desc = defaultProductDetail.description

    return desc.length > 245 ? (expanded ? desc : desc.slice(0, 245) + '...') : desc
  }, [defaultProductDetail, expanded])

  const getDiscountPercentage = React.useCallback(() => {
    if (!defaultProductDetail) return 0
    const base = +defaultProductDetail.base_price
    const disc = +defaultProductDetail.discount

    return disc && disc < base ? Math.round((disc / base) * 100) : 0
  }, [defaultProductDetail])

  const renderPrice = React.useCallback(() => {
    if (!defaultProductDetail) return null
    const base = +defaultProductDetail.base_price
    const disc = +defaultProductDetail.discount

    if (disc && disc < base) {
      const price = base - disc

      return (
        <div className={cls.product_price__container}>
          <span className={cls.base_price__h2}>{base} руб.</span>
          <span className={cls.product_price__h2}>{price} руб.</span>
          <span className={cls.product_discount__h2}>
            Скидка: {getDiscountPercentage()}%
          </span>
        </div>
      )
    }

    return <h2 className={cls.product_price__h2}>{base} руб.</h2>
  }, [defaultProductDetail, getDiscountPercentage])

  const handleMainImageLoaded = React.useCallback(() => {
    setIsImageLoaded(true)
  }, [])

  if (!defaultProductDetail || !productDetail || !selectedVariant) {
    return <Spin />
  }

  return (
    <div className={cls.page}>
      {!isImageLoaded && (
        <div className={cls.loaderOverlay}>
          <Spin />
        </div>
      )}

      <div style={{ visibility: isImageLoaded ? 'visible' : 'hidden' }}>
        <div className={cls.main}>
          <motion.div
            className={cls.wrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={cls.wrapper__left}>
              <div className={cls.mainImage_conatiner}>
                <Image
                  src={images[0] || defaultProductDetail.main_image}
                  alt={defaultProductDetail.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority
                  unoptimized
                  onLoadingComplete={handleMainImageLoaded}
                  className={cls.main_image}
                />
              </div>
              <ProductGallery big_image={defaultProductDetail.main_image} images={images} />
            </div>

            <div className={cls.wrapper__right}>
              <div className={cls.product_heading}>
                <h1>{defaultProductDetail.title}</h1>
                <p>
                  {getFormattedDescription()}
                  {defaultProductDetail.description.length > 245 && (
                    <button onClick={toggleDescription} className={cls.moreButton}>
                      {expanded ? 'Скрыть' : 'Еще...'}
                    </button>
                  )}
                </p>
              </div>

              <div className={cls.product_price}>
                {renderPrice()}
                {defaultProductDetail.article && <span>Артикул: {defaultProductDetail.article}</span>}
              </div>

              <div className={cls.product_info}>
                <div className={cls.colors}>
                  <span>Цвет:</span>
                  <div className={cls.color_container}>
                    {defaultProductDetail.available_colors.map((item) => (
                      <div key={item.id} onClick={() => handleColorClick(item.id)}>
                        <div className={cls.rectangle} style={{ backgroundColor: item.hex_code }} />
                        {selectedVariant.color.id === item.id && <hr className={cls.color_line} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cls.size}>
                  <div className={cls.size_header}>
                    <span>Размер:</span>
                    <h2 className={cls.sizeCharts_title} onClick={openModal}>
                      Руководство по размерам
                    </h2>
                  </div>
                  <div className={cls.size_container}>
                    {productDetail.map((variant) => (
                      <div
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        style={{ background: selectedVariant.id === variant.id ? '#ABABAB' : 'transparent' }}
                      >
                        {variant.size.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className={cls.stock}>
                  <span>В наличии: {selectedVariant.stock} шт</span>
                </div> */}

                <div className={cls.composition}>
                  Состав: {defaultProductDetail.composition}
                </div>

                <div className={cls.produced}>
                  Производство: {defaultProductDetail.produced}
                </div>

                {defaultProductDetail.related_products.length ? (
                  <>
                    <div className={cls.part_title}>Собери свой образ:</div>
                    <div className={cls.part_container}>
                      {defaultProductDetail.related_products.map((item, index) => (
                        <div
                          onClick={() => router.push(`/products/${item.slug}/`)}
                          className={cls.part_image__container}
                          key={index}
                        >
                          <Image
                            width={0}
                            height={0}
                            sizes="100vw"
                            alt={item.title}
                            src={item.main_image}
                            className={cls.part_image}
                          />
                          <div className={cls.part_image__title}>{item.title}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className={cls.btn_actions}>
                {isAdded ? (
                  <button onClick={() => router.push('/cart')}>В КОРЗИНЕ ✓</button>
                ) : (
                  <button onClick={handleAddToCart}>В КОРЗИНУ</button>
                )}
                {defaultProductDetail.in_favorite ? (
                  <Image
                    onClick={() => router.push('/favorites')}
                    src={'/icons/product_detail/detail_heartFilled.svg'}
                    alt="heart svg"
                    className={cls.heart_icon}
                    width={21}
                    height={18}
                  />
                ) : (
                  <Image
                    onClick={handleAddToFavorite}
                    src={'/icons/product_detail/detail_heart.svg'}
                    alt="heart svg"
                    className={cls.heart_icon}
                    width={21}
                    height={18}
                  />
                )}
              </div>

              {isModalOpen && (
                <div className={cls.modalOverlay} onClick={closeModal}>
                  <div className={cls.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button onClick={closeModal} className={cls.closeButton}>
                      ×
                    </button>
                    <h3 className={cls.modalTitle}>Таблицы размеров</h3>
                    {defaultProductDetail.size_charts.length ? (
                      defaultProductDetail.size_charts.map((chart, chartIndex) => (
                        <div key={chartIndex} className={cls.sizeChart}>
                          <button
                            className={cls.sizeChartButton}
                            onClick={() => toggleChart(chartIndex)}
                          >
                            <span>{chart.category}</span>
                            <span>{isChartExpanded(chartIndex) ? '−' : '+'}</span>
                          </button>
                          {isChartExpanded(chartIndex) && (
                            <table className={cls.sizeChartTable}>
                              <thead>
                                <tr>
                                  <th>Размер</th>
                                  <th>Грудь</th>
                                  <th>Талия</th>
                                  <th>Бёдра</th>
                                </tr>
                              </thead>
                              <tbody>
                                {chart.values.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{row.size}</td>
                                    <td>{row.chest}</td>
                                    <td>{row.waist}</td>
                                    <td>{row.hips}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={cls.size_info}>
                        <h2>У этого продукта нет руководства по размерам.</h2>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
