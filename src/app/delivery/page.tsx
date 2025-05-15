'use client'

import React from 'react'

import { motion } from 'framer-motion'

import { Header } from '@/shared/ui/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'

import cls from './page.module.css'

export default function Delivery() {
  return (
    <div className={cls.deliveryPage}>
      <Header />

      <section className={cls.heroSection}>
        <div className="container">

          <motion.h1
            className={cls.heroTitle}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Условия доставки
          </motion.h1>
        </div>
      </section>

      <nav className={cls.deliveryNav}>
        <div className="container">
          <ul>
            <li><a href="#general">ДОСТАВКА</a></li>
            <li><a href="#russia">ДОСТАВКА ПО РФ</a></li>
            <li><a href="#moscow">ДОСТАВКА ПО МОСКВЕ</a></li>
            <li><a href="#world">ДОСТАВКА ПО МИРУ</a></li>
          </ul>
        </div>
      </nav>

      <section className={cls.deliveryInfo}>
        <div className="container">
          <div id="general" className={cls.sectionBlock}>
            <h2>ДОСТАВКА</h2>
            <p>
              При оформлении покупки Вы можете выбрать удобный для вас способ доставки.
              После оформления заказа с вами свяжется менеджер для его подтверждения.
            </p>
          </div>

          <div id="russia" className={cls.sectionBlock}>
            <h2>ДОСТАВКА ПО РФ</h2>
            <p>
              Доставка осуществляется после 100% оплаты заказа на сайте.
              Сроки и стоимость доставки зависят от региона и рассчитываются индивидуально.
              При покупке от 10 000 рублей доставка бесплатная.
            </p>
            <p>
              Доставка производится транспортной компанией СДЭК (CDEK) от 2 до 7 рабочих дней.
              При оформлении заказа в субботу, воскресенье и праздничные дни — отправка
              осуществляется в ближайший рабочий день.
            </p>
            <p>
              Курьерская доставка по России и СНГ исключает возможность примерки
              и мгновенного возврата товара.*
            </p>
            <p>
              Подробнее о доставке вас может проконсультировать менеджер индивидуально по телефону&nbsp;
              <a href="tel:+79687509767" className={cls.phoneLink}>+7 968 750 97 67</a>
            </p>
          </div>

          <div id="moscow" className={cls.sectionBlock}>
            <h2>ДОСТАВКА ПО МОСКВЕ</h2>
            <p>
              Доставка осуществляется в течение 2–3 дней после 100% оплаты заказа на сайте.
              Стоимость доставки курьером: 500–1000 рублей по Москве в пределах МКАД при покупках до 20 000 рублей.
              Стоимость доставки при покупке от 20 000 рублей – бесплатная.
            </p>
            <p>
              Комплектация заказов производится в рабочие часы: в будние дни с 11.00 до 20.00,
              в выходные и праздничные дни с 12.00 до 19.00.
            </p>
          </div>

          <div id="world" className={cls.sectionBlock}>
            <h2>ДОСТАВКА ПО МИРУ</h2>
            <p>
              Доставка курьером EMS (Почта России). Доставка курьером DHL.
              Стоимость доставки рассчитывается согласно официальным тарифам партнера
              индивидуально для каждого заказа.
            </p>
            <p>
              Подробнее о доставке вас может проконсультировать менеджер индивидуально по телефону&nbsp;
              <a href="tel:+79687509767" className={cls.phoneLink}>+7 968 750 97 67</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
