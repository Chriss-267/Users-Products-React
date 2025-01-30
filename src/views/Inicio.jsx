import useAuth from "../hooks/useAuth"


export default function Inicio() {

  const {user} = useAuth({middleware : ""})
  return (
    <div className=' bg-photo'>

      <div className="flex justify-around items-center h-96">
        <div className="w-96">
          <h1 className="text-white font-extrabold text-center mt-40 shadow-xl">Encuentra todo lo necesario en tecnología</h1>
        </div>
        
        <div>
          <p className="font-bold text-3xl text-white">Comencemos {user ? user.name : ""}</p>
        </div>
        </div>
        
    </div>
  )
}
