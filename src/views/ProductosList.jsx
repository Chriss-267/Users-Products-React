import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);

    const getCategoryName = (categoryId) => {
        console.log('categoryId:', categoryId);
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : "Sin categoría";
    };

    const getDistributorName = (distributorId) => {
        const distributor = distributors.find(dist => dist.id === distributorId);
        return distributor ? distributor.name : "Sin distribuidor";
    };


    useEffect(() => {
        // Realiza la solicitud GET para obtener los productos
        fetch(`${import.meta.env.VITE_API_URL}/api/products/show`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching products');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data); // Guarda los productos en el estado
                setLoading(false); // Cambia el estado de carga
            })
            .catch((error) => {
                setError(error.message); // Si hay un error, lo guardamos
                setLoading(false); // Cambia el estado de carga
            });

        // Obtener las categorías
        fetch(`${import.meta.env.VITE_API_URL}/api/product-categories/show`)
            .then((response) => response.json())
            .then((data) => {
                setCategories(data); // Asumimos que la respuesta es un array de categorías
            })
            .catch((error) => console.error('Error fetching categories:', error));

        // Obtener los distribuidores
        fetch(`${import.meta.env.VITE_API_URL}/api/distributors/show`)
            .then((response) => response.json())
            .then((data) => {
                setDistributors(data); // Asumimos que la respuesta es un array de distribuidores
            })
            .catch((error) => console.error('Error fetching distributors:', error));

    }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

    const handleDelete = (id) => {
        // Realizar la solicitud DELETE para eliminar el producto
        axios
            .delete(`${import.meta.env.VITE_API_URL}/api/products/delete/${id}`)
            .then(() => {
                // Actualizar la lista de productos después de eliminar
                setProducts(products.filter((product) => product.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                setError("Error al eliminar el producto.");
            });
    };

    if (loading) {
        return <div className='my-20'><Spinner/> </div>// spinner de carga
    }

    if (error) {
        return <div className='text-6xl font-bold text-center'>Error: {error}</div>; // Muestra un mensaje de error si hay problemas con la solicitud
    }

    return (
        <div className="container mx-auto p-4">
            {products.length === 0 ? (
                <div className="text-center text-xl">
                    <p className='text-6xl font-bold text-center'>No hay productos registrados.</p>
                    <Link to="/crearProducto">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Agregar un producto
                        </button>
                    </Link>
                </div>
            ) : (

                <div className="container mx-auto p-4 mb-4">
                    <div className='flex justify-end mb-4'>
                        <Link to="/crearProducto">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Agregar un producto
                            </button>
                        </Link>
                    </div>
                    <p className='text-6xl font-bold text-center'>Productos disponibles</p>
                    <table className="table-auto w-full border border-gray-300 shadow-md rounded-lg"> {/* Tabla principal */}
                        <thead>
                            <tr className="bg-gray-100 hover:bg-gray-200 transition duration-300"> {/* Encabezado de la tabla */}
                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-4 py-2">Descripción</th>
                                <th className="border border-gray-300 px-4 py-2">Distribuidor</th>
                                <th className="border border-gray-300 px-4 py-2">Categoria</th>
                                <th className="border border-gray-300 px-4 py-2">Precio</th>
                                <th className="border border-gray-300 px-4 py-2">Stock</th>
                                <th className="border border-gray-300 px-4 py-2">Estado</th>
                                <th className="border border-gray-300 px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {products.map((product, index) => (
                                <tr key={product.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 w-1/3 whitespace-normal break-words">{product.description}</td>
                                    <td className="border border-gray-300 px-4 py-2">{getDistributorName(product.distributor_id)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{getCategoryName(product.category_id)}</td>
                                    <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">
                                        ${product.price}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-blue-500">{product.stock}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-yellow-500">
                                        {product.status === 'available' ? 'Disponible' :
                                            product.status === 'out_of_stock' ? 'Fuera de Inventario' :
                                                product.status === 'discontinued' ? 'Descontinuado' :
                                                    'Estado desconocido'}
                                    </td>
                                    <td className="border px-4 py-2 flex justify-center space-x-4">
                                        <Link to={`/actualizarProducto/${product.id}`} title='Actualizar'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Link>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => handleDelete(product.id)}
                                            title="Eliminar">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ProductList;
