import $axios from '@/shared/api/axios'
import { API_URL } from '@/shared/utils/const'

export const CartListGET = async () => {
  try {
    const response = await $axios.get(`${API_URL}/cart/`)

    return response.data.results
  } catch (error) {
    console.log('error getting cart', error)
  }
}

export const CartPATCH = async (id: number, quantity: number) => {
  try {
    const response = await $axios.patch(`${API_URL}/cart/${id}/`, {
      quantity: quantity,
    })

    return response.data
  } catch (error) {
    console.log('error change cart', error)
  }
}
