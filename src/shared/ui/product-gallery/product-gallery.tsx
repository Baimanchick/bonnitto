'use client'

import React from 'react'
import toast from 'react-hot-toast'

import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'

import cls from './product-gallery.module.css'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

interface ProductGalleryProps {
  images: string[] | undefined;
  big_image: string
}

export default function ProductGallery({ images, big_image }: ProductGalleryProps) {
  const [open, setOpen] = React.useState(false)
  const slides = images?.map((img) => ({ src: img }))

  return (
    <>
      <div className={cls.mainImage_conatiner}>
        <Image
          src={images && images.length > 0 ? images[0] : big_image}
          alt="Product image"
          width={0}
          height={0}
          sizes="100vw"
          className={cls.main_image}
          priority
          unoptimized
          onClick={() => images && images.length !== 0 ? setOpen(true) : toast.error('У продукта нет картинок')}
        />
      </div>
      <div className={cls.image_container}>
        {images?.map((item, index) => (
          <Image
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            src={item}
            alt={`Product image ${index}`}
            width={0}
            height={0}
            sizes="100vw"
            unoptimized
            onClick={() => setOpen(true)}
            className={cls.image_container__item}
          />
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Thumbnails]}
      />
    </>
  )
}
