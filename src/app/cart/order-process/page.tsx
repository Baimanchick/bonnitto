/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import toast from 'react-hot-toast'

import { useRouter, useSearchParams } from 'next/navigation'

import { Api } from '@/services'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'

import cls from './page.module.css'

export default function OrderProcessPage() {
  const searchParams = useSearchParams()
  const cartItemsParam = searchParams.get('cartItems')
  const [isBtnClicked, setIsBtnClicked] = React.useState(false)
  const [quantities, setQuantities] = React.useState<{ [key: number]: number }>({})
  const [products, setProducts] = React.useState<ProductTypes.Variants[]>([])
  const [email, setEmail] = React.useState('')
  const [phone_number, setPhoneNumber] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [promocode, setPromocode] = React.useState('')
  const [type, setType] = React.useState('')
  const [typeOfDeliver, setTypeOfDeliver] = React.useState('')
  const [total, setTotal] = React.useState(0)

  const router = useRouter()

  let cartItems = []
  let tokens: any

  if (typeof window !== 'undefined') {
    tokens = localStorage.getItem('tokens')
  }

  if (cartItemsParam) {
    try {
      cartItems = JSON.parse(decodeURIComponent(cartItemsParam))
    } catch (error) {
      console.error('Ошибка парсинга cartItems:', error)
    }
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = async () => {
        if (cartItems.length > 0) {
          try {
            const response = await Api.products.ProductsVariantsGET(cartItems.map((item: {quantity: number, variant: number}) => item.variant))

            setProducts(response.data)

            const initialQuantities = response.data.reduce((acc: { [key: number]: number }, product: ProductTypes.Variants) => {
              const cartItem = cartItems.find((item: { variant: number }) => item.variant === product.id)

              acc[product.id] = cartItem?.quantity ?? 1

              return acc
            }, {})

            const totals = response.data.reduce((acc: number, item: any) => acc + Number(item.product.base_price) * (quantities[item.id] ?? 1),0)

            setTotal(totals)

            setQuantities(initialQuantities)
          } catch (error) {
            console.error('Failed to parse cart items:', error)
          }
        }
      }

      loadData()
    }

  }, [])

  const handleOrderWithoutUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBtnClicked(true)

    try {
      const items = cartItems?.map((item: any) => ({
        variant: item.variant,
        quantity: quantities[item.variant] ?? 1,
      })) ?? []

      const dataToSend: CartTypes.OrderWithoutUserData = {
        email,
        phone_number,
        address,
        items,
        promocode,
        delivery_method: typeOfDeliver,
        payment_method: type,
      }

      const response = tokens ? await Api.order.OrderWithUserPOST(dataToSend) : await Api.order.OrderWithoutUserPOST(dataToSend)

      console.log('response', response)

      if (response.success === true) {
        localStorage.removeItem('cartItems')
        const total = Number(response.data.total)

        if (total !== products.reduce((acc, item) => acc + Number(item.price) * (quantities[item.id] ?? 1), 0))  {
          toast.success(`Мы добавили ваш заказ и активировали ваш промокод, итоговая цена составила - ${total} c`)
          if (response.data.payment_url) {
            router.push(response.data.payment_url)
          } else {
            router.push('/products')
          }
        } else {
          toast.success('Мы добавили ваш заказ')
          if (response.data.payment_url) {
            router.push(response.data.payment_url)
          } else {
            router.push('/products')
          }
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

  const handleOrderWithUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBtnClicked(true)

    try {
      const items = cartItems?.map((item: any) => ({
        variant: item.variant,
        quantity: quantities[item.variant] ?? 1,
      })) ?? []

      const dataToSend: CartTypes.OrderWithoutUserData = {
        email,
        phone_number,
        address,
        items,
        promocode,
        delivery_method: typeOfDeliver,
        payment_method: type,
      }

      const response = await Api.order.OrderWithUserPOST(dataToSend)

      console.log('response', response)

      if (response) {
        const total = Number(response.total)

        if (total !== products.reduce((acc, item) => acc + Number(item.price) * (quantities[item.id] ?? 1), 0))  {
          toast.success(`Мы добавили ваш заказ и активировали ваш промокод, итоговая цена составила - ${total} c`)
          if (response.payment_url) {
            router.push(response.payment_url)
          } else {
            router.push('/products')
          }
        } else {
          toast.success('Мы добавили ваш заказ')
          if (response.payment_method === 'card' && response.payment_url) {
            router.push(response.payment_url)
          } else {
            router.push('/products')
          }
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

  return (
    <>
      <div className={cls.page}>
        <Header />
        <form onSubmit={tokens ? handleOrderWithUser : handleOrderWithoutUser} className={`container ${cls.main_flex}`}>
          <div className={`${cls.flexPage}`}>
            <section className={cls.addressForm}>
              <h2 className={cls.sectionTitle}>Покупатель</h2>
              <div className={cls.personal_form}>
                <div className={cls.formGroup}>
                  <label htmlFor="address">Фамилия</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Например, ул. Пушкина, д. Колотушкина"
                  />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="index">Имя</label>
                  <input type="text" id="index" name="index" placeholder="Имя" />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="fullname">Ваш E-Mail</label>
                  <input type="text" id="fullname" name="fullname" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="floor">Ваш телефон</label>
                  <input type="text" id="floor" name="floor" placeholder="Номер телефона" required value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="floor">Промокод</label>
                  <input type="text" id="promocode" name="promocode" placeholder="Промокод" value={promocode} onChange={(e) => setPromocode(e.target.value)} />
                </div>
              </div>
            </section>
            <section className={cls.deliveryMethods}>
              <h2 className={cls.sectionTitle}>Способ оплаты</h2>
              <ul className={cls.deliveryList}>
                <li>
                  <label className={cls.deliveryOption}>
                    <div className={cls.radio_title}>
                      <span>Банковской картой</span>
                    </div>
                    <input type="radio" name="card" value="card" onChange={(value) => setType(value.target.value)} />
                  </label>
                </li>
                <li>
                  <label className={cls.deliveryOption}>
                    <div className={cls.radio_title}>
                      <span>Наличными</span>
                    </div>
                    <input type="radio" name="delivery" value="cash" onChange={(value) => setType(value.target.value)} />
                  </label>
                </li>
              </ul>
            </section>
            <section className={cls.deliveryMethods}>
              <h2 className={cls.sectionTitle}>Способы доставки</h2>
              <ul className={cls.deliveryList}>
                {
                  type !== 'cash' && (
                    <li>
                      <label className={cls.deliveryOption}>
                        <div className={cls.radio_title}>
                          <span>Доставка</span>
                        </div>
                        <input type="radio" name="delivery" value="delivery" onChange={(value) => setTypeOfDeliver(value.target.value)} />
                      </label>
                    </li>
                  )
                }
                <li>
                  <label className={cls.deliveryOption}>
                    <div className={cls.radio_title}>
                      <span>Самовывоз</span>
                    </div>
                    <input type="radio" name="self_pickup" value="self_pickup" onChange={(value) => setTypeOfDeliver(value.target.value)} />
                  </label>
                </li>
              </ul>
            </section>
            <section className={cls.addressForm}>
              <h2 className={cls.sectionTitle}>{typeOfDeliver === 'delivery' ? 'Выберите адрес доставки' : 'Адрес магазина'}</h2>
              <div>
                <div className={cls.formGroup_address}>
                  {typeOfDeliver === 'delivery' && (<label htmlFor="address" />)}
                  {
                    typeOfDeliver === 'self_pickup' ? (
                      <input
                        readOnly
                        type="text"
                        id="address"
                        name="address"
                        value={'Адрес боннито'}
                      />
                    ) : (
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Например, ул. Пушкина, д. Колотушкина"
                        required value={address} onChange={(e) => setAddress(e.target.value)}
                      />
                    )
                  }
                </div>
              </div>
            </section>
          </div>

          <div className={cls.categories}>
            <div className={cls.cart_card}>
              <h3 className={cls.sectionTitle}>ВАШ ЗАКАЗ</h3>

              <div className={cls.list}>
                <div className={cls.cart_card_list}>
                  <span className={cls.cart_card_list_info}>Товаров на</span>
                  <span className={cls.cart_card_list_price}>{total} С</span>
                </div>

              </div>

              <div className={cls.total}>
                <h3 className={cls.sectionTitle}>ИТОГО</h3>
                <span className={cls.total_price}>
                  {total} с
                </span>
              </div>

              <button className={cls.order_btn} type="submit" disabled={isBtnClicked}>ОФОРМИТЬ ЗАКАЗ</button>

            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}
