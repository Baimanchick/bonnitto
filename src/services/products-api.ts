export const ProductsGET = async (category_slug?: string, page: number = 1, limit: number = 10) => {
  try {
    const query = category_slug
      ? `?category_slug=${category_slug}&page=${page}&limit=${limit}`
      : `?page=${page}&limit=${limit}`

    const response = await fetch(`/api/products${query}`, {
      method: 'GET',
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error getting products', error)
  }
}

export const ProductsVariantsGET = async (variants_id: number[]) => {
  try {
    const queryString = variants_id.join(',')
    const response = await fetch(`/api/products/variants?variant_ids=${queryString}`, {
      method: 'GET',
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log('Error getting products variants:', error)
  }
}
