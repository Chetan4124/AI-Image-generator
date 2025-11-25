import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const GenerateText = ()=>{
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { backendUrl, token, setShowLogin, user, setCredit } = useContext(AppContext)

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError(null)
    setResult('')
    if(!user){ setShowLogin(true); return }
    if(!prompt || !prompt.trim()){ setError('Please enter a prompt'); return }

    try{
      setLoading(true)
      const res = await fetch(`${backendUrl}/api/text/generate-text`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if(!data.success){ setError(data.message || 'Failed to generate text') }
      else{
        setResult(data.generatedText)
        if(typeof setCredit === 'function' && data.creditBalance !== undefined){ setCredit(data.creditBalance) }
      }
    }catch(err){
      console.error(err)
      setError('Network error or server issue')
    }finally{ setLoading(false) }
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className='min-h-[80vh] flex flex-col items-center justify-center px-4'>
      <form onSubmit={onSubmit} className='max-w-2xl w-full bg-white p-6 rounded shadow'>
        <h1 className='text-2xl font-semibold mb-4'>Generate Text</h1>
        <p className='text-sm text-gray-600 mb-4'>Write a short prompt and let the generator produce a creative result.</p>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={6} className='w-full border p-3 rounded resize-none' placeholder='e.g. Write a friendly product description for a smart water bottle.' />
        {error && <p className='text-red-600 mt-2'>{error}</p>}
        <div className='flex gap-4 mt-4'>
          <button disabled={loading} className='px-6 py-2 rounded bg-indigo-600 text-white'>{loading ? 'Generating...' : 'Generate'}</button>
          <button type='button' onClick={()=>{ setPrompt(''); setResult(''); setError(null) }} className='px-6 py-2 rounded border'>Clear</button>
        </div>
      </form>

      {result ? (
        <div className='max-w-2xl w-full mt-6 p-6 bg-white rounded shadow'>
          <h2 className='font-semibold mb-2'>Result</h2>
          <pre className='whitespace-pre-wrap text-sm text-gray-800'>{result}</pre>
        </div>
      ) : null}
    </motion.div>
  )
}

export default GenerateText
