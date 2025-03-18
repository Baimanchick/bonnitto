'use client'

import React from 'react'

import { motion } from 'framer-motion'

import { Header } from '@/shared/ui/header/ui/Header'
import Footer from '@/widgets/footer/ui/Footer'

import cls from './page.module.css'

export default function About() {
  return (
    <div className={cls.aboutPage}>
      <Header />

      <motion.section
        className={cls.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <motion.h1
            className={cls.heroTitle}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            О бренде Bonnitto
          </motion.h1>
          <motion.p
            className={cls.heroSubtitle}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Бренд, основанный в 2019 году мамой и дочерью, воплощающий элегантность,
            утончённость и внимание к деталям.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className={cls.infoSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="container">
          <motion.div
            className={cls.sectionContent}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p>
              <strong>Bonnitto</strong> — бренд, основанный в 2019 году мамой и дочерью,
              который воплощает в себе элегантность, утончённость и внимание к деталям.
              Одежда создаётся и отшивается в Бишкеке, что позволяет тщательно контролировать
              качество и воплощать уникальные дизайнерские идеи.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={cls.philosophySection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Философия бренда
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <strong>Bonnitto</strong> — это сочетание классики и современности, минимализма
            и утончённой архитектурности. Вещи отличает чистота линий, продуманность силуэтов
            и особое внимание к текстурам. Бренд черпает вдохновение в природе, искусстве
            и винтажной моде, создавая одежду, которая выглядит стильно вне времени.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className={cls.productionSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Производство и материалы
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Все изделия отшиваются в Бишкеке, что даёт возможность сохранять высокие стандарты
            качества. Акцент сделан на благородные ткани, сложные крои и индивидуальный подход
            к каждой коллекции.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className={cls.forWhoSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Для кого?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <strong>Bonnitto</strong> — для тех, кто ценит эстетику, хочет выделяться, но не
            за счёт кричащих трендов, а благодаря утончённому вкусу и продуманным деталям.
            Это одежда для сильных, уверенных в себе людей, которые выбирают стиль,
            проверенный временем.
          </motion.p>
        </div>
      </motion.section>

      <Footer/>
    </div>
  )
}
