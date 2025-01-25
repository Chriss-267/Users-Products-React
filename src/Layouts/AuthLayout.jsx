import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className='h-screen flex justify-center items-center'>

        <div className='flex justify-between gap-10 w-auto'>
            <img className='w-[35vw] rounded' src="../images/register.jpg" alt="Logo" />
            <Outlet/>
        </div>
        

    </div>
  )
}
