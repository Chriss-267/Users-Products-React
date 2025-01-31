import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center bg-gradient-to-b from-red-400 to-white px-4 sm:px-6 md:px-8">
      {/* Contenedor con fondo para abarcar ambos divs */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-[70vw] bg-black/60 min-h-[80vh] rounded-xl p-4">
        {/* Contenedor del Outlet (div1) - Arriba en móviles, izquierda en pantallas grandes */}
        <div className="div1 md:!order-1 order-2 flex flex-col flex-grow w-full md:w-1/2">
          <Outlet />
        </div>

        {/* Contenedor de la imagen (div2) - Abajo en móviles, derecha en pantallas grandes */}
        <div className="div2 md:order-2 order-1 flex justify-center items-center w-full md:w-1/2">
          <img
            className="max-w-28 md:max-w-96 lg:max-w-[300px] xl:max-w-[400px] rounded-lg"
            src="/images/logo.jpg"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  );
}