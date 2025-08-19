import React from 'react'
import { assets } from '../assets/assets'

const Description = () => {
  return (
    <div className='flex flex-col items-center justify-center my-24 p-6 md:px-28'> 
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>
            Create AI Images

        </h1>
        <p className='text-gray-500 mb-8'>
            Turn your imagination into visuals
        </p>
        <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
            <img src={assets.sample_img_1} alt="" className='w-80 xl:w-96 rounded-lg' />
            <div>
                <h2 className='text-2xl font-medium max-w-lg'>Introducing to AI powered Text generator</h2>
                <p className='text-gray-600 mb-4'>
                    Our AI-powered image generator transforms your ideas into breathtaking visuals within seconds. Simply describe what you imagine, and watch as our advanced algorithms bring your vision to life with remarkable detail, color, and creativity. Whether you need unique artwork, concept designs, product mockups, or just a touch of inspiration, our tool makes the process effortless.
                </p>
                <p className='text-gray-600 mb-4'>
                    Perfect for artists, marketers, developers, and dreamers alike, our platform delivers high-quality, ready-to-use images in a variety of styles. You can experiment with endless possibilities, tweak results until they match your vision, and download your creations instantly. 
                </p>
            </div>
        </div>
    </div>
  )
}

export default Description