'use client'

import React, { useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Api } from '@/services'
import { MainImageTypes } from '@/shared/types/main-images/MainImage'

import { Spin } from '../spin/Spin'

import styles from './ImageSlider.module.css'

const slideVariants = {
  enter:  { x: '100%' },
  center: { x: '0%' },
  exit:   { x: '-100%' },
}
const TRANSITION = { x: { type: 'spring', stiffness: 220, damping: 28 } }

const ImageSlider = () => {
  const [current, setCurrent] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [meta, setMeta] = useState<MainImageTypes.Item[]>([])
  const router = useRouter()

  useEffect(() => {
    Api.mainImages.MainImagesGET()
      .then(({ data }) => {
        setImages(data.map((i: any) => i.image))
        setMeta(data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!images.length) return
    const id = setInterval(
      () => setCurrent(p => (p + 1) % images.length),
      3000,
    )

    return () => clearInterval(id)
  }, [images])

  if (!images.length) return <Spin />

  const next = (current + 1) % images.length

  const goTo = (idx: number) => {
    const item = meta[idx]

    if (item?.collection) {
      router.push(
        `/collections/${item.collection.slug}?collection_title=${item.collection.title}`,
      )
    } else {
      router.push('/products')
    }
  }

  return (
    !images.length ? (
      <Spin/>
    ) : (
      <div className={styles.main_block}>
        <div className={styles.slider}>
          <div className={styles.imageContainer}>
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
                className={styles.imageWrapper}
                onClick={() => goTo(current)}
              >
                <Image
                  src={images[current]}
                  alt={meta[current]?.collection?.title || 'Image'}
                  fill
                  style={{ objectFit: 'cover', cursor: 'pointer' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.imageContainer2}>
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={next}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
                className={styles.imageWrapper}
                onClick={() => goTo(next)}
              >
                <Image
                  src={images[next]}
                  alt={meta[next]?.collection?.title || 'Preview'}
                  fill
                  style={{ objectFit: 'cover', cursor: 'pointer' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.info}>
            <h1 className={styles.collection_title}>
              {meta[current]?.collection?.title || ''}
            </h1>
            <p onClick={() => goTo(current)} className={styles.collection_text}>
              {meta[current]?.text || 'НОВИНКИ'}
            </p>
          </div>
        </div>
      </div>
    )
  )
}

export default ImageSlider
