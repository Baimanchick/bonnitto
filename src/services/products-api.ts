export const ProductsGET = async (category_slug?: string, page: number = 1, limit: number = 2) => {
  try {
    const query = category_slug ? `?category_slug=${category_slug}` : ''

    const response = await fetch(`/api/products${query}`, {
      method: 'GET',
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error getting products', error)
  }
}
