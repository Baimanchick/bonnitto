'use client'

import React from 'react'
import toast from 'react-hot-toast'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { Api } from '@/services'
import { useAppSelector } from '@/shared/hooks/reduxHook'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import ProductGallery from '@/shared/ui/product-gallery/product-gallery'
import { Spin } from '@/shared/ui/spin/Spin'

import cls from './page.module.css'

export default function Page() {
  const isAuth = useAppSelector((state) => state.auth.user !== null)
  const { products_slug } = useParams()

  const [defaultProductDetail, setDefaultProductDetail] = React.useState<ProductTypes.DefaultItemDetail | null>(null)
  const [productDetail, setProductDetail] = React.useState<ProductTypes.ItemDetail[] | null>(null)
  const [selectedVariant, setSelectedVariant] = React.useState<ProductTypes.ItemDetail | null>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)

  const loadData = async () => {
    try {
      const productData = await Api.products.ProductSlugGET(products_slug)

      setDefaultProductDetail(productData)
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

  const handleColorClick = React.useCallback(async (colorId: number) => {
    try {
      const productColorData = await Api.products.ProductSlugVariantsGET(products_slug, String(colorId))

      setProductDetail(productColorData.data)
    } catch (error) {
      console.error('Ошибка при выборе цвета:', error)
    }
  }, [products_slug])

  React.useEffect(() => {
    if (productDetail && productDetail.length > 0) {
      setSelectedVariant(productDetail[0])
      const cartItemsJson = localStorage.getItem('cartItems')

      if (cartItemsJson) {
        try {
          const cartItems = JSON.parse(cartItemsJson)
          const alreadyAdded = cartItems.some((item: { variant: number; quantity: number }) => item.variant === productDetail[0].id)

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

  return (
    <div className={cls.page}>
      <Header />
      {(!productDetail || !defaultProductDetail || !selectedVariant) ? <Spin /> : (
        <div className={cls.main}>
          <div className={cls.wrapper}>
            <div className={cls.wrapper__left}>
              <ProductGallery big_image={defaultProductDetail.main_image} images={images} />
            </div>
            <div className={cls.wrapper__right}>
              <div className={cls.product_heading}>
                <h1>{defaultProductDetail.title}</h1>
                <p>
                  {getFormattedDescription()}
                  {defaultProductDetail?.description.length > 245 && (
                    <button onClick={toggleDescription} className={cls.moreButton}>
                      {expanded ? 'Скрыть' : 'Еще...'}
                    </button>
                  )}
                </p>
              </div>
              <div className={cls.product_price}>
                <h2>{parseInt(selectedVariant.price as string)} сом</h2>
                <span>Артикул: {defaultProductDetail.article}</span>
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
                  <span>Размер:</span>
                  <div className={cls.size_container}>
                    {productDetail.map((variant) => {
                      return (
                        <div
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          style={{ background: selectedVariant.id === variant.id ? '#ABABAB' : 'transparent' }}
                        >
                          {variant.size.name}
                        </div>
                      )
                    })}
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
              </div>
              <div className={cls.btn_actions}>
                <button onClick={handleAddToCart} disabled={isAdded}>
                  {isAdded ? 'В КОРЗИНЕ ✓' : 'В КОРЗИНУ'}
                </button>
                <Image src={'/icons/product_detail/detail_heart.svg'} alt="heart svg" className={cls.heart_icon} width={21} height={18} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
