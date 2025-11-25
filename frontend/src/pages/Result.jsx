import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import {motion, scale} from "framer-motion"
import { AppContext } from '../context/AppContext'
const Result = () => {
const [image, setImage]= useState(assets.sample_img_1)
const [isImageLoaded ,setIsImageLoaded] =useState(false)
const [loading,setLoading] =useState(true)
const [input,setInput]= useState('')
const [error,setError]= useState(null)
const { backendUrl, token, setCredit, setShowLogin, user } = useContext(AppContext)
const onSubmitHandler = async (e )=>{
  e.preventDefault()
  setError(null)
  if(!user){
    setShowLogin(true)
    return
  }
  if(!input || input.trim()===''){
    setError('Please enter a prompt')
    return
  }
  try{
    setLoading(true)
    // call backend to generate image
    const res = await fetch(`${backendUrl}/api/image/generate-image`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ prompt: input })
    })
    const data = await res.json()
    if(!data.success){
      setError(data.message || 'Generation failed')
      setLoading(false)
      return
    }
    setImage(data.image)
    setIsImageLoaded(true)
    setLoading(false)
    if(typeof setCredit === 'function' && data.creditBalance !== undefined){
      setCredit(data.creditBalance)
    }
  }catch(err){
    console.error(err)
    setError('Network error or server issue')
    setLoading(false)
  }
}

  return (
  <motion.form
 initial={{opacity:0.2 ,y:100}}
 transition={{duration:1}}
 whileInView={{opacity:1,y:0}}
 viewport={{once:true}}



  onSubmit={onSubmitHandler}
  className='flex flex-col min-h-[90vh] justify-center items-center'>
      <div>
      <div className="relative">
        <img src={image} alt="" className='max-w-sm rounded'/>
        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500${loading ?  'w-full transition-all duration-[10s]' :''}`}></span>
        <p className={!loading ? 'hidden':'w-0'}>Loading....</p>
      </div>
      {error && <p className='text-red-600 mt-4'>{error}</p>}
      {!isImageLoaded &&
      <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
        <input
        onChange={e =>setInput(e.target.value)} value={input}
        type="text" placeholder='Describe what U want to Generate 'className='flex-1 bg-transparent outline-none  ml-8 max-sm:w-20 placeholder-color'/>
        <button type='Submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
      </div>}
    </div>
    {isImageLoaded &&
    <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
      <p  onClick={()=>{setIsImageLoaded(false)}} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
      <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
    </div>}
  </motion.form>
  )
}

export default Result