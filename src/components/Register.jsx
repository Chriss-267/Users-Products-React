import React, { useState } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await clienteAxios.post("/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      // Guardar el token en sessionStorage y redirigir al usuario
      sessionStorage.setItem("AUTH_TOKEN", data.token);
      setSuccess("User registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });

      // Redirigir al inicio después de registrarse
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Error status:", error.response.status); // Código de error
        console.error("Error data:", error.response.data); // Datos del servidor
      } else if (error.request) {
        console.error("No response received:", error.request); // Sin respuesta
      } else {
        console.error("Error setting up request:", error.message); // Error en Axios
      }
      setError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alternar visibilidad de la contraseña
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword); // Alternar visibilidad de la confirmación de contraseña
  };

  return (
    <div className="w-full max-w-md p-6 space-y-4 bg-black/60 rounded-lg">
      <h2 className="text-white text-4xl font-bold text-center">Register</h2>
      <form
        action=""
        className="max-w-sm w-full p-6 space-y-2"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
          />
        </div>

        <div className="form-group relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"} // Cambiar tipo de input dinámicamente
            id="password"
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 pr-10" // Añadir padding a la derecha
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            style={{ top: "70%", transform: "translateY(-50%)" }}
          >
            {showPassword ? (
              <span className="text-gray-500">
                <FontAwesomeIcon icon={faEye} /> {/* Icono de ojo abierto */}
              </span>
            ) : (
              <span className="text-gray-500">
                <FontAwesomeIcon icon={faEyeSlash} />{" "}
                {/* Icono de ojo cerrado */}
              </span>
            )}
          </button>
        </div>

        <div className="form-group relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-white"
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"} // Cambiar tipo de input dinámicamente
            id="confirmPassword"
            name="password_confirmation"
            placeholder="Confirm Your Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 pr-10" // Añadir padding a la derecha
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            style={{ top: "70%", transform: "translateY(-50%)" }}
          >
            {showConfirmPassword ? (
              <span className="text-gray-500">
                <FontAwesomeIcon icon={faEye} /> {/* Icono de ojo abierto */}
              </span>
            ) : (
              <span className="text-gray-500">
                <FontAwesomeIcon icon={faEyeSlash} />{" "}
                {/* Icono de ojo cerrado */}
              </span>
            )}
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          className="bg-red-400 mt-4 w-full p-2 font-bold text-xl rounded-xl hover:bg-red-300 cursor-pointer"
        >
          Register
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-white">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-white font-bold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
