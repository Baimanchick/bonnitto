export const getDiscount = (base_price: number, discount: string) => {
  const basePriceNum = base_price
  const discountNum = parseFloat(discount)

  if (isNaN(basePriceNum) || isNaN(discountNum)) {
    throw new Error('Invalid input: base_price and discount should be numbers in string format.')
  }

  return basePriceNum - discountNum
}

export const getDiscountPercentage = (originalPrice: number, discountAmount: number) => {
  if (discountAmount && discountAmount < originalPrice) {
    return Math.round((discountAmount / originalPrice) * 100)
  }

  return 0
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const padZero = (n: any) => n.toString().padStart(2, '0')

  const day = padZero(date.getDate())
  const month = padZero(date.getMonth() + 1)
  const year = date.getFullYear()
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())

  return `${day}-${month}-${year} ${hours}:${minutes}`
}

export const getStatus = (key: 'new' | 'processing' | 'shipped' | 'cancelled'): string => {
  const statuses = {
    new: 'Новый',
    processing: 'В обработке',
    shipped: 'Отправлен',
    cancelled: 'Отменён',
  }

  return statuses[key]
}

export const getTinkoffStatus = (key: 'pending' | 'paid' | 'failed' | 'timeout'): string => {
  const statuses = {
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    failed: 'Ошибка оплаты',
    timeout: 'Время оплаты вышло',
  }

  return statuses[key]
}
