'use client'

import React from 'react'

import { motion } from 'framer-motion'

import { Header } from '@/shared/ui/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'

import cls from './page.module.css'

export default function ReturnExchange() {
  return (
    <div className={cls.returnExchangePage}>
      <Header />

      <section className={cls.heroSection}>
        <div className="container">
          <motion.h1
            className={cls.heroTitle}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ОБМЕН И ВОЗВРАТ
          </motion.h1>
        </div>
      </section>

      <section className={cls.infoSection}>
        <div className="container">
          <motion.div
            className={cls.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Условия обмена и возврата</h2>
            <ul>
              <li>Обмен и возврат товара возможен в течение 7 дней после получения заказа.</li>
              <li>Отсутствие следов эксплуатации изделия.</li>
              <li>Сохранение товарного вида, потребительских свойств, ярлыков и этикеток.</li>
            </ul>
          </motion.div>

          <motion.div
            className={cls.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Оформление возврата</h2>
            <p>
              Для оформления возврата свяжитесь с нами по номеру телефона с темой <strong>”Обмен или Возврат”</strong>.
            </p>
            <p>
              Обращаем Ваше внимание, что все расходы за возврат товара оплачиваются покупателем согласно тарифам транспортных компаний.
            </p>
            <p>
              Отправьте посылку курьерской компанией СDEK (СДЕК) по адресу: <strong>Ул. Земляной Вал 14/16</strong>
            </p>
            <p>
              Контактный телефон: <a href="tel:+79687509767" className={cls.phoneLink}>+7 (968) 750-97-67</a>
            </p>
            <p>
              После осуществления возврата обязательно свяжитесь с нами и сообщите трек–номер для отслеживания.
            </p>
          </motion.div>

          <motion.div
            className={cls.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2>Возврат денежных средств</h2>
            <p>
              После получения товара в Москве и проверки соблюдения всех условий возврата, Ваша заявка будет обработана в течение 1-2 рабочих дней.
            </p>
            <p>
              Возврат денежных средств производится в течение 14 рабочих дней на банковский счет, с которого осуществлялась оплата.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
