import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-red-400 to-white px-4 sm:px-6 md:px-8">
      <main className="flex flex-col md:flex-row md:justify-center items-center gap-3 w-[90vw] md:w-[70vw] bg-black/60 min-h-[80vh] rounded-xl p-4">
        {/* Contenedor del Outlet */}
        <div className="md:!order-1 order-2 flex-grow w-full">
          <Outlet />
        </div>

        {/* Contenedor de la imagen */}
        <div className="flex justify-center items-center md:order-2 order-1 mt-6 md:mt-0">
          <img
            className="max-w-28 md:max-w-96 lg:max-w-[300px] xl:max-w-[400px] rounded-lg"
            src="/images/logo.jpg" // Ajusta la ruta aquí
            alt="Logo"
          />
        </div>
      </main>
    </div>
  );
}
