/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import toast from 'react-hot-toast'

import { useRouter, useSearchParams } from 'next/navigation'

import { Api } from '@/services'
import { debounce } from '@/shared/tools/debounce'
import { getDiscount } from '@/shared/tools/discount'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { LocationTypes } from '@/shared/types/products/LocationTypes'
import { ProductTypes } from '@/shared/types/products/ProductsTypes'
import { Header } from '@/shared/ui/header/ui/Header'
import { Spin } from '@/shared/ui/spin/Spin'
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
  const [typeOfDeliver, setTypeOfDeliver] = React.useState('self_pickup')
  const [total, setTotal] = React.useState(0)
  const [first_name, setFirstName] = React.useState('')
  const [last_name, setLastName] = React.useState('')
  const [surname, setSurname] = React.useState('')
  const [comment, setComment] = React.useState('')
  const [cdekType, setCdekType] = React.useState(false)
  const [locations, setLocations] = React.useState<LocationTypes.List[]>([])
  const [loading, setLoading] = React.useState(false)
  const [code, setCode] = React.useState<LocationTypes.List | null>(null)
  const [pvzs, setPvzs] = React.useState<{code: string, office_type: string, address: string, work_time: string}[] | null>(null)
  const [ploading, setPLoading] = React.useState(false)
  const [pvz, setPvz] = React.useState<{code: string, office_type: string, address: string, work_time: string} | null>(null)
  const [user, setUser] = React.useState<any>(null)

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

            const totals = response.data.reduce((acc: number, item: any) => acc + getDiscount(Number(item.product.base_price) * (initialQuantities[item.id] ?? 1), item.product.discount),0)

            setTotal(totals)

            setQuantities(initialQuantities)
          } catch (error) {
            console.error('Failed to parse cart items:', error)
          }
        } else {
          const userData = localStorage.getItem('user')

          if (userData) {
            const parsedUser = JSON.parse(userData)

            console.log(parsedUser)

            setUser(parsedUser)
            setEmail(parsedUser.email)
            setFirstName(parsedUser.first_name ? parsedUser.first_name : '')
            setLastName(parsedUser.last_name ? parsedUser.last_name : '')
            setSurname(parsedUser.surname ? parsedUser.surname : '')
            setPhoneNumber(parsedUser.phone_number ? parsedUser.phone_number : '')
            setAddress(parsedUser.address ? parsedUser.address : '')
          }

          const response = await Api.cart.CartListGET()

          setProducts(response.map((item: any) => item.variant.product))

          const initialQuantities = response.reduce((acc: { [key: number]: number }, cartItem: any) => {
            acc[cartItem.variant.id] = cartItem.quantity

            return acc
          }, {})

          const totals = response.reduce((acc: any, item: any) =>
            acc + getDiscount(
              Number(item.variant.product.base_price) * (initialQuantities[item.variant.id] ?? 1),
              item.variant.product.discount,
            ), 0,
          )

          setTotal(totals)

          setQuantities(initialQuantities)
        }
      }

      loadData()
    }

    setAddress('Земляной Вал 14/16 График работы 10:00-21:00')
  }, [])

  const getLocations = React.useCallback(async (search: string) => {
    try {
      const response = await Api.order.GetLocations(search)

      setLocations(response)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPvzs = async (code: number) => {
    setPLoading(true)
    try {
      const response = await Api.order.GetPvzs(code)

      setPvzs(response)
    } catch (error) {
      console.log('error', error)
    } finally {
      setPLoading(false)
    }
  }

  const debouncedSearch = React.useMemo(() => debounce((value: string) => {
    setLoading(true)
    getLocations(value)
  }, 700), [getLocations])

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
        address: pvz ? pvz.address : address,
        items,
        promocode,
        delivery_method: typeOfDeliver,
        first_name,
        last_name,
        surname,
        comment,
        cdek_pvz_code: pvz?.code,
        city: code?.code,
        city_name: code?.name,
      }

      const response = tokens ? await Api.order.OrderWithUserPOST(dataToSend) : await Api.order.OrderWithoutUserPOST(dataToSend)

      if (response.success === true) {
        localStorage.removeItem('cartItems')
        const total = Number(response.data.total)

        if (total !== products.reduce((acc, item) => acc + Number(item.price) * (quantities[item.id] ?? 1), 0))  {
          toast.success(`Мы добавили ваш заказ и активировали ваш промокод, итоговая цена составила - ${total} руб.`)
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
        first_name,
        last_name,
        surname,
        comment,
        city: code?.code,
        city_name: code?.name,
      }

      const response = await Api.order.OrderWithUserPOST(dataToSend)

      if (response?.status === 400) {
        toast.error(`Ошибка: ${response.data.detail || 'Некорректный запрос'}`)
      } else {
        if (response?.data) {
          const total = Number(response.data.total)

          if (total !== products.reduce((acc, item) => acc + Number(item.price) * (quantities[item.id] ?? 1), 0))  {
            toast.success(`Мы добавили ваш заказ и активировали ваш промокод, итоговая цена составила - ${total} руб.`)
            if (response.data.payment_url) {
              router.push(response.data.payment_url)
            } else {
              router.push('/products')
            }
          } else {
            toast.success('Мы добавили ваш заказ')
            if (response.data.payment_method === 'card' && response.data.payment_url) {
              router.push(response.data.payment_url)
            } else {
              router.push('/products')
            }
          }

          if ((!user.first_name || !user.last_name || !user.surname || !user.phone_number || !user.address) || (user.first_name !== first_name || user.last_name !== last_name || user.surname !== surname || user.phone_number !== phone_number || user.address !== address)) {
            const newUser = await Api.order.changeUser({ first_name, last_name, phone_number, surname, address })

            console.log('response', newUser)
            localStorage.setItem('user', JSON.stringify(newUser))
          }
        } else {
          toast.error('Что то пошло не так!')
        }
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
                    id="last_name"
                    name="last_name"
                    placeholder="Фамилия"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="index">Имя</label>
                  <input type="text" id="first_name" name="first_name" placeholder="Имя" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="index">Отчество</label>
                  <input type="text" id="surname" name="surname" placeholder="Отчество" value={surname} onChange={(e) => setSurname(e.target.value)} />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="fullname">Ваш E-Mail</label>
                  <input type="email" id="fullname" name="fullname" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={cls.formGroup}>
                  <label htmlFor="floor">Ваш телефон</label>
                  <input type="text" id="floor" name="floor" placeholder="Номер телефона" required value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
              </div>
            </section>
            <section className={cls.deliveryMethods}>
              <h2 className={cls.sectionTitle}>Способы доставки</h2>
              <ul className={cls.deliveryList}>
                <li>
                  <label className={cls.deliveryOption}>
                    <div className={cls.radio_title}>
                      <span>Самовывоз</span>
                    </div>
                    <input defaultChecked={true} type="radio" name="delivery_method" value="self_pickup" onChange={(value) => {
                      if (value.target.value === 'self_pickup') {
                        setTypeOfDeliver(value.target.value)
                        setAddress('Земляной Вал 14/16 График работы 10:00-21:00')
                        setCdekType(false)
                        setCode(null)
                        setPvz(null)
                      }
                    }}
                    />
                  </label>
                </li>
                <li>
                  <label className={cls.deliveryOption}>
                    <div className={cls.radio_title}>
                      <span>СДЭК: доставка курьером</span>
                    </div>
                    <input type="radio" name="delivery_method" value="cdek_courier" onChange={(value) => {
                      setTypeOfDeliver(value.target.value)
                      setAddress('')
                      setCdekType(false)
                      setCode(null)
                      setPvz(null)
                    }}
                    />
                  </label>
                </li>
                <li>
                  <label className={cls.deliveryOption}>
                    <div className={cls.radio_title}>
                      <span>СДЭК: пункт выдачи</span>
                    </div>
                    <input type="radio" name="delivery_method" value="cdek_pvz" onChange={(value) => {
                      setTypeOfDeliver(value.target.value)
                      setCdekType(true)
                      setAddress('')
                      setCode(null)
                      setPvz(null)
                    }}
                    />
                  </label>
                </li>
              </ul>
            </section>

            {
              typeOfDeliver === 'cdek_courier' && (
                <section className={cls.addressForm}>
                  <h2 className={cls.sectionTitle}>Выберите город</h2>
                  <div>
                    <div className={cls.formGroup_address}>
                      <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Город"
                        required
                        onChange={(e) => {
                          setLoading(true)
                          debouncedSearch(e.target.value)
                        }}
                      />
                    </div>

                    <div className={cls.location_list}>
                      {
                        loading && (
                          <Spin/>
                        )
                      }
                      {
                        locations && locations.length > 0 && (
                          code ? (
                            <div className={cls.formGroup_address}>
                              <input
                                readOnly
                                type="text"
                                value={code.name}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          ) : (
                            locations.map((location, index) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <div key={index} className={cls.formGroup_address} onClick={() => {
                                setCode(location)
                                getPvzs(location.code)
                              }}
                              >
                                <input
                                  readOnly
                                  type="text"
                                  value={location.name}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            ))
                          )
                        )
                      }
                    </div>
                  </div>
                </section>
              )
            }

            {
              cdekType ? (
                <>
                  <section className={cls.addressForm}>
                    <h2 className={cls.sectionTitle}>Локации СДЕК</h2>
                    <div>
                      <div className={cls.formGroup_address}>
                        <input
                          type="text"
                          id="search"
                          name="search"
                          placeholder="Поиск локации СДЕК"
                          required
                          onChange={(e) => {
                            setLoading(true)
                            debouncedSearch(e.target.value)
                          }}
                        />
                      </div>

                      <div className={cls.location_list}>
                        {
                          loading && (
                            <Spin/>
                          )
                        }
                        {
                          locations && locations.length > 0 && (
                            code ? (
                              <div className={cls.formGroup_address}>
                                <input
                                  readOnly
                                  type="text"
                                  value={code.name}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            ) : (
                              locations.map((location, index) => (
                              // eslint-disable-next-line react/no-array-index-key
                                <div key={index} className={cls.formGroup_address} onClick={() => {
                                  setCode(location)
                                  getPvzs(location.code)
                                }}
                                >
                                  <input
                                    readOnly
                                    type="text"
                                    value={location.name}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                              ))
                            )
                          )
                        }
                      </div>
                    </div>
                  </section>

                  {
                    code && (
                      <section className={cls.addressForm}>
                        <h2 className={cls.sectionTitle}>Пункты выдачи СДЕК</h2>
                        <div>
                          <div className={cls.location_list}>
                            {
                              ploading && (
                                <Spin/>
                              )
                            }
                            {
                              pvzs && pvzs?.length > 0 && (
                                pvz ? (
                                  <div className={cls.formGroup_address}>
                                    <input
                                      readOnly
                                      type="text"
                                      value={pvz?.address}
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </div>
                                ) : (
                                  pvzs.map((pvz, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <div key={index} className={cls.formGroup_address} onClick={() => setPvz(pvz)}>
                                      <input
                                        readOnly
                                        type="text"
                                        value={pvz.address}
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </div>
                                  ))
                                )
                              )
                            }
                          </div>
                        </div>
                      </section>
                    )
                  }
                </>
              ) : (
                <section className={cls.addressForm}>
                  <h2 className={cls.sectionTitle}>{typeOfDeliver === 'delivery' || typeOfDeliver === 'cdek_courier' ? 'Выберите адрес доставки' : 'Адрес магазина'}</h2>
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
                            value={address}
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
              )
            }

            <section className={cls.addressForm}>
              <h2 className={cls.sectionTitle}>Комментарий</h2>
              <div>
                <div className={cls.formGroup_address}>
                  <label htmlFor="floor" />
                  <input type="text" id="comment" name="comment" placeholder="Комментарий к заказу" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
              </div>
            </section>

            <section className={cls.addressForm}>
              <h2 className={cls.sectionTitle}>Промокод</h2>
              <div>
                <div className={cls.formGroup_address}>
                  <input type="text" id="promocode" name="promocode" placeholder="Промокод" value={promocode} onChange={(e) => setPromocode(e.target.value)} />
                </div>
              </div>
            </section>
          </div>

          <div className={cls.categories}>
            <div className={cls.cart_card}>
              <h3 className={cls.sectionTitle}>ВАШ ЗАКАЗ</h3>

              <span className={cls.cart_card_list_info}>
                Оплата банковской картой
              </span>
              <div className={cls.list} style={{ marginTop: '15px' }}>
                <div className={cls.cart_card_list}>
                  <span className={cls.cart_card_list_info}>Товаров на</span>
                  <span className={cls.cart_card_list_price}>{total} руб.</span>
                </div>

              </div>

              <div className={cls.total}>
                <h3 className={cls.sectionTitle}>ИТОГО</h3>
                <span className={cls.total_price}>
                  {total} руб.
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
