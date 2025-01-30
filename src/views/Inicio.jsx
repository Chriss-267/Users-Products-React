import React from 'react'
import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <div className='text-6xl font-bold text-center'><Link to="/productos">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ir a productos
      </button>
    </Link></div>
  )
}
