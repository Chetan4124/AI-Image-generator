import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import GenerateBtn from '../components/GenerateBtn'
import GenerateTextBtn from '../components/GenerateTextBtn'



const Home = () => {
  return (
    <div>
       <Header/>
       <Steps/>
       <Description/>

      {/* Generator choices - aligned and balanced */}
      <section className='my-12 flex flex-col items-center'>
        <div className='max-w-5xl w-full bg-gradient-to-br from-slate-50/60 via-white/40 to-slate-50/50 border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
            <div className='flex-1 flex items-center justify-center'>
              <GenerateBtn/>
            </div>
            <div className='flex items-center justify-center text-gray-400 text-sm font-medium hidden sm:block'>
              <div className='px-4 py-2 rounded-full bg-white/30 border border-gray-100 shadow-inner'>
                OR
              </div>
            </div>
            <div className='flex-1 flex items-center justify-center'>
              <GenerateTextBtn/>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default Home