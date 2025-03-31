'use client'

/* eslint-disable react/no-array-index-key */
import React from 'react'
import toast from 'react-hot-toast'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { Api } from '@/services'
import { addFavorite } from '@/services/favorite'
import { ProductSlugGET } from '@/services/products-api'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { FavoritesType } from '@/shared/types/favorite-types/favorite'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import ProductGallery from '@/shared/ui/product-gallery/product-gallery'
import { Spin } from '@/shared/ui/spin/Spin'

import cls from './page.module.css'

export default function Page() {
  const router = useRouter()
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const { products_slug } = useParams()

  const [defaultProductDetail, setDefaultProductDetail] =
    React.useState<ProductTypes.DefaultItemDetail | null>(null)
  const [productDetail, setProductDetail] = React.useState<ProductTypes.ItemDetail[] | null>(null)
  const [selectedVariant, setSelectedVariant] = React.useState<ProductTypes.ItemDetail | null>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [expandedCharts, setExpandedCharts] = React.useState<number[]>([])

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
      console.log(error)
    }
  }

  const loadColorData = async () => {
    try {
      const productColorData = await Api.products.ProductSlugVariantsGET(
        products_slug,
        String(defaultProductDetail?.available_colors[0].id),
      )

      setProductDetail(productColorData.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleColorClick = React.useCallback(
    async (colorId: number) => {
      try {
        const productColorData = await Api.products.ProductSlugVariantsGET(products_slug, String(colorId))

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
    if (productDetail && productDetail.length > 0) {
      setSelectedVariant(productDetail[0])
      const cartItemsJson = localStorage.getItem('cartItems')

      if (cartItemsJson) {
        try {
          const cartItems = JSON.parse(cartItemsJson)
          const alreadyAdded = cartItems.some(
            (item: { variant: number; quantity: number }) => item.variant === productDetail[0].id,
          )

          setIsAdded(alreadyAdded)
        } catch (error) {
          console.error('Ошибка парсинга cartItems:', error)
        }
      }
    }
  }, [productDetail])

  const handleAddToCart = React.useCallback(async () => {
    if (!selectedVariant) return
    if (isAuth) {
      try {
        const dataToSend: CartTypes.Form = {
          variant: selectedVariant.id,
          quantity: 1,
        }

        await Api.cart.CartPOST(dataToSend)
        toast.success('Продукт добавлен в корзину')
        setIsAdded(true)
      } catch (error) {
        console.log(error)
        toast.error('Произошла ошибка при добавлении в корзину, попробуйте еще раз')
      }
    } else {
      const variantId = selectedVariant.id
      const cartItemsJson = localStorage.getItem('cartItems')
      let cartItems: { variant: number; quantity: number }[] = []

      if (cartItemsJson) {
        try {
          cartItems = JSON.parse(cartItemsJson)
        } catch (error) {
          console.error('Ошибка парсинга cartItems:', error)
        }
      }
      const alreadyAdded = cartItems.some((item) => item.variant === variantId)

      if (alreadyAdded) {
        setIsAdded(true)
        toast('Продукт уже добавлен в корзину')

        return
      }
      cartItems.push({ variant: variantId, quantity: 1 })
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      setIsAdded(true)
      toast.success('Вы успешно добавили продукт в корзину')
    }
  }, [selectedVariant, isAuth])

  const handleAddToFavorite = React.useCallback(async () => {
    if (!isAuth) {
      toast.error('Вы должны сначало авторизоваться')
      router.push('/auth/register')

      return
    }
    if (!products_slug) {
      toast.error('Информация о продукте не загружена')

      return
    }
    try {
      const dataToSend: FavoritesType.Form = {
        product: products_slug,
      }

      await addFavorite(dataToSend)
      toast.success('Вы успешно добавили продукт в избранные')
      loadData()
    } catch (error) {
      console.log(error)
    }
  }, [isAuth, products_slug])

  React.useEffect(() => {
    if (products_slug) {
      loadData()
    }
  }, [products_slug])

  React.useEffect(() => {
    if (defaultProductDetail && defaultProductDetail.available_colors.length) {
      loadColorData()
    }
  }, [defaultProductDetail])

  const images = React.useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.color.images.map((imgObj) => imgObj.image)
    }

    return []
  }, [selectedVariant])

  const toggleDescription = React.useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  const getFormattedDescription = React.useCallback(() => {
    if (!defaultProductDetail) return ''
    const { description } = defaultProductDetail

    if (description.length > 245) {
      return expanded ? description : `${description.slice(0, 245)}...`
    }

    return description
  }, [defaultProductDetail, expanded])

  const getDiscountPercentage = React.useCallback(() => {
    const originalPrice = parseInt(defaultProductDetail!.base_price)
    const discountPrice = parseInt(defaultProductDetail!.discount)

    if (discountPrice && discountPrice < originalPrice) {
      return Math.round((1 - discountPrice / originalPrice) * 100)
    }

    return 0
  }, [defaultProductDetail])

  const renderPrice = React.useCallback(() => {
    const originalPrice = parseInt(defaultProductDetail!.base_price)
    const discountPrice = parseInt(defaultProductDetail!.discount)

    if (discountPrice && discountPrice < originalPrice) {
      return (
        <div className={cls.product_price__container}>
          <span className={cls.base_price__h2}>
            {originalPrice} руб.
          </span>
          <span className={cls.product_price__h2}>{discountPrice} руб.</span>
          <span className={cls.product_discount__h2}>Скидка: {getDiscountPercentage()}%</span>
        </div>
      )
    }

    return <h2 className={cls.product_price__h2}>{originalPrice} руб.</h2>
  }, [defaultProductDetail, getDiscountPercentage])

  return (
    <div className={cls.page}>
      {(!productDetail || !defaultProductDetail || !selectedVariant) ? (
        <Spin />
      ) : (
        <div className={cls.main}>
          <motion.div
            className={cls.wrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={cls.wrapper__left}>
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

                <div className={cls.stock}>
                  <span>В наличии: {selectedVariant.stock} шт</span>
                </div>

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
      )}
    </div>
  )
}
