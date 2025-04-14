import $axios from '@/shared/api/axios'
import { CartTypes } from '@/shared/types/cart-types/CartTypes'
import { API_URL } from '@/shared/utils/const'

export const OrderWithoutUserPOST = async (data: CartTypes.OrderWithoutUserData) => {
  try {
    const response = await fetch('/api/order/without_user/', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const resposneData = await response.json()

    return resposneData
  } catch (error) {
    console.log('error getting products', error)
  }
}

export const OrderWithUserPOST = async (data: any) => {
  try {
    const response = await $axios.post(`${API_URL}/orders/from-cart/`, data)

    console.log('server resoi', response)

    return response
  } catch (error: any) {
    console.log('error post order with user', error)

    return error.response
  }
}

export const GetLocations = async (search: string) => {
  try {
    const response = await fetch(`${API_URL}/cdek/locations?city_name=${search}`)

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error', error)
  }
}

export const GetPvzs = async (code: number) => {
  try {
    const response = await fetch(`${API_URL}/cdek/pvzs?city_code=${code}`)

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error', error)
  }
}

export const changeUser = async (data: any) => {
  try {
    const response = await $axios.patch(`${API_URL}/users/me/`, data)

    return response.data
  } catch (error) {
    console.log('error', error)
  }
}
