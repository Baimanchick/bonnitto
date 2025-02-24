'use client'

import React from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { Api } from '@/services'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import ProductGallery from '@/shared/ui/product-gallery/product-gallery'
import { Spin } from '@/shared/ui/spin/Spin'

import cls from './page.module.css'

export default function Page() {
  const { products_slug } = useParams()

  const [productDetail, setProductDetail] = React.useState<ProductTypes.ItemDetail | null>(null)
  const [expanded, setExpanded] = React.useState(false)

  const loadData = async () => {
    try {
      const productData = await Api.products.ProductSlugGET(products_slug)

      setProductDetail(productData)
    } catch (error) {
      console.error(error)
    }
  }

  const loadColorData = async () => {
    try {
      const productColorData = await Api.products.ProductSlugVariantsGET(products_slug, String(productDetail?.available_colors[0].id))

      console.log(productColorData)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (products_slug) {
      loadData()
    }
  }, [])

  React.useEffect(() => {
    if (productDetail && productDetail.available_colors.length) {
      loadColorData()
    }
  }, [productDetail])

  const defaultColor = productDetail?.available_colors?.[0]
  const images = defaultColor?.images.map((imgObj) => imgObj.image)

  const toggleDescription = () => {
    setExpanded((prev) => !prev)
  }

  const getFormattedDescription = React.useCallback(() => {
    if (!productDetail) return ''

    const { description } = productDetail

    if (description.length > 245) {
      return expanded ? description : `${description.slice(0, 245)}...`
    }

    return description
  }, [productDetail, expanded])

  console.log(productDetail)

  return (
    <div className={cls.page}>
      <Header />

      {!productDetail ? <Spin/> : (
        <div className={cls.main}>
          <div className={cls.wrapper}>
            <div className={cls.wrapper__left}>
              <ProductGallery big_image={productDetail.main_image} images={images} />
            </div>

            <div className={cls.wrapper__right}>
              <div className={cls.product_heading}>
                <h1>{productDetail.title}</h1>
                <p>
                  {getFormattedDescription()}
                  {productDetail?.description.length > 245 && (
                    <button onClick={toggleDescription} className={cls.moreButton}>
                      {expanded ? 'Скрыть' : 'Еще...'}
                    </button>
                  )}
                </p>
              </div>
              <div className={cls.product_price}>
                <h2>{parseInt(productDetail.base_price)} сом</h2>
                <span>Артикул:{productDetail.article}</span>
              </div>
              <div className={cls.product_info}>
                <div className={cls.colors}>
                  <span>Цвет:</span>
                  <div className={cls.color_container}>
                    {productDetail.available_colors.map((item) => (
                      <div key={item.id} style={{ backgroundColor: `${item.hex_code}` }} />
                    ))}
                  </div>
                </div>
                <div className={cls.size}>
                  <span>Размер:</span>
                  <div className={cls.size_container}>
                    {productDetail.available_sizes.map((size) => (
                      <div key={size.id}>{size.name}</div>
                    ))}
                  </div>
                </div>
                <div className={cls.composition}>Состав: {productDetail.composition}</div>
                <div className={cls.produced}>Производство: {productDetail.produced}</div>
              </div>
              <div className={cls.btn_actions}>
                <button>В КОРЗИНУ</button>
                <Image src={'/icons/product_detail/detail_heart.svg'} alt="heart svg" className={cls.heart_icon} width={21} height={18} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
