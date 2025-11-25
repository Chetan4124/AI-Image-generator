import React,{useContext} from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const GenerateTextBtn = () => {
    const {user ,setShowLogin} =useContext(AppContext)
  const navigate =useNavigate()
  const onclickHandler =()=>{
    if(user){ navigate('/generate-text') }
    else{ setShowLogin(true) }
  }

  return (
    <div className='flex flex-col items-center justify-center max-w-sm w-full bg-white/60 border border-gray-100 rounded-xl p-5 shadow-md mx-4 transform hover:translate-y-[-3px] transition-all duration-300'>
      <div className='flex items-center gap-3 mb-3'>
        <img src={assets.star_group} alt="" className='w-6 h-6'/>
        <h4 className='text-lg font-medium text-neutral-700'>Generate Text</h4>
      </div>
      <p className='text-xs text-neutral-600 text-center mb-3'>AI-crafted copy — descriptions, summaries, and short creative pieces.</p>
      <button className='inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-sm w-full max-w-xs hover:scale-105 transition-transform duration-200'
      onClick={onclickHandler}
      >
        <span className='text-sm font-semibold'>Try Text Generator</span>
      </button>
    </div>
  )
}

export default GenerateTextBtn
