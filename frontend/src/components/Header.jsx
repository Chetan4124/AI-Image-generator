import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import {motion, scale} from "framer-motion"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


const Header = () => {
  const {user ,setShowLogin} =useContext(AppContext)
  const navigate =useNavigate()
  const onclickHandler =()=>{
    if(user){ navigate('/result')

    }
    
  else{
   setShowLogin(true)
  }
}
  return (
    < motion.div className='flex flex-col justify-center items-center text-center my-20'
    initial={{opacity:0.2 ,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1 ,y:0}}
    viewport={{once:true}}
    >
        <motion.div
        className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500'
     initial={{opacity:0.2 ,y:-20}}
 
   animate={{opacity:1 ,y:0}}
    
       transition={{ delay:0.2,duration:0.8}}
        
        >
            <p>Best text to image generator </p>
<img src={assets.star_icon} alt="" />
        </motion.div>
        <h1 className='text-4xl max-w-[300px]sm:text -7xl sm:maz-w-[590px]mx-auto mt-10 text-center'>Turn text to <span className='text-blue-600'>image</span> in seconds</h1>
        <p className='text-center max-w-xl mx-auto mt-5'>Turn your ideas into stunning images in seconds — AI-powered image generation at your fingertips.</p>
        <motion.button className='sm:text-lg text-white bg-black w-auto mt-8 px-12 flex items-center gap-2 rounded-full'
        onClick={onclickHandler}
        whileHover ={{scale:1.05}}
        whileTap={{scale:0.95}}

        
        
        >Generate Images
            <img className='h-6' src={assets.star_group} alt="" />
        </motion.button>

     <div className='flex flex-wrap justify-center mt-16 gap-3'>
  {Array(6).fill("").map((_, index) => (
    <img  className='rounded hover:scale-105 transtion -all duration-300 cursor-pointer max-sm:w-10'
    src={index % 2=== 0 ? assets.sample_img_2:assets.sample_img_1} key={index} width={70} />
  ))}
</div>
<p className='mt-2 text-neutral-600'>Generated Images from Pixogenie</p>
    </motion.div>
  )
}

export default Header