'use client'

import React, { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import { Api } from '@/services'
import { MainImageTypes } from '@/shared/types/main-images/MainImage'

import { Spin } from '../spin/Spin'

import styles from './ImageSlider.module.css'

const ImageSlider = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [screenHeight, setScreenHeight] = useState<number>(0)
  const [imageData, setImageData] = useState<string[]>([])
  const [mainData, setMainData] = useState<MainImageTypes.Item[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenHeight(window.innerHeight)
    }

    const loadData = async () => {
      try {
        const { data } = await Api.mainImages.MainImagesGET()

        setImageData(data.map((item: MainImageTypes.Item) => item.image))
        setMainData(data)

        const interval = setInterval(() => {
          setCurrentImage((prev) => (prev + 1) % data.length)
        }, 3000)

        return () => clearInterval(interval)
      } catch (error) {
        console.error('Failed to load images:', error)
      }
    }

    loadData()
  }, [])

  console.log('main data', mainData)

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  const result = screenHeight - 80

  return imageData.length > 0 && mainData.length > 0 ? (
    <div className={styles.main_block}>
      <div className={styles.slider} style={{ height: result }}>
        <div className={styles.imageContainer}>
          <AnimatePresence>
            <motion.div
              key={currentImage}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={imageVariants}
              transition={{ duration: 0.8 }}
              className={styles.imageWrapper}
            >
              <Image
                src={imageData[currentImage]}
                alt="Slider Image 1"
                fill
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.imageContainer2}>
          <AnimatePresence>
            <motion.div
              key={(currentImage + 1) % imageData.length}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={imageVariants}
              transition={{ duration: 0.8 }}
              className={styles.imageWrapper}
            >
              <Image
                src={imageData[(currentImage + 1) % imageData.length]}
                alt="Slider Image 2"
                fill
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.info}>
          <h1 className={styles.collection_title}>{mainData[currentImage].collection ? mainData[currentImage].collection.title : ''}</h1>
          <p className={styles.collection_text}>{mainData[currentImage].text || 'НОВИНКИ'}</p>
        </div>
      </div>
    </div>
  ) : (
    <Spin />
  )
}

export default ImageSlider
