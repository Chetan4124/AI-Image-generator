import React,{useContext} from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

import { useNavigate } from 'react-router-dom'

const GenerateBtn = () => {
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
    <div className='flex flex-col items-center justify-center max-w-md w-full bg-gradient-to-br from-white/60 via-white/40 to-white/40 border border-gray-100 rounded-xl p-6 shadow-lg mx-4 transform hover:scale-[1.01] transition-all duration-300'>
      <div className='flex items-center gap-3 mb-3'>
        <img src={assets.star_group} alt="star" className='w-7 h-7'/>
        <h3 className='text-xl md:text-2xl font-semibold text-neutral-800'>Generate Images</h3>
      </div>
      <p className='text-sm text-neutral-600 text-center mb-4'>Create photorealistic images from simple prompts — fast and beautiful.</p>
      <button className='inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white shadow-xl w-full max-w-xs hover:scale-105 transition-transform duration-200'
      onClick={onclickHandler}
      >
        <span className='text-sm font-medium'>Try Image Generator</span>
      </button>
    </div>
  )
}

export default GenerateBtn