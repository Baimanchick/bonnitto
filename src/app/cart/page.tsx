/* eslint-disable no-unused-vars */
'use client'

import React from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Api } from '@/services'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import { Spin } from '@/shared/ui/spin/Spin'
import { API_URL } from '@/shared/utils/const'

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

  const storedToken = localStorage.getItem('tokens')
  const tokens = storedToken ? JSON.parse(storedToken) : ''

  const router = useRouter()

  React.useEffect(() => {
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
        const response = await Api.cart.CartListGET()

        console.log('r', response)

        setProductsCart(response)

        const initialQuantities = response.reduce((acc: { [key: number]: number }, product: ProductTypes.Variants) => {
          const cartItem = response.find((item: { variant: number }) => item.variant === product.id)

          acc[product.id] = cartItem?.quantity ?? 1

          return acc
        }, {})

        setQuantities(initialQuantities)
      }
    }

    loadData()
  }, [])

  const handleQuantityChange = (variantId: number, change: number) => {
    setQuantities((prev) => {
      const newQuantity = (prev[variantId] ?? 1) + change

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

  const handleQuantityChangeWithUser = async (id: number, change: number) => {
    const newQuantity = (quantities[id] || 0) + change

    if (newQuantity < 1) return

    setQuantities(prev => ({ ...prev, [id]: newQuantity }))

    await Api.cart.CartPATCH(id, newQuantity)
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
      }

      const response = await Api.order.OrderWithoutUserPOST(dataToSend)

      console.log('Order response:', response)
      if (response.success === true) {
        localStorage.removeItem('cartItems')
        router.push('/products')
        alert('Мы добавили ваш заказ')
      } else {
        alert('Что то пошло не так!')
      }
    } catch (error) {
      console.log('Submit error:', error)
    } finally {
      setIsBtnClicked(false)
    }
  }

  const handleOrderWithUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBtnClicked(true)

    try {
      const response = await Api.order.OrderWithUserPOST()

      console.log('Order response:', response)
      if (response) {
        router.push('/products')
        alert('Мы добавили ваш заказ')
      } else {
        alert('Что то пошло не так!')
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
    !tokens.access ? (
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
                              {Number(item.price) * (quantities[item.id] ?? 1)} С
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
                                    <span className={cls.cart_card_list_price}>{Number(item.price) * (quantities[item.id] ?? 1)} С</span>
                                  </div>
                                ))
                              }
                            </div>

                            <div className={cls.total}>
                              <h3 className={cls.total_title}>ИТОГО</h3>
                              <span className={cls.total_price}>
                                {products.reduce((acc, item) => acc + Number(item.price) * (quantities[item.id] ?? 1), 0)} с
                              </span>
                            </div>

                            <button className={cls.order_btn} onClick={() => setOrderActive(true)}>ОФОРМИТЬ ЗАКАЗ</button>

                          </div>

                          <div className={cls.cart_card_dop_info}>
                            <Image src={'/icons/credit-card.svg'} width={24} height={24} alt="lol" className={cls.credit_card_svg} />
                            <p className={cls.cart_card_dop_info_text}>Доступные способы оплаты: на сайте или  при получении</p>
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
                            <button className={cls.actions_add} onClick={() => handleQuantityChangeWithUser(item.id, -1)}>-</button>
                            <span className={cls.quantity}>{quantities[item.id] ?? 1}</span>
                            <button className={cls.actions_remove} onClick={() => handleQuantityChangeWithUser(item.id, 1)}>+</button>
                          </div>
                        </div>

                        <div className={cls.price_block}>
                          <span className={cls.cart_price}>
                            {Number(item.variant.price) * (quantities[item.id] ?? 1)} С
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
                              <span className={cls.cart_card_list_info}>Товары: {quantities[item.id] ?? 1} шт.</span>
                              <span className={cls.cart_card_list_price}>{Number(item.variant.price) * (quantities[item.id] ?? 1)} С</span>
                            </div>
                          ))
                        }
                      </div>

                      <div className={cls.total}>
                        <h3 className={cls.total_title}>ИТОГО</h3>
                        <span className={cls.total_price}>
                          {productsCart.reduce((acc, item) => acc + Number(item.variant.price) * (quantities[item.id] ?? 1), 0)} с
                        </span>
                      </div>

                      <button className={cls.order_btn} onClick={handleOrderWithUser} disabled={isBtnClicked}>ОФОРМИТЬ ЗАКАЗ</button>

                    </div>

                    <div className={cls.cart_card_dop_info}>
                      <Image src={'/icons/credit-card.svg'} width={24} height={24} alt="lol" className={cls.credit_card_svg} />
                      <p className={cls.cart_card_dop_info_text}>Доступные способы оплаты: на сайте или  при получении</p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div className={cls.empty}>
                <div className={cls.flexx}>
                  <h2 className={cls.empty_title}>В корзине пусто</h2>
                  <button className={cls.btn} onClick={() => router.back()}>Вернуться назад</button>
                </div>
              </div>
            )
          }
        </main>
      </div>
    )
  )
}
