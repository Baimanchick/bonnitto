export const ProductsGET = async (category_slug?: string, page: number = 1, limit: number = 10) => {
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

export const ProductSlugGET = async (products_slug: string | string[] | undefined) => {
  try {
    const response = await fetch(`/api/products/${products_slug}`, {
      method: 'GET',
    })

    const data = await response.json()

    return data.data
  } catch (error) {
    console.log('error getting product detail', error)
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
    console.log('error getting product detail', error)
  }
}

export const ProductSlugVariantsGET = async (products_slug: string | string[] | undefined, color_id?: string, sized_id?: string) => {
  try {
    let query = ''

    if (color_id && sized_id) {
      query = `?color_id=${color_id}&size_id=${sized_id}`
    } else if (color_id) {
      query = `?color_id=${color_id}`
    } else if (sized_id) {
      query = `?size_id=${sized_id}`
    }

    const queryString = query ? `${query}` : ''

    const response = await fetch(`/api/products/variants/${products_slug}/${queryString}`, {
      method: 'GET',
    })

    console.log('response', response)

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error getting product detail', error)
  }
}
