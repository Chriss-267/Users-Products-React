import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

function ProductList() {
    const { user } = useAuth({ middleware: "" }); // Obtenemos el usuario autenticado
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);

    const [showReviewModal, setShowReviewModal] = useState(false); // Para mostrar el modal de reseña
    const [selectedProductId, setSelectedProductId] = useState(null); // ID del producto seleccionado
    const [reviewData, setReviewData] = useState({
        comment: '',
        rating: 1,
    });

    const getCategoryName = (categoryId) => {
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
            // PARTE CARLOS FLORES
            .then((data) => {
                // Realizamos la solicitud para obtener las valoraciones promedio de cada producto
                fetch(`${import.meta.env.VITE_API_URL}/api/review/average`)
                    .then((ratingResponse) => {
                        if (!ratingResponse.ok) {
                            throw new Error('Error fetching ratings');
                        }
                        return ratingResponse.json();
                    })
                    .then((ratingData) => {
                        // Mapeamos los productos para agregarles el rating promedio
                        const updatedProducts = data.map((product) => {
                            // Buscar el rating promedio correspondiente al producto
                            const productRating = ratingData.data.find(rating => rating.id === product.id);
                            return {
                                ...product,
                                average_rating: productRating ? productRating.average_rating : 0, // Agregar el rating promedio o 0 si no existe
                            };
                        });
                        setProducts(updatedProducts); // Guardar los productos con el rating agregado
                        setLoading(false); // Cambia el estado de carga
                    })
                    .catch((error) => {
                        setError(error.message);
                        setLoading(false);
                    });
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

        Swal.fire({
            title: "¿Estas seguro de eliminar este producto?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
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

                Swal.fire({
                    title: "Eliminado!",
                    text: "El Producto ha sido eliminado",
                    icon: "success"
                });
            }

        });

    };

    // PARTE CARLOS FLORES
    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleOpenReviewModal = (productId) => {
        setSelectedProductId(productId); // Guardamos el ID del producto seleccionado
        setShowReviewModal(true); // Mostramos el modal
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false); // Cerramos el modal
        setReviewData({ comment: '', rating: 1 }); // Limpiamos los datos del formulario
    };

    const handleSubmitReview = () => {
        // Verificamos que el usuario esté autenticado
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, inicia sesión para dejar una reseña.',
            });
            return;
        }

        const reviewPayload = {
            user_id: user.id, // Usamos el user_id del usuario autenticado
            products_id: selectedProductId,
            comment: reviewData.comment,
            rating: reviewData.rating,
        };

        axios
            .post(`${import.meta.env.VITE_API_URL}/api/review/create`, reviewPayload)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Reseña guardada',
                    text: '¡Reseña guardada con éxito!',
                }).then(() => {
                    window.location.reload();
                })
                handleCloseReviewModal();
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar la reseña',
                });
            });
    };

    if (loading) {
        return <div className='my-20'><Spinner /> </div>// spinner de carga
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
                                <th className="border border-gray-300 px-4 py-2">Valoraciones</th>
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
                                    {/*         PARTE CARLOS FLORES              */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        {product.average_rating != null && !isNaN(product.average_rating) ? (
                                            <>
                                                <span className="font-bold">{Number(product.average_rating).toFixed(1)}</span>
                                                <span className="ml-2 text-yellow-500">
                                                    {/* Solo una estrella acompañando el promedio */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-5 h-5 inline-block"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 17.27l4.15 2.73-1.05-4.92L20 9.24l-4.91-.42L12 2 8.91 8.82 4 9.24l3.9 5.84-1.05 4.92L12 17.27z"
                                                        />
                                                    </svg>
                                                </span>
                                            </>
                                        ) : (
                                            <span>No hay valoraciones</span>
                                        )}
                                    </td>


                                    <td className="border px-4 py-2 flex justify-center space-x-4">
                                        <Link to={`/actualizarProducto/${product.id}`} title='Actualizar'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Link>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => handleDelete(product.id)} title="Eliminar">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => handleOpenReviewModal(product.id)} title="Favorito">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para crear reseña PARTE CARLOS FLORES     */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Cuéntanos tu Experiencia</h2>
                            <button onClick={handleCloseReviewModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-lg font-medium text-gray-700 mb-2">Comentario</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows="4"
                                    value={reviewData.comment}
                                    onChange={handleReviewChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Calificación</label>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill={star <= reviewData.rating ? 'currentColor' : 'none'}
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className={`w-6 h-6 cursor-pointer ${star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-400'}`}
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={handleCloseReviewModal}
                                    className="bg-gray-300 text-black py-2 px-6 rounded-full hover:bg-gray-400 transition duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
                                >
                                    Enviar Reseña
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    );
}

export default ProductList;
