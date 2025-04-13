'use client'

import React from 'react'

import Image from 'next/image'

import { Api } from '@/services'
import { formatDate, getDiscount, getStatus, getTinkoffStatus } from '@/shared/tools/discount'
import { Spin } from '@/shared/ui/spin/Spin'

import cls from './page.module.css'

export default function History() {
  const [historyList, setHistoryList] = React.useState<{count: number, next: string | null, previous: string | null, results: any[]} | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const getHistory = React.useCallback(async (url?: string) => {
    setIsLoading(true)
    try {
      const response = url
        ? await Api.products.getByUrl(url)
        : await Api.products.getHistory()

      setHistoryList(response)
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    getHistory()
  }, [getHistory])

  return (
    <main className={cls.container}>
      {
        isLoading ? (
          <Spin/>
        ) : (
          <div className={cls.page}>
            <div className={cls.titles}>
              <h1 className={cls.title}>История заказов:</h1>
            </div>

            <div className={cls.items}>
              {
                historyList?.results.map((history) => (
                  <div className={cls.item} key={history.uuid}>
                    <div className={cls.date}>Дата: {formatDate(history.created_at)}</div>
                    <div className={cls.date}>Cтатус: {getStatus(history.status)}</div>
                    {history.tinkoff_status ? <div className={cls.date}>Статус платежа: {getTinkoffStatus(history.tinkoff_status)}</div> : null}
                    <div className={cls.date}>Скидка по промокоду: {history.discount} руб.</div>
                    {
                      history.items.map((product: any) => (
                        <div key={product.variant.product.slug} className={cls.card}>
                          <Image src={product.variant.product.main_image} alt="image" width={150} height={200} className={cls.image} />

                          <div className={cls.info}>
                            <div className={cls.product_title}>{product.variant.product.title}</div>

                            <div className={cls.product_title}>Размер: {product.variant.size.name}</div>

                            <div className={cls.product_title}>Цвет: {product.variant.color.name}</div>

                            <div className={cls.product_title}>Цена: {getDiscount(product.variant.product.base_price, product.variant.product.discount)} руб</div>
                          </div>
                        </div>
                      ))
                    }

                    <hr/>

                    <div className={cls.total}>Итого: {parseInt(history.total)} руб.</div>
                  </div>
                ))
              }
            </div>

            <div className={cls.pagination}>
              {historyList?.previous && (
                <button className={cls.btn} onClick={() => getHistory(historyList.previous ? historyList.previous : '')}>Назад</button>
              )}
              {historyList?.next && (
                <button className={cls.btn} onClick={() => getHistory(historyList.next ? historyList.next : '')}>Вперёд</button>
              )}
            </div>
          </div>
        )
      }
    </main>
  )
}
