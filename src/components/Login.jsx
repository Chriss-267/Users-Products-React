
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import AlertaError from './AlertaError';
import { createRef, useState } from 'react';
import Spinner from '../spinner/Spinner';



export default function Login() {

  
  const {login, loginLoading} = useAuth({middleware : "guest", url : "/"})

  const emailRef = createRef();
  const passwordRef = createRef();

  const [errores, setErrores] = useState([])

  const handleSubmit = async e => {
    e.preventDefault()

    const datos = {
      email : emailRef.current.value,
      password : passwordRef.current.value
    }

    login(datos, setErrores)




  }

  return (
    <div>
        <form action="" className='w-96 p-6 space-y-2' noValidate onSubmit={handleSubmit}>

          

          <h1 className='text-white text-4xl font-bold text-center'>Log In</h1>
          <p className='text-white mb-6'>Let's to start</p>
           
            <div className=''>
                <label htmlFor="email" className='font-bold text-white'
                >Email</label>
                <input type="email" placeholder='Your Email' id='email' name='email' 
                className='block p-2 w-full rounded-2xl bg-black placeholder:text-white text-white caret-white'
                
                ref={emailRef}/>
            </div>
            <div className='mt-6'>
                <label htmlFor="password" className='font-bold text-white'>Password</label>
                <input type="password" placeholder='Your Password' id='password' name='password'
                className='block p-2 w-full rounded-2xl bg-black placeholder:text-white text-white caret-white'
                ref={passwordRef}/>
                
            </div>
            
            <input type="submit" value="Log In" className='bg-red-400 mt-4 w-full p-2 font-bold text-xl rounded-xl hover:bg-red-300 cursor-pointer'/>
        </form>

        

        <section className='text-center mb-2'>
            <Link to= "/auth/register" className='text-white !no-underline'>Don't have an account yet?</Link>
        </section>

        {errores ? errores.map((error, i) => <AlertaError key={i}> {error}</AlertaError>) : null}
        {loginLoading && <Spinner/>}
    </div>
  )
}
