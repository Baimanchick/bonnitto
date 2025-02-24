import { CartTypes } from '@/shared/types/cart-types/CartTypes'

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
