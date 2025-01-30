import useSWR, { mutate } from "swr"
import clienteAxios from "../config/axios"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"


export default function useAuth({middleware, url}) {

    const token = sessionStorage.getItem("AUTH_TOKEN")
    const navigate = useNavigate()

    const {data : user, error, mutate} = useSWR("api/user", () =>
        clienteAxios.get("/api/user", {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error =>{
            throw Error(error?.response?.data?.errors)
        })
    )

    const [loginLoading, setLoginLoading] = useState(false)

    const login = async (datos, setErrores) =>{
        try {
            setLoginLoading(true)
            const {data} = await clienteAxios.post("/api/login", datos)

            sessionStorage.setItem("AUTH_TOKEN", data.token)
            setErrores([])
            await mutate()
            
        } catch (error) {
            setErrores(Object.values(error.response.data.errors))
        }   finally {
            setLoginLoading(false) 
        }

    }

    const logout = async () => {
        try {
          await clienteAxios.post("/api/logout", null, {
            headers: { Authorization: `Bearer ${token}` },
          });
          sessionStorage.removeItem("AUTH_TOKEN");
          await mutate(undefined); 
        } catch (error) {
          throw Error(error?.response?.data?.errors);
        }
      };

      useEffect(() =>{
        if (middleware === "guest" && url && user) {
            navigate(url);
        }
        
        if (middleware === "auth" && error) {
            navigate("/auth/login");
        }
      }, [user, error])
      


  return {
        login,
        logout,
        user,
        error,
        loginLoading
  }
}
