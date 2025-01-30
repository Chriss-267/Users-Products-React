import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function ActualizarProducto() {
    const { id } = useParams(); // Obtener el id del producto desde la URL
    const navigate = useNavigate();

    // Estados para los datos del formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [distributor_id, setDistributorId] = useState("");
    const [status, setStatus] = useState("available");

    // Estados para las opciones de categorías y distribuidores
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);

    // Estado para manejar la carga de datos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener el producto a actualizar y las categorías/distribuidores
    useEffect(() => {
        // Obtener las categorías y distribuidores
        axios.get("http://localhost:8000/api/product-categories/show")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => console.error("Error al obtener las categorías:", error));

        axios.get("http://localhost:8000/api/distributors/show")
            .then((response) => {
                setDistributors(response.data);
            })
            .catch((error) => console.error("Error al obtener los distribuidores:", error));

        // Obtener los datos del producto
        axios.get(`http://localhost:8000/api/products/show/${id}`)
            .then((response) => {
                const product = response.data;
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setStock(product.stock);
                setCategoryId(product.category_id);
                setDistributorId(product.distributor_id);
                setStatus(product.status);
                setLoading(false);
            })
            .catch((error) => {
                setError("Producto no encontrado.");
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .patch(`http://localhost:8000/api/products/update/${id}`, {
                name,
                description,
                price,
                stock,
                category_id,
                distributor_id,
                status,
            })
            .then(() => navigate("/")) // Redirigir a la lista de productos
            .catch((error) => console.error("Error al actualizar el producto:", error));
    };

    if (loading) return <div className='text-6xl font-bold text-center'>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className='flex justify-end mb-4'>
                <Link to="/productos">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Regresar a productos
                    </button>
                </Link>
            </div>
            <h1 className='text-6xl font-bold text-center'>Actualizar Producto</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Precio"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <select
                        value={category_id}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <select
                        value={distributor_id}
                        onChange={(e) => setDistributorId(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un distribuidor</option>
                        {distributors.map((distributor) => (
                            <option key={distributor.id} value={distributor.id}>
                                {distributor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="available">Available</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="discontinued">Discontinued</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                    Actualizar
                </button>
            </form>
        </div>
    );
}

export default ActualizarProducto;
