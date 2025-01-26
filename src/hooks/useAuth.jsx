import { mutate } from "swr"
import clienteAxios from "../config/axios"
import { useNavigate } from "react-router-dom"


export default function useAuth() {

    const navigate = useNavigate()

    const login = async (datos, setErrores) =>{
        try {

            const {data} = await clienteAxios.post("/api/login", datos)

            sessionStorage.setItem("AUTH_TOKEN", data.token)
            setErrores([])
            await mutate()

            navigate("/")
            
            
        } catch (error) {
            setErrores(Object.values(error.response.data.errors))
        }
    }


  return {
        login
  }
}
