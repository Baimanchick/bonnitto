export const CategoriesGET = async () => {
  try {
    const response = await fetch('/api/categories/', {
      method: 'GET',
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error get categories', error)
  }
}
