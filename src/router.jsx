import { createBrowserRouter } from "react-router-dom"
import AuthLayout from "./Layouts/AuthLayout"
import Login from "./components/Login"
import Register from "./components/Register"
import Inicio from "./views/Inicio"
import ProductList from "./views/ProductosList"
import CrearProducto from "./views/CrearProducto"
import ActualizarProducto from "./views/ActualizarProducto"
import Layout from "./Layouts/Layout"


const router = createBrowserRouter([
    {
        path : "/",
        element : <Layout/>,
        children : [
            {
                index : true,
                element : <Inicio/>
            },
            {
                path : "/productos",
                element : <ProductList/>
            },
            {
                path : "/crearProducto",
                element : <CrearProducto/>
            },
            {
                path : "/actualizarProducto/:id",
                element : <ActualizarProducto/>
            }
        ]
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
