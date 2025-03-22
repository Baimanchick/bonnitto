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
              <strong>Bonnitto</strong> — это отражение элегантности, тонкого вкуса и внимания к каждой детали. Бренд был создан в 2019 году мамой и дочерью,
              объединёнными любовью к эстетике и качественной одежде. Каждая коллекция начинается с идеи, которая воплощается в авторских эскизах, а затем
              превращается в продуманные силуэты и безупречные образы. Вся продукция разрабатывается и производится в Бишкеке, что позволяет сохранять высокий
              стандарт качества и воплощать оригинальные дизайнерские решения.
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
            <strong>Bonnitto</strong> сочетает в себе классику и современность, минимализм и архитектурную выразительность. Чистые линии, продуманные силуэты и
            глубокая текстурность тканей делают каждую вещь актуальной вне времени. Вдохновение приходит из природы, искусства и винтажных мотивов, формируя
            стиль, который не подвержен сиюминутным тенденциям, а создаёт собственную эстетику.
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
            Каждое изделие проходит тщательный контроль качества и создаётся с вниманием к деталям. Все эскизы разрабатываются дизайнером бренда, чтобы каждая
            модель имела свою уникальность и характер. В основе коллекций — благородные ткани, сложные крои и авторский подход к дизайну. Производство в Бишкеке
            позволяет не просто следить за процессом, а делать одежду с душой и индивидуальностью.
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
            <strong>Bonnitto</strong> — для тех, кто ценит индивидуальность и хочет выделяться не за счёт ярких трендов, а благодаря утончённому стилю.
            Это выбор уверенных в себе людей, которые предпочитают эстетику, комфорт и продуманные детали в каждой вещи.
          </motion.p>
        </div>
      </motion.section>

      <Footer/>
    </div>
  )
}
