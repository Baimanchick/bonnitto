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

    return response.data
  } catch (error) {
    console.log('error getting products', error)
  }
}
