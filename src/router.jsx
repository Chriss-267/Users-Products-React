import { createBrowserRouter } from "react-router-dom"
import AuthLayout from "./Layouts/AuthLayout"
import Login from "./components/Login"
import Register from "./components/Register"


const router = createBrowserRouter([
    {
        path : "/",
        element : <Login/>
    },
    {
        path : "/auth",
        element : <AuthLayout/>,
        children : [
            {
            path : "/auth/login",
            element : <Login/>
            },
            {
                path : "/auth/register",
                element : <Register/>
            }
        ] 
    }
])

export default router
