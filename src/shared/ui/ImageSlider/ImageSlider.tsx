'use client'

import React, { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const ImageSlider = () => {
  const images = [
    '/images/default_image_1.png',
    '/images/default_image_2.png',
    '/images/default_image_3.png',
    '/images/default_image_4.png',
  ]

  const [currentImage, setCurrentImage] = useState(0)
  const [screenHeight, setScreenHeight] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenHeight(window.innerHeight)
    }
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  const result = screenHeight - 80

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative', height: result }}>
        <AnimatePresence>
          <motion.div
            key={images[currentImage]}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={imageVariants}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <Image
              src={images[currentImage]}
              alt="Slider Image 1"
              fill
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ flex: 1, position: 'relative', height: result }}>
        <AnimatePresence>
          <motion.div
            key={images[(currentImage + 1) % images.length]}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={imageVariants}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <Image
              src={images[(currentImage + 1) % images.length]}
              alt="Slider Image 2"
              fill
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ImageSlider
