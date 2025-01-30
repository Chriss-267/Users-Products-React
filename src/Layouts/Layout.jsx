import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'


export default function Layout() {

    
  const {user, error, logout} = useAuth({middleware : "auth"})
  const location = useLocation();
  const año = new Date().getFullYear();

  return (
    <div>
        <header className='flex justify-between px-5 items-center bg-black'>
            <Link to= "/">
                <img src="../images/logo.jpg" className='w-20' alt="Logo" />
            </Link>
            
            <nav className='flex w-lg gap-10 justify-between text-white font-bold items-center'>
            
                <Link to="/productos" className= {`!no-underline text-white ${
                    location.pathname === "/productos" ? "border-b-2 border-red-400" : ""
                }`}>Productos</Link>
                <Link className='!no-underline text-white'>Bienvenido: {user? user.name: ""}</Link>

                <button type='button'onClick={logout} className='px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-white'>
                    Cerrar Sesión
                </button>


            </nav>
        </header>
      
        <Outlet/>
       
        

        <footer className='bg-black p-4 text-white flex justify-evenly items-center font-bold'>
            <div>
                <p>Marcela Menjívar</p>
                <p>Melvin González</p>
                <p>Jose Jimenez</p>
                <p>Wilber Grande</p>
                <p>Carlos Flores</p>
                <p>Christian Monterrosa</p>
            </div>
            

            <img src="../images/logo.jpg" alt="logo" />

            <p>&copy; {año} Kodigo - FSJ24A</p>
            
        </footer>
    </div>
  )
}
