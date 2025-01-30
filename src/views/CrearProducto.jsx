import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function CrearProducto() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [distributor_id, setDistributorId] = useState("");
    const [status, setStatus] = useState("available");
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/product-categories/show")
            .then(response => setCategories(response.data))
            .catch(error => console.error("Error al obtener categorías:", error));

        axios.get("http://localhost:8000/api/distributors/show")
            .then(response => setDistributors(response.data))
            .catch(error => console.error("Error al obtener distribuidores:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            name,
            description,
            price,
            stock,
            category_id,
            distributor_id,
            status,
        });
        axios
            .post("http://localhost:8000/api/products/create", {
                name,
                description,
                price,
                stock,
                category_id,
                distributor_id,
                status,
            })
            .then(() => navigate("/"))
            .catch((error) => console.error(error));
    };

    return (
        <div className="container mx-auto p-6">
            <div className='flex justify-end mb-4'>
                <Link to="/productos">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Regresar a productos
                    </button>
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-8">Crear Producto</h1>
            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-8">
                    <textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows="4"
                    />
                </div>

                <div className="mb-8">
                    <input
                        type="number"
                        placeholder="Precio"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-8">
                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-8">
                    <select
                        value={category_id}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccione una categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-8">
                    <select
                        value={distributor_id}
                        onChange={(e) => setDistributorId(e.target.value)}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccione un distribuidor</option>
                        {distributors.map((distributor) => (
                            <option key={distributor.id} value={distributor.id}>{distributor.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-8">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="available">Disponible</option>
                        <option value="out_of_stock">Fuera de inventario</option>
                        <option value="discontinued">Descontinuado</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md w-full"
                >
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default CrearProducto;