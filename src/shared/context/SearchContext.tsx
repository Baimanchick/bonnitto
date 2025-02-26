'use client'

import React, { createContext, useContext, useState } from 'react'

import { Api } from '@/services'

interface SearchProduct {
  slug: string
  title: string
  base_price: string
  main_image: string
}

interface SearchContextType {
  searchQuery: string
  searchResults: SearchProduct[]
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])

      return
    }

    try {
      const response = await Api.products.ProductsSearchGET(query)

      console.log('Search response:', response)
      if (response?.data?.results) {
        setSearchResults(response.data.results)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Ошибка при поиске:', error)
      setSearchResults([])
    }
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        setSearchQuery,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }

  return context
}
