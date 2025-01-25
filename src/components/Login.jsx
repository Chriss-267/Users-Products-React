import React from 'react'

export default function 
login() {
  return (
    <div>
        <form action="" className='w-96 bg-white p-6 shadow-xl rounded space-y-2' noValidate>
           
            <div className=''>
                <label htmlFor="email" className='font-bold uppercase text-xl text-slate-400'>Email</label>
                <input type="email" placeholder='Tu Email' id='email' name='email' className='block p-2 border w-full '/>
            </div>
            <div className=''>
                <label htmlFor="password" className='font-bold uppercase text-xl text-slate-400'>password</label>
                <input type="password" placeholder='Tu Password' id='password' name='password' className='block p-2 border w-full '/>
            </div>
            
            <input type="submit" value="Log In" className='bg-indigo-500 w-full p-2 text-white font-bold text-xl rounded mt-2 hover:bg-indigo-700 cursor-pointer'/>
        </form>
    </div>
  )
}
