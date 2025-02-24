export const MainImagesGET = async () => {
  try {
    const response = await fetch('/api/main-images/', {
      method: 'GET',
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log('error getting main images', error)
  }
}
