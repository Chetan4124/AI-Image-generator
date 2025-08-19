import React,{useContext} from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/appContext'

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
    <div className='pb-16 text-center' >
        <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16 justify-center'>See the magic .Try NOW!</h1>
        <button className='inline-flex items-center gap-2 px-12 py-13 rounded-full bg-black text-white m-auto hovwe:scale-10 transiton-all duration-500'
        onClick={onclickHandler}
        >Generate Images
            <img src={assets.star_group} alt=""  className='h-6'/>
        </button>
    </div>
  )
}

export default GenerateBtn