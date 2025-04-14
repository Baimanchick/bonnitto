/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import toast from 'react-hot-toast'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Api } from '@/services'
import { getDiscount } from '@/shared/tools/discount'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import { Spin } from '@/shared/ui/spin/Spin'
import { API_URL } from '@/shared/utils/const'
import Footer from '@/widgets/footer/ui/Footer'

import cls from './page.module.css'

export default function CartsPage() {
  const [cartItems, setCartItems] = React.useState<CartTypes.Item[] | null>(null)
  const [products, setProducts] = React.useState<ProductTypes.Variants[]>([])
  const [productsCart, setProductsCart] = React.useState<CartTypes.Products[]>([])
  const [quantities, setQuantities] = React.useState<{ [key: number]: number }>({})
  const [orderActive, setOrderActive] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [phone_number, setPhoneNumber] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [isBtnClicked, setIsBtnClicked] = React.useState(false)
  const [isProductsLoading, setIsProductsLoading] = React.useState(false)
  const [promocode, setPromocode] = React.useState('')

  let storedCart: any

  if (typeof window !== 'undefined') {
    storedCart = localStorage.getItem('tokens')
  }

  const tokens = storedCart ? JSON.parse(storedCart) : ''

  const router = useRouter()

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cartItems')

      const loadData = async () => {
        if (storedCart && !tokens.access) {
          try {
            const parsedCart = JSON.parse(storedCart)

            if (parsedCart.length === 0) {
              setCartItems(null)
            } else {
              setCartItems(parsedCart)
            }

            const response = await Api.products.ProductsVariantsGET(parsedCart.map((item: {quantity: number, variant: number}) => item.variant))

            setProducts(response.data)

            const initialQuantities = response.data.reduce((acc: { [key: number]: number }, product: ProductTypes.Variants) => {
              const cartItem = parsedCart.find((item: { variant: number }) => item.variant === product.id)

              acc[product.id] = cartItem?.quantity ?? 1

              return acc
            }, {})

            setQuantities(initialQuantities)
          } catch (error) {
            console.error('Failed to parse cart items:', error)
          }
        } else if (tokens.access) {
          setIsProductsLoading(true)
          const response = await Api.cart.CartListGET().finally(() => {
            setIsProductsLoading(false)
          })

          setProductsCart(response)

          const initialQuantities = response.reduce((acc: { [key: number]: number }, cartItem: { variant: { id: number }; quantity: number }) => {
            acc[cartItem.variant.id] = cartItem.quantity

            return acc
          }, {})

          setQuantities(initialQuantities)
        }
      }

      loadData()
    }

  }, [])

  const handleQuantityChange = (variantId: number, change: number) => {
    const variantStock = products.find(product => product.id === variantId)?.stock ?? 1

    setQuantities((prev) => {
      const newQuantity = (prev[variantId] ?? 1) + change

      if (newQuantity > variantStock) {
        return prev
      }

      if (newQuantity <= 0) {
        const updatedCart = cartItems?.filter(item => item.variant !== variantId) ?? []

        if (updatedCart.length === 0) {
          setCartItems(null)
        } else {
          setCartItems(updatedCart)
        }
        setProducts(products.filter(product => product.id !== variantId))

        localStorage.setItem('cartItems', JSON.stringify(updatedCart))

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [variantId]: _, ...rest } = prev

        return rest
      }

      return { ...prev, [variantId]: newQuantity }
    })
  }

  const handleQuantityChangeWithUser = async (id: number, change: number, variantId: number) => {
    const variantStock = productsCart.find(product => product.variant.id === variantId)?.variant.stock ?? 1

    const newQuantity = (quantities[variantId] || 0) + change

    if (newQuantity > variantStock) {
      toast.error('Недостаточно товара на складе')

      return
    }

    if (newQuantity < 1) {
      await Api.cart.CartDELETE(id)
      toast.success('Вы успешно удалили продукт')
      const response = await Api.cart.CartListGET()

      setProductsCart(response)
    } else {
      setQuantities(prev => ({ ...prev, [variantId]: newQuantity }))

      await Api.cart.CartPATCH(id, newQuantity)
    }

  }

  const handleOrderWithoutUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBtnClicked(true)

    try {
      const items = cartItems?.map(item => ({
        variant: item.variant,
        quantity: quantities[item.variant] ?? 1,
      })) ?? []

      const dataToSend: CartTypes.OrderWithoutUserData = {
        email,
        phone_number,
        address,
        items,
        promocode,
      }

      const response = await Api.order.OrderWithoutUserPOST(dataToSend)

      if (response.success === true) {
        localStorage.removeItem('cartItems')
        const total = Number(response.data.total)

        if (total !== products.reduce((acc, item) => acc + Number(item.price) * (quantities[item.id] ?? 1), 0))  {
          toast.success(`Мы добавили ваш заказ и активировали ваш промокод, итоговая цена составила - ${total} руб.`)
          router.push('/products')
        } else {
          toast.success('Мы добавили ваш заказ')
          router.push('/products')
        }
      } else {
        toast.error('Что то пошло не так!')
      }
    } catch (error) {
      console.log('Submit error:', error)
    } finally {
      setIsBtnClicked(false)
    }
  }

  const handleOrderWithUser = async (e: React.FormEvent, data: any) => {
    e.preventDefault()
    setIsBtnClicked(true)

    try {
      const response = await Api.order.OrderWithUserPOST(data)

      if (response) {
        const total = Number(response.data.total)

        if (total !== productsCart.reduce((acc, item) => acc + Number(item.variant.price) * (quantities[item.variant.id] ?? 1), 0)) {
          toast.success(`Мы добавили ваш заказ и активировали ваш промокод, итоговая цена составила - ${response.data.total}`)
          router.push('/products')
        } else {
          toast.success('Мы добавили ваш заказ')
          router.push('/products')
        }
      } else {
        toast.error('Что то пошло не так!')
      }
    } catch (error) {
      console.log('Submit error:', error)
    } finally {
      setIsBtnClicked(false)
    }
  }

  if (cartItems === null && !tokens.access) {
    return (
      <div className={cls.page}>
        <Header />
        <main className={`container ${cls.flex_page}`}>
          <div className={cls.empty}>
            <div className={cls.flexx}>
              <h2 className={cls.empty_title}>В корзине пусто</h2>
              <button className={cls.btn} onClick={() => router.back()}>Вернуться назад</button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      {!tokens.access ? (
        <React.Fragment>
          <div className={cls.page}>
            <Header />
            <main className={`container ${cls.flex_page}`}>
              {
                products.length > 0 ? (
                  <React.Fragment>
                    <div className={cls.flex_page_item}>
                      <h1 className={cls.cart_title}>Корзина</h1>

                      <div className={cls.delete}>
                        <span>Удалить</span>
                      </div>

                      {products.map((item) => (
                        <div key={item.id} className={cls.cart_items}>
                          <div className={cls.cart_item_image_info}>
                            <div className={cls.cart_image}>
                              <Image src={`${API_URL}${item.product.main_image}`} width={105} height={130} alt={item.product.title} />
                            </div>

                            <div className={cls.cart_info}>
                              <h2 className={cls.cart_item_title}>{item.product.title}</h2>
                              <span className={cls.cart_item_article}>Артикул: {item.product.article}</span>
                              <span className={cls.cart_item_size}>Размер: {item.size.name}</span>
                              <span className={cls.cart_item_size}>Цвет: {item.color.name}</span>
                            </div>
                          </div>

                          <div className={cls.price_actions}>
                            <div className={cls.action_block}>
                              <div className={cls.actions}>
                                <button className={cls.actions_add} onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                <span className={cls.quantity}>{quantities[item.id] ?? 1}</span>
                                <button className={cls.actions_remove} onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                              </div>
                            </div>

                            <div className={cls.price_block}>
                              <span className={cls.cart_price}>
                                {getDiscount(Number(item.product.base_price) * (quantities[item.id] ?? 1), item.product.discount)} руб.
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>

                    <div className={cls.aaaa}>
                      {
                        orderActive ? (
                          <div className={cls.flex_page_item_cart}>
                            <div className={cls.cart_card}>
                              <h3 className={cls.cart_card_title}>ПРОЦЕСС ЗАКАЗА</h3>

                              <form className={cls.form}>
                                <input placeholder="Введите ваш email" name="email" type="email" className={cls.input} required value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input placeholder="Введите номер телефона" name="phone_number" type="text" className={cls.input} required value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                                <input placeholder="Введите адрес" name="address" type="text" className={cls.input} required value={address} onChange={(e) => setAddress(e.target.value)} />
                                <input placeholder="ПРОМОКОД" name="promocode" type="text" className={cls.input} value={promocode} onChange={(e) => setPromocode(e.target.value)} />
                                <button className={cls.order_btn} onClick={handleOrderWithoutUser} disabled={isBtnClicked}>Заказать</button>
                                <button className={cls.btn_cancel} onClick={() => setOrderActive(false)} disabled={isBtnClicked}>Отменить</button>
                              </form>
                            </div>
                          </div>
                        ) : (
                          <div className={cls.flex_page_item_cart}>
                            <div className={cls.cart_card}>
                              <h3 className={cls.cart_card_title}>ВАШ ЗАКАЗ</h3>

                              <div className={cls.list}>
                                {
                                  products.map((item) => (
                                    <div key={item.id} className={cls.cart_card_list}>
                                      <span className={cls.cart_card_list_info}>Товары: {quantities[item.id] ?? 1} шт.</span>
                                      <span className={cls.cart_card_list_price}>{getDiscount(Number(item.product.base_price) * (quantities[item.id] ?? 1), item.product.discount)} руб.</span>
                                    </div>
                                  ))
                                }
                              </div>

                              <div className={cls.total}>
                                <h3 className={cls.total_title}>ИТОГО</h3>
                                <span className={cls.total_price}>
                                  {products.reduce((acc, item) => acc + getDiscount(Number(item.product.base_price) * (quantities[item.id] ?? 1), item.product.discount), 0)} руб.
                                </span>
                              </div>

                              <button className={cls.order_btn} onClick={() => router.push(`/cart/order-process?cartItems=${encodeURIComponent(JSON.stringify(cartItems?.map(item => ({
                                variant: item.variant,
                                quantity: quantities[item.variant] ?? 1,
                              }))))}`)}
                              >ОФОРМИТЬ ЗАКАЗ</button>

                            </div>
                          </div>
                        )
                      }
                    </div>
                  </React.Fragment>
                ) : (
                  <Spin/>
                )
              }
            </main>
          </div>
        </React.Fragment>
      ) : (
        <div className={cls.page}>
          <Header />
          <main className={`container ${cls.flex_page}`}>
            {
              productsCart.length > 0 ? (
                <React.Fragment>
                  <div className={cls.flex_page_item}>
                    <h1 className={cls.cart_title}>Корзина</h1>

                    <div className={cls.delete}>
                      <span>Удалить</span>
                    </div>

                    {productsCart.map((item) => (
                      <div key={item.id} className={cls.cart_items}>
                        <div className={cls.cart_item_image_info}>
                          <div className={cls.cart_image}>
                            <Image src={`${item.variant.product.main_image}`} width={105} height={130} alt={item.variant.product.title} />
                          </div>

                          <div className={cls.cart_info}>
                            <h2 className={cls.cart_item_title}>{item.variant.product.title}</h2>
                            <span className={cls.cart_item_article}>Артикул: {item.variant.product.article}</span>
                            <span className={cls.cart_item_size}>Размер: {item.variant.size.name}</span>
                            <span className={cls.cart_item_size}>Цвет: {item.variant.color.name}</span>
                          </div>
                        </div>

                        <div className={cls.price_actions}>
                          <div className={cls.action_block}>
                            <div className={cls.actions}>
                              <button className={cls.actions_add} onClick={() => handleQuantityChangeWithUser(item.id, -1, item.variant.id)}>-</button>
                              <span className={cls.quantity}>{`${quantities[`${item.variant.id}`]}`}</span>
                              <button className={cls.actions_remove} onClick={() => handleQuantityChangeWithUser(item.id, 1, item.variant.id)}>+</button>
                            </div>
                          </div>

                          <div className={cls.price_block}>
                            <span className={cls.cart_price}>
                              {getDiscount(Number(item.variant.product.base_price) * (quantities[item.id] ?? 1), item.variant.product.discount)} руб.
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>

                  <div className={cls.aaaa}>
                    <div className={cls.flex_page_item_cart}>
                      <div className={cls.cart_card}>
                        <h3 className={cls.cart_card_title}>ВАШ ЗАКАЗ</h3>

                        <div className={cls.list}>
                          {
                            productsCart.map((item) => (
                              <div key={item.id} className={cls.cart_card_list}>
                                <span className={cls.cart_card_list_info}>Товары: {quantities[item.variant.id] ?? 1} шт.</span>
                                <span className={cls.cart_card_list_price}>{getDiscount(Number(item.variant.product.base_price) * (quantities[item.id] ?? 1), item.variant.product.discount)} руб.</span>
                              </div>
                            ))
                          }
                        </div>

                        <div className={cls.total}>
                          <h3 className={cls.total_title}>ИТОГО</h3>
                          <span className={cls.total_price}>
                            {productsCart.reduce((acc, item) => acc + getDiscount(Number(item.variant.product.base_price) * (quantities[item.id] ?? 1), item.variant.product.discount), 0)} руб.
                          </span>
                        </div>

                        {
                          !orderActive && (
                            <button className={cls.order_btn} onClick={() => {
                              router.push('/cart/order-process/')
                            }} disabled={isBtnClicked}
                            >ОФОРМИТЬ ЗАКАЗ</button>
                          )
                        }

                        {
                          orderActive && (
                            <>
                              <form className={cls.form}>
                                <input placeholder="Введите ваш email" name="email" type="email" className={cls.input} required value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input placeholder="Введите номер телефона" name="phone_number" type="text" className={cls.input} required value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                                <input placeholder="Введите адрес" name="address" type="text" className={cls.input} required value={address} onChange={(e) => setAddress(e.target.value)} />
                                <input placeholder="ПРОМОКОД" name="promocode" type="text" className={cls.input} value={promocode} onChange={(e) => setPromocode(e.target.value)} />
                                <button className={cls.order_btn} onClick={(e) => handleOrderWithUser(e, { email: email, phone_number: phone_number, address: address, promocode: promocode })} disabled={isBtnClicked}>Заказать</button>
                                <button className={cls.btn_cancel} onClick={() => setOrderActive(false)} disabled={isBtnClicked}>Отменить</button>
                              </form>

                            </>
                          )
                        }

                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                isProductsLoading ? (
                  <Spin/>
                ) : (
                  <div className={cls.empty}>
                    <div className={cls.flexx}>
                      <h2 className={cls.empty_title}>В корзине пусто</h2>
                      <button className={cls.btn} onClick={() => router.back()}>Вернуться назад</button>
                    </div>
                  </div>
                )
              )
            }
          </main>
        </div>
      )}
      <Footer/>
    </>
  )
}
