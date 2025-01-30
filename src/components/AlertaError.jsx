import React from 'react'

export default function AlertaError({children}) {
  return (
    <div className='p-2 bg-red-200 border-l-2 border-red-500 font-bold'>
      {children}
    </div>
  )
}
