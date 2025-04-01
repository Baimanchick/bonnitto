export const getDiscount = (base_price: number, discount: string) => {
  const basePriceNum = base_price
  const discountNum = parseFloat(discount)

  if (isNaN(basePriceNum) || isNaN(discountNum)) {
    throw new Error('Invalid input: base_price and discount should be numbers in string format.')
  }

  return basePriceNum - (basePriceNum * discountNum) / 100
}
