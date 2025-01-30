import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-b from-red-400 to-white'>


        <main className='flex flex-col md:flex-row md:justify-center items-center gap-3 w-[70vw] bg-black/60 md:h-[90vh] h-[95vh] rounded-xl'>
            <div className='md:!order-1 order-2 '>
              <Outlet/>
            </div>
            
            <img className= ' w-28 md:w-96 rounded-lg md:order-2 order-1  mt-6' src="../images/logo.jpg" alt="Logo" />
           
        </main>
        

    </div>
  )
}
