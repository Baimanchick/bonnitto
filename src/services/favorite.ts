
import $axios from '@/shared/api/axios'
import { FavoritesType } from '@/shared/types/favorite-types/favorite'
import { API_URL } from '@/shared/utils/const'

export const addFavorite = async (dataToSend: FavoritesType.Form) => {
  try {
    await $axios.post(`${API_URL}/favorites/`, dataToSend)

  } catch (error) {
    console.log(error)
  }
}

export const favoritesGET = async () => {
  try {
    const response = await $axios.get(`${API_URL}/favorites/`)

    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const favoritesDELETE = async (id: number) => {
  try {
    await $axios.delete(`${API_URL}/favorites/${id}/`)

    favoritesGET()
  } catch (error) {
    console.log('delete favorite error', error)
  }
}
