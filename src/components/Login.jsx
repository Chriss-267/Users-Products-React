import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AlertaError from './AlertaError';
import { createRef, useState } from 'react';
import Spinner from '../spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Importar iconos

export default function Login() {
  const { login, loginLoading } = useAuth({ middleware: "guest", url: "/" });

  const emailRef = createRef();
  const passwordRef = createRef();

  const [errores, setErrores] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  const handleSubmit = async e => {
    e.preventDefault();

    const datos = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    };

    login(datos, setErrores);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alternar la visibilidad de la contraseña
  };

  return (
    <div>
      <form action="" className='w-96 p-6 space-y-2' noValidate onSubmit={handleSubmit}>
        <h1 className='text-white text-4xl font-bold text-center'>Log In</h1>
        <p className='text-white mb-6'>Let's to start</p>

        <div>
          <label htmlFor="email" className='font-bold text-white'>Email</label>
          <input
            type="email"
            placeholder='Your Email'
            id='email'
            name='email'
            className='block p-2 w-full rounded-2xl bg-black placeholder:text-white text-white caret-white'
            ref={emailRef}
          />
        </div>

        <div className='mt-6 relative'>
          <label htmlFor="password" className='font-bold text-white'>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Cambiar el tipo de input dinámicamente
              placeholder='Your Password'
              id='password'
              name='password'
              className='block p-2 w-full rounded-2xl bg-black placeholder:text-white text-white caret-white pr-10' // Añadir padding a la derecha
              ref={passwordRef}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              {showPassword ? (
                <span className="text-white">
                  <FontAwesomeIcon icon={faEye} /> {/* Icono de ojo abierto */}
                </span>
              ) : (
                <span className="text-white">
                  <FontAwesomeIcon icon={faEyeSlash} /> {/* Icono de ojo cerrado */}
                </span>
              )}
            </button>
          </div>
        </div>

        <input
          type="submit"
          value="Log In"
          className='bg-red-400 mt-4 w-full p-2 font-bold text-xl rounded-xl hover:bg-red-300 cursor-pointer'
        />
      </form>

      <section className='text-center mb-2'>
        <Link to="/auth/register" className='text-white !no-underline'>Don't have an account yet?</Link>
      </section>

      {errores ? errores.map((error, i) => <AlertaError key={i}> {error}</AlertaError>) : null}
      {loginLoading && <Spinner />}
    </div>
  );
}