import { ProductTypes } from '@/shared/types/products/ProductsTypes'

interface SearchResponse {
  success: boolean
  data: {
    results: ProductTypes.Item[]
  }
  error?: string
}

export const searchProductsApi = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data: SearchResponse = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching search results:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при поиске товаров',
      data: {
        results: [],
      },
    }
  }
}
