import * as Cart from './cart-api'
import * as Categories from './categories-api'
import * as MainImages from './main-images-api'
import * as Order from './order-api'
import * as Products from './products-api'
import * as SearchProducts from './seacrhProducts-api'

export const Api = {
  products: Products,
  categories: Categories,
  mainImages: MainImages,
  order: Order,
  cart: Cart,
  searchProducts: SearchProducts,
}
